import { Counter, register } from 'prom-client';
import Express from 'express';
import { CookieJar } from 'tough-cookie';
import { modemFactory } from './modem/factory';
import { discoverModemIp, ModemDiscovery } from './modem/discovery'
import { Log } from './logger'
import { getStatus } from './commands/status'

export class PrometheusExporter {
    protected readonly httpServer: Express.Application
    protected readonly cookieJar: CookieJar
    protected readonly scrapePort: Number

    /**
     * Create a new prometheus client
     */
    constructor(protected password: string, protected readonly logger: Log) {
        this.password = password
        this.scrapePort = 9705
        this.cookieJar = new CookieJar()
        this.httpServer = this.initServer()
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
        let statusData

        try {
            // scrape status
            statusData = await getStatus(connectBox, this.logger)
            // TODO: get docsis info
            // TODO: get connected devices
        } catch (error) {
            this.logger.error(error)
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

    private initServer():Express.Application  {
        const metricServer =  Express() 

        // init metric handling
        const collectDefaultMetrics = ({
            timeout: 10000,
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
        });

        const c = new Counter({
            name: 'test_counter',
            help: 'Example',
            labelNames: ['code']
        })

        new Counter({
            name: 'scrape_counter',
            help: 'Number of scrapes (example of a counter with a collect fn)',
            collect() {
                // collect is invoked each time `register.metrics()` is called.
                this.inc();
            },
        });

        setInterval(() => {
            c.inc({ code: 200 });
        }, 5000);

        setInterval(() => {
            c.inc({ code: 400 });
        }, 2000);

        setInterval(() => {
            c.inc();
        }, 2000);

        // recursive loop to not overlap scrapes
        // src: https://developer.mozilla.org/en-US/docs/Web/API/setInterval
        // TODO: review if resources are freed: 
        // https://medium.com/@devinmpierce/recursive-settimeout-8eb953b02b98
        var loop = (async() => {
            // In an arrow function, the 'this' pointer is interpreted lexically,
            // so it will refer to the object as desired.
            await this.scrape()
            setTimeout(()=>{
                loop()
            }, 10000) // 10 seconds between each scrape
        });
        loop();

        register.metrics().then(str => console.log(str));

        // magic to actually serve scraped values
        metricServer.get('/metrics', (req, res) => {
            console.log('Scraped')
            res.send(register.metrics())
          })
          
          metricServer.listen(this.scrapePort, () =>
            console.log(`🚨 Prometheus listening on port ${this.scrapePort} /metrics`)
          )

        return metricServer
    }

    /**
     * stopClient
     */
    public stopClient() {
        // TODO: get running instance and stop it
    }
}