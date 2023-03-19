import { MetricBaseClass } from './metrics-base';
import { Gauge } from 'prom-client'
import { StatusData } from '../modem/modem'

export class StatusMetric extends MetricBaseClass<StatusData> {
    private uptimeGauge: Gauge
    private deviceInfo: Gauge
    private statusData: StatusData

    /**
     * Create status metric
     */
    constructor(name: string, help: string) {
        super(name, help);

        this.statusData = { FirewallConfig: "", FirmwareVersion: "", HardwareTypeVersion: 1, IPv4Adress: "", IPv4Gateway: "", IPv6Adress: "", IPv6Prefix: "", SerialNumber: "", time: "", UptimeSinceReboot: "" }

        this.uptimeGauge = new Gauge({
            name: "device_uptime",
            help: "Time since last reboot",
            labelNames: ["status"],
        });

        this.deviceInfo = new Gauge({
            name: "device_info",
            help: "General Device Info",
            labelNames: ["hardwareVersion", "firmwareVersion", "serial_number", "firewallConfig", "ipv4", "ipv4Gateway", "ipv6", "ipv6Prefix", "router_time"],
            aggregator: 'first',
        })

    }

    extract<T extends StatusData>(data: T): void {
        this.statusData = data
        this.deviceInfo.labels(data.HardwareTypeVersion.toString(),
            data.FirmwareVersion,
            data.SerialNumber,
            data.FirewallConfig,
            data.IPv4Adress,
            data.IPv4Gateway,
            data.IPv6Adress,
            data.IPv6Prefix,
            data.time).set(1)

        // convert from format like "62,05,43" =>Time since last reboot 62 Days, 05 Hours und 43 Minutes
        // source in status php: var js_UptimeSinceReboot = '62,05,43';
        // report total seconds since last reboot to grafana
        let uptime = /^(?<Days>\d+),(?<Hours>\d+),(?<Minutes>\d+)$/.exec(data.UptimeSinceReboot)
        this.uptimeGauge.set(
            (uptime?.groups?.Days ? Number.parseInt(uptime.groups.Days) * 24 * 60 * 60 : 0) + // days to seconds
            (uptime?.groups?.Hours ? Number.parseInt(uptime.groups.Hours) * 60 * 60 : 0) + // hours to seconds
            (uptime?.groups?.Minutes ? Number.parseInt(uptime.groups.Minutes) * 60 : 0) // minutes to second
        )
    }

    get data(): StatusData{
        return this.statusData;
    }
}