import { register, collectDefaultMetrics } from 'prom-client';
import Express from 'express';
import { modemFactory } from './modem/factory';
import { discoverModemIp, ModemDiscovery } from './modem/discovery'
import { Log } from './logger'
import { getStatus } from './commands/status'
import { MetricBaseClass, MetricTypes } from './metrics/metrics-base'
import { StatusMetric } from './metrics/status-metric';
import { StatusData } from './modem/modem';

export class PrometheusExporter {
    private readonly password: string
    private readonly httpServer: Express.Application
    private readonly scrapePort: Number
    private readonly logger: Log
    private readonly extractors = new Map<MetricTypes, MetricBaseClass<StatusData>>

    /**
     * Create a new prometheus client
     */
    constructor(password: string, logger: Log) {
        this.logger = logger
        this.password = password
        this.scrapePort = 9705
        this.httpServer = Express()
        this.extractors.set(MetricTypes.Status, new StatusMetric("Status", "Help on Status"))
        this.initServer()
    }

    private async scrape() {
        // Collect scrape duration and success for each extractor. Scrape success is initialized with False for
        // all extractors so that we can report a value for each extractor even in cases where we abort midway through
        // because we lost connection to the modem.
        let scrapeDuration = new Map<string, number>()  // type: Dict[str, float]
        let scrapeSuccess = new Map<string, boolean>() // metric name, flag

        let loginLogoutSuccess = true
        let connectBox

        // login
        try {
            // TODO: use login command
            const modemIp = await discoverModemIp()
            const discoveredModem = await new ModemDiscovery(modemIp, this.logger).discover()
            connectBox = modemFactory(discoveredModem, this.logger)

            await connectBox.login(this.password)
        } catch (error) {
            loginLogoutSuccess = false
            connectBox = null
            this.logger.error('Not able to login', error)
        }

        if (connectBox == null) {
            loginLogoutSuccess = false
            return
        }

        let preScrapeTime = Date.now()
        let statusData = undefined

        try {
            // scrape status
            statusData = await getStatus(connectBox, this.logger)
            // TODO: get docsis info
            // TODO: get connected devices
        } catch (error) {
            this.logger.error(error)
        }

        if (statusData != undefined) {
            (this.extractors.get(MetricTypes.Status) as StatusMetric)?.extract(statusData);
        }
 
        let postScrapeTime = Date.now()

        // logout after all data collected
        try {
            this.logger.log("Logout after scrape cycle.")
            await connectBox.logout()
        } catch (error) {
            this.logger.error(error)
            loginLogoutSuccess = false
        }
        
        // summarize collected data
        scrapeDuration.set('status', postScrapeTime.valueOf() - preScrapeTime.valueOf())
        scrapeSuccess.set('status', statusData ? true : false)
        scrapeSuccess.set('loginLogout', loginLogoutSuccess)
    }

    private initServer() {
        // init metric handling
        collectDefaultMetrics({ register: register,
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
        });

        this.httpServer.get('/metrics', async (req, res) => {
            try {
                res.set('Content-Type', register.contentType);
                res.end(await register.metrics());
                console.log("Scraped")
            } catch (ex) {
                res.status(500).end(ex);
            }
        });
        
        this.httpServer.get('/metrics/uptime', async (req, res) => {
            try {
                res.set('Content-Type', register.contentType);
                res.end(await register.getSingleMetricAsString('Uptime'));
            } catch (ex) {
                res.status(500).end(ex);
            }
        });
        
        // magic to actually serve scraped values
        this.httpServer.get('/metrics', (req, res) => {
            console.log('Scraped')
            res.send(register.metrics())
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
        const poll = async() => {
            await this.scrape()
            setTimeout(() => poll(), intervall)
        };

        return new Promise(poll)
    }
}