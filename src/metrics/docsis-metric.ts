import { MetricBaseClass } from './metrics-base';
import { Gauge } from 'prom-client'
import { DocsisStatus } from '../modem/modem'

export class DocsisMetric extends MetricBaseClass<DocsisStatus> {
    private downstreamFrequency: Gauge
    private downstreamPowerLevel: Gauge
    private downstreamSnr: Gauge
    private downstreamRxmer: Gauge
    private upstreamFrequency: Gauge
    private upstreamPowerLevel: Gauge

    CHANNEL_ID = "channel_id"

    /**
     * Docsis data contains up- and downstream channels
     */
    constructor(name: string, help: string) {
        super(name, help);

        this.downstreamFrequency = new Gauge({
            name: "device_downstream_frequency",
            help: "Downstream channel frequency in hz",
            labelNames: [this.CHANNEL_ID],
        });

        this.downstreamPowerLevel = new Gauge({
            name: "device_downstream_power_level",
            help: "Downstream channel power level in dbmv",
            labelNames: [this.CHANNEL_ID],
        });

        this.downstreamSnr = new Gauge({
            name: "device_downstream_snr",
            help: "Downstream channel signal-to-noise ratio (SNR) in db",
            labelNames: [this.CHANNEL_ID],
        });

        this.downstreamRxmer = new Gauge({
            name: "device_downstream_rxmer",
            help: "Downstream channel receive modulation error ratio (RxMER) in db",
            labelNames: [this.CHANNEL_ID],
        });

        this.upstreamFrequency = new Gauge({
            name: "device_upstream_frequency",
            help: "Upstream channel frequency in hz",
            labelNames: [this.CHANNEL_ID],
        });

        this.upstreamPowerLevel = new Gauge({
            name: "device_upstream_power_level",
            help: "Upstream channel power level in dbmv",
            labelNames: [this.CHANNEL_ID],
        });
    }

    extract(data: DocsisStatus): void {
        data.downstream.forEach(channel => {
            this.downstreamFrequency.labels(channel.channelId).set(channel.frequency)
            this.downstreamPowerLevel.labels(channel.channelId).set(channel.powerLevel)
            this.downstreamSnr.labels(channel.channelId).set(channel.snr)
            this.downstreamRxmer.labels(channel.channelId).set(channel.snr)
        })

        data.upstream.forEach(channel => {
            this.upstreamFrequency.labels(channel.channelId).set(channel.frequency)
            this.upstreamPowerLevel.labels(channel.channelId).set(channel.powerLevel)
        })
    }
}