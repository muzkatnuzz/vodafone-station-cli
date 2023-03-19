import { MetricBaseClass } from './metrics-base';
import { Gauge } from 'prom-client'
import { OverviewData } from '../modem/modem'

export class OverviewMetric extends MetricBaseClass<OverviewData> {
    private attachedLanDevices: Gauge
    private attachedWlanDevices: Gauge
    /**
     * Overview data contains attached devices
     */
    constructor(name: string, help: string) {
        super(name, help);

        this.attachedLanDevices = new Gauge({
            name: "attached_devices_speed",
            help: "Ethernet client network speed in Gbps",
            labelNames: ["mac_address", "hostname"]
        });

        this.attachedWlanDevices = new Gauge({
            name: "attached_wlan_devices_speed",
            help: "Wifi client network speed in mbit",
            labelNames: ["mac_address", "hostname", "wifi" ]
        });
        
    }
    extract(data: OverviewData): void {
        data.LanAttachedDevices.forEach(device => {
            // extract speed from Speed string ala "1 Gbps"
            this.attachedLanDevices.labels(device.MAC, device.HostName)
            .set(Number(device.Speed.match(/(\d+).*/)?.[1] ?? 0))
        });

        data.PrimaryWlanAttachedDevice.forEach(device => {
            this.attachedWlanDevices.labels(device.MAC, device.HostName, "Primary").set(device.LinkRate)
        })

        data.GuestWlanAttachedDevice.forEach(device => {
            this.attachedWlanDevices.labels(device.MAC, device.HostName, "Guest").set(device.LinkRate)
        })
    }
}