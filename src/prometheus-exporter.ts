import { register, collectDefaultMetrics } from 'prom-client';
import Express from 'express';
import { login } from './commands/login';
import { Log } from './logger'
import { getStatus } from './commands/status'
import { getOverview } from './commands/overview'
import { MetricsBase, MetricTypes } from './metrics/metrics-base'
import { StatusMetric } from './metrics/status-metric';
import { OverviewMetric } from './metrics/overview-metric';
import { getDocsisStatus } from './commands/docsis';
import { DocsisMetric } from './metrics/docsis-metric';

export class PrometheusExporter {
    private readonly password: string
    private readonly httpServer: Express.Application
    private readonly scrapePort: Number
    private readonly logger: Log
    private readonly extractors = new Map<MetricTypes, MetricsBase<any>>

    /**
     * Create a new prometheus client
     */
    constructor(password: string, logger: Log) {
        this.logger = logger
        this.password = password
        this.scrapePort = 9705
        this.httpServer = Express()
        this.extractors.set(MetricTypes.Status, new StatusMetric("Status", "Help on Status"))
        this.extractors.set(MetricTypes.Overview, new OverviewMetric("Overview", "Help on Overview"))
        this.extractors.set(MetricTypes.Docsis, new DocsisMetric("Docsis", "Help on Docsis"))
        this.initServer()
    }

    private async scrape() {
        // Collect scrape duration and success for each extractor. Scrape success is initialized with False for
        // all extractors so that we can report a value for each extractor even in cases where we abort midway through
        // because we lost connection to the modem.
        let scrapeDuration = new Map<string, number>()  // type: Dict[str, float]
        let scrapeSuccess = new Map<string, boolean>() // metric name, flag

        let loginLogoutSuccess = true
        let modem

        // login
        try {
            modem = await login(this.password)
        } catch (error) {
            loginLogoutSuccess = false
            modem = null
            this.logger.warn('Not able to login')
        }

        if (modem == null) {
            loginLogoutSuccess = false
            return
        }

        let preScrapeTime = Date.now()
        let statusData = undefined
        let overviewData = undefined
        let docsisData = undefined

        try {
            // scrape status
            statusData = await getStatus(modem, this.logger)

            // get overview data, contains attached devices
            overviewData = await getOverview(modem, this.logger)

            // get docsis data
            docsisData = await getDocsisStatus(modem, this.logger)
        } catch (error) {
            this.logger.warn(error)
        }

        if (statusData != undefined) {
            (this.extractors.get(MetricTypes.Status) as StatusMetric)?.extract(statusData);
        }

        if (overviewData != undefined) {
            (this.extractors.get(MetricTypes.Overview) as OverviewMetric)?.extract(overviewData);
        }

        if (docsisData != undefined) {
            try {
                (this.extractors.get(MetricTypes.Docsis) as DocsisMetric)?.extract(docsisData)
            } catch (error) {
                this.logger.error('Catched exception in DocsisMetric gauge.set?!')
                this.logger.error(error)
            }
        }

        let postScrapeTime = Date.now()

        // logout after all data collected
        try {
            this.logger.log("Logout after scrape cycle.")
            await modem.logout()
        } catch (error) {
            this.logger.warn(error)
            loginLogoutSuccess = false
        }

        // summarize collected data
        scrapeDuration.set('status', postScrapeTime.valueOf() - preScrapeTime.valueOf())
        scrapeSuccess.set('status', statusData ? true : false)
        scrapeSuccess.set('loginLogout', loginLogoutSuccess)
    }

    private initServer() {
        // init metric handling
        collectDefaultMetrics({
            register: register,
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
        });

        // magic to actually serve scraped values
        this.httpServer.get('/metrics', async (req, res, next) => {
            try {
                res.set('Content-Type', register.contentType);
                res.end(await register.metrics());
                console.log("Scraped")
            } catch (error) {
                next(error)
            }
        });

        // example to serve single metric
        this.httpServer.get('/metrics/uptime', async (req, res, next) => {
            try {
                res.set('Content-Type', register.contentType);
                let device_uptime = await register.getSingleMetricAsString('device_uptime')
                this.logger.debug("Retrieved single metric device_uptime: ", device_uptime)
                res.end(device_uptime);
            } catch (error) {
                next(error)
            }
        });

        // serve data as json
        this.httpServer.get('/json/overview', (req, res) => {
            console.log('Get Overview Json')
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(this.extractors.get(MetricTypes.Overview)?.data))
        })
        this.httpServer.get('/json/status', (req, res) => {
            console.log('Get Status Json')
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(this.extractors.get(MetricTypes.Status)?.data))
        })
        this.httpServer.get('/json/docsis', (req, res) => {
            console.log('Get Docsis Json')
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(this.extractors.get(MetricTypes.Docsis)?.data))
        })

        this.httpServer.listen(this.scrapePort, () =>
            console.log(`🚨 Prometheus listening on port ${this.scrapePort} /metrics`)
        )

        // collect inifinitly
        this.collectMetrics(30000)
    }

    /**
     * Sleep in intervalls and collect metrics between
     * @param intervall intervall to sleep in between in ms
     */
    private async collectMetrics(intervall: number): Promise<any> {
        const poll = async () => {
            await this.scrape()
            setTimeout(() => poll(), intervall)
        };

        return new Promise(poll)
    }
}