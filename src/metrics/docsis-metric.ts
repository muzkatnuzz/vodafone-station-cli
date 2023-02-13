import { MetricBaseClass } from './metrics-base';
import { Gauge } from 'prom-client'
import { DocsisStatus } from '../modem/modem'

export class DocsisMetric extends MetricBaseClass<DocsisStatus> {
    private downstreamFrequency: Gauge
    private downstreamPowerLevel: Gauge
    private downstreamSnr: Gauge
    // private downstreamRxmer: Gauge
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

        // this.downstreamRxmer = new Gauge({
        //     name: "device_downstream_rxmer",
        //     help: "Downstream channel receive modulation error ratio (RxMER) in db",
        //     labelNames: [this.CHANNEL_ID],
        // });

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
            // this.downstreamRxmer.labels(channel.channelId).set(channel.modulation)
        })

        data.upstream.forEach(channel => {
            this.upstreamFrequency.labels(channel.channelId).set(channel.frequency)
            this.upstreamPowerLevel.labels(channel.channelId).set(channel.powerLevel)
        })
    }
}
/*
class DownstreamStatusExtractor(XmlMetricsExtractor):
    def __init__(self, logger: Logger):
        super(DownstreamStatusExtractor, self).__init__(
            DOWNSTREAM, {GET.DOWNSTREAM_TABLE, GET.SIGNAL_TABLE}, logger
        )

    def extract(self, raw_xmls: Dict[int, bytes]) -> Iterable[Metric]:
        assert len(raw_xmls) == 2

        # DOWNSTREAM_TABLE gives us frequency, power level, SNR and RxMER per channel
        root = etree.fromstring(
            raw_xmls[GET.DOWNSTREAM_TABLE], parser=self._parsers[GET.DOWNSTREAM_TABLE]
        )

        CHANNEL_ID = "channel_id"
        ds_frequency = GaugeMetricFamily(
            "connectbox_downstream_frequency",
            "Downstream channel frequency",
            unit="hz",
            labels=[CHANNEL_ID],
        )
        ds_power_level = GaugeMetricFamily(
            "connectbox_downstream_power_level",
            "Downstream channel power level",
            unit="dbmv",
            labels=[CHANNEL_ID],
        )
        ds_snr = GaugeMetricFamily(
            "connectbox_downstream_snr",
            "Downstream channel signal-to-noise ratio (SNR)",
            unit="db",
            labels=[CHANNEL_ID],
        )
        ds_rxmer = GaugeMetricFamily(
            "connectbox_downstream_rxmer",
            "Downstream channel receive modulation error ratio (RxMER)",
            unit="db",
            labels=[CHANNEL_ID],
        )
        for channel in root.findall("downstream"):
            channel_id = channel.find("chid").text
            frequency = int(channel.find("freq").text)
            power_level = int(channel.find("pow").text)
            snr = int(channel.find("snr").text)
            rxmer = float(channel.find("RxMER").text)

            labels = [channel_id.zfill(2)]
            ds_frequency.add_metric(labels, frequency)
            ds_power_level.add_metric(labels, power_level)
            ds_snr.add_metric(labels, snr)
            ds_rxmer.add_metric(labels, rxmer)
        yield from [ds_frequency, ds_power_level, ds_snr, ds_rxmer]

        # SIGNAL_TABLE gives us unerrored, corrected and uncorrectable errors per channel
        root = etree.fromstring(
            raw_xmls[GET.SIGNAL_TABLE], parser=self._parsers[GET.SIGNAL_TABLE]
        )

        ds_unerrored_codewords = CounterMetricFamily(
            "connectbox_downstream_codewords_unerrored",
            "Unerrored downstream codewords",
            labels=[CHANNEL_ID],
        )
        ds_correctable_codewords = CounterMetricFamily(
            "connectbox_downstream_codewords_corrected",
            "Corrected downstream codewords",
            labels=[CHANNEL_ID],
        )
        ds_uncorrectable_codewords = CounterMetricFamily(
            "connectbox_downstream_codewords_uncorrectable",
            "Uncorrectable downstream codewords",
            labels=[CHANNEL_ID],
        )
        for channel in root.findall("signal"):
            channel_id = channel.find("dsid").text
            unerrored = int(channel.find("unerrored").text)
            correctable = int(channel.find("correctable").text)
            uncorrectable = int(channel.find("uncorrectable").text)

            labels = [channel_id.zfill(2)]
            ds_unerrored_codewords.add_metric(labels, unerrored)
            ds_correctable_codewords.add_metric(labels, correctable)
            ds_uncorrectable_codewords.add_metric(labels, uncorrectable)
        yield from [
            ds_unerrored_codewords,
            ds_correctable_codewords,
            ds_uncorrectable_codewords,
        ]


class UpstreamStatusExtractor(XmlMetricsExtractor):
    def __init__(self, logger: Logger):
        super(UpstreamStatusExtractor, self).__init__(UPSTREAM, {GET.UPSTREAM_TABLE}, logger)

    def extract(self, raw_xmls: Dict[int, bytes]) -> Iterable[Metric]:
        assert len(raw_xmls) == 1

        CHANNEL_ID = "channel_id"
        TIMEOUT_TYPE = "timeout_type"

        us_frequency = GaugeMetricFamily(
            "connectbox_upstream_frequency",
            "Upstream channel frequency",
            unit="hz",
            labels=[CHANNEL_ID],
        )
        us_power_level = GaugeMetricFamily(
            "connectbox_upstream_power_level",
            "Upstream channel power level",
            unit="dbmv",
            labels=[CHANNEL_ID],
        )
        us_symbol_rate = GaugeMetricFamily(
            "connectbox_upstream_symbol_rate",
            "Upstream channel symbol rate",
            unit="ksps",
            labels=[CHANNEL_ID],
        )
        us_timeouts = CounterMetricFamily(
            "connectbox_upstream_timeouts",
            "Upstream channel timeout occurrences",
            labels=[CHANNEL_ID, TIMEOUT_TYPE],
        )
        root = etree.fromstring(
            raw_xmls[GET.UPSTREAM_TABLE], parser=self._parsers[GET.UPSTREAM_TABLE]
        )
        for channel in root.findall("upstream"):
            channel_id = channel.find("usid").text

            frequency = int(channel.find("freq").text)
            power_level = float(channel.find("power").text)
            symbol_rate = float(channel.find("srate").text)
            t1_timeouts = int(channel.find("t1Timeouts").text)
            t2_timeouts = int(channel.find("t2Timeouts").text)
            t3_timeouts = int(channel.find("t3Timeouts").text)
            t4_timeouts = int(channel.find("t4Timeouts").text)

            labels = [channel_id.zfill(2)]
            us_frequency.add_metric(labels, frequency)
            us_power_level.add_metric(labels, power_level)
            us_symbol_rate.add_metric(labels, symbol_rate)
            us_timeouts.add_metric(labels + ["T1"], t1_timeouts)
            us_timeouts.add_metric(labels + ["T2"], t2_timeouts)
            us_timeouts.add_metric(labels + ["T3"], t3_timeouts)
            us_timeouts.add_metric(labels + ["T4"], t4_timeouts)
        yield from [us_frequency, us_power_level, us_symbol_rate, us_timeouts]

 */