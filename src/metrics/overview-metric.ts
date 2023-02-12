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
            help: "Ethernet client network speed in mbit",
            labelNames: ["mac_address", "ipv4_address", "ipv6_address", "hostname"]
        });

        this.attachedWlanDevices = new Gauge({
            name: "attached_wlan_devices_speed",
            help: "Wifi client network speed in mbit",
            labelNames: ["mac_address", "ipv4_address", "ipv6_address", "hostname", "wifi" ]
        });
        
    }
    extract(data: OverviewData): void {
        data.LanAttachedDevices.forEach(device => {
            // extract speed from Speed string ala "1 Gbps"
            this.attachedLanDevices.labels(device.MAC, device.IPv4, device.IPv6, device.HostName)
            .set(Number(device.Speed.match(/(\d+).*/)?.[1] ?? 0))
        });

        data.PrimaryWlanAttachedDevice.forEach(device => {
            this.attachedWlanDevices.labels(device.MAC, device.IPv4, device.IPv6, device.HostName, "Primary").set(device.LinkRate)
        })

        data.GuestWlanAttachedDevice.forEach(device => {
            this.attachedWlanDevices.labels(device.MAC, device.IPv4, device.IPv6, device.HostName, "Guest").set(device.LinkRate)
        })
    }
}
/*
class LanUserExtractor(XmlMetricsExtractor):
    def __init__(self, logger: Logger):
        super(LanUserExtractor, self).__init__(LAN_USERS, {GET.LANUSERTABLE}, logger)

    def extract(self, raw_xmls: Dict[int, bytes]) -> Iterable[Metric]:
        assert len(raw_xmls) == 1

        root = etree.fromstring(
            raw_xmls[GET.LANUSERTABLE], parser=self._parsers[GET.LANUSERTABLE]
        )

        # LAN and Wi-Fi clients have the same XML format so we can reuse the code to extract their values
        def extract_client(client, target_metric: GaugeMetricFamily):
            mac_address = client.find("MACAddr").text

            # depending on the firmware, both IPv4/IPv6 addresses or only one of both are reported
            ipv4_address_elmt = client.find("IPv4Addr")
            ipv4_address = (
                ipv4_address_elmt.text if ipv4_address_elmt is not None else ""
            )
            ipv6_address_elmt = client.find("IPv6Addr")
            ipv6_address = (
                ipv6_address_elmt.text if ipv6_address_elmt is not None else ""
            )

            hostname = client.find("hostname").text
            speed = int(client.find("speed").text)
            target_metric.add_metric(
                [mac_address, ipv4_address, ipv6_address, hostname], speed
            )

        label_names = ["mac_address", "ipv4_address", "ipv6_address", "hostname"]

        # set up ethernet user speed metric
        ethernet_user_speed = GaugeMetricFamily(
            "connectbox_ethernet_client_speed",
            "Ethernet client network speed",
            labels=label_names,
            unit="mbit",
        )
        for client in root.find("Ethernet").findall("clientinfo"):
            extract_client(client, ethernet_user_speed)
        yield ethernet_user_speed

        # set up Wi-Fi user speed metric
        wifi_user_speed = GaugeMetricFamily(
            "connectbox_wifi_client_speed",
            "Wi-Fi client network speed",
            labels=label_names,
            unit="mbit",
        )
        for client in root.find("WIFI").findall("clientinfo"):
            extract_client(client, wifi_user_speed)
        yield wifi_user_speed
 */