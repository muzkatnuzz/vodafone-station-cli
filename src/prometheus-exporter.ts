import * as prometheus from 'prom-client';
import axios, { Axios, AxiosInstance } from 'axios';
import { CookieJar } from 'tough-cookie';
import { modemFactory } from './modem/factory';
import { discoverModemIp, ModemDiscovery } from './modem/discovery'
import { Log } from './logger'
import { getStatus } from './commands/status'


class PrometheusExporter {
    protected readonly httpClient: AxiosInstance
    protected readonly cookieJar: CookieJar
    protected readonly prometheusPort: Number

    /**
     * Create a new prometheus client
     */
    constructor(protected readonly logger: Log) {
        this.prometheusPort = 9705
        this.cookieJar = new CookieJar()
        this.httpClient = this.initClient()
    }

    public async scrape(password: string) {
        // Collect scrapOclifLoggere duration and scrape success for each extractor. Scrape success is initialized with False for
        // all extractors so that we can report a value for each extractor even in cases where we abort midway through
        // because we lost connection to the modem.
        let scrapeDuration = new Map<string, number>()  // type: Dict[str, float]
        let scrapeSuccess = new Map<string, boolean>() // metric name, flag

        let loginLogoutSuccess = true
        let connectBox

        // login
        try {
            const modemIp = await discoverModemIp()
            const discoveredModem = await new ModemDiscovery(modemIp, this.logger).discover()
            connectBox = modemFactory(discoveredModem, this.logger)

            connectBox.login(password)
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
            // scrape status, docsis, connected devices
            statusData = await getStatus(connectBox, this.logger)
        } catch (error) {
            this.logger.error(error)
        }

        let postScrapeTime = Date.now()

        // logout after all data collected
        try {
            this.logger.log("Logout after scrape cycle.")
            connectBox.logout()
        } catch (error) {
            this.logger.error(error)
            loginLogoutSuccess = false
        }

        // summarize collected data
        scrapeDuration.set('status', postScrapeTime.valueOf() - preScrapeTime.valueOf())
        scrapeSuccess.set('status', statusData ? true : false)
        scrapeSuccess.set('loginLogout', loginLogoutSuccess)
    }

    private initClient(): AxiosInstance {
        let client = axios.create({
            withCredentials: true,
            jar: this.cookieJar,
            baseURL: "http://localhost:" + this.prometheusPort,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 45000
        })

        // init metric handling
        const collectDefaultMetrics = ({
            timeout: 10000,
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
        });
        const c = new Counter({
            name: 'test_counter',
            help: 'Example of a counter',
            labelNames: ['code'],
        });

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
        
        prometheus.register.metrics().then(str => console.log(str));

        // magic to actually scrape on prometheus scrape request
        client.get('/metrics').then(function (scrape) { console.log(scrape) })
        return client
    }
}