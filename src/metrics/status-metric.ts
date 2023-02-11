import { MetricBaseClass } from './metrics-base';
import { Gauge, Counter } from 'prom-client'
import { StatusData } from '../modem/modem'

export class StatusMetric extends MetricBaseClass<StatusData> {
    private uptimeGauge: Gauge

    /**
     * Create status metric
     */
    constructor(name: string, help:string) {
        super(name, help);

        this.uptimeGauge = new Gauge({ 
            name: "device_uptime",
            help: "Time since last reboot",
            labelNames: ["status"],
        });
    }

    extract<T extends StatusData>(data: T): void {
        
        // InfoMetricFamily(
        //     "connectbox_device",
        //     "Assorted device information",
        //     value={
        //         "hardware_version": hardware_version,
        //         "firmware_version": firmware_version,
        //         "docsis_mode": docsis_mode,
        //         "cm_provision_mode": cm_provision_mode,
        //         "gw_provision_mode": gw_provision_mode,
        //         "cable_modem_status": cable_modem_status,
        //         "operator_id": operator_id,
        //     },
        // )

        // convert from format like "62,05,43" =>Time since last reboot 62 Days, 05 Hours und 43 Minutes
        // source in status php: var js_UptimeSinceReboot = '62,05,43';
        // report total seconds since last reboot to grafana
        let uptime = /^(?<Days>\d+),(?<Hours>\d+),(?<Minutes>\d+)$/.exec(data.UptimeSinceReboot)
        this.uptimeGauge.set(
            (uptime?.groups?.Days ? Number.parseInt(uptime.groups.Days) * 24 * 60 * 60 : 0) + // days to seconds
            (uptime?.groups?.Hours ? Number.parseInt(uptime.groups.Hours) * 60 * 60 : 0) + // hours to seconds
            (uptime?.groups?.Minutes ? Number.parseInt(uptime.groups.Minutes) * 60 : 0) // minutes to second
            )
        // report router time?: Date, Time	09.02.2023 | 08:07
    }
  }


  /*


class DeviceStatusExtractor(XmlMetricsExtractor):
    def __init__(self, logger: Logger):
        super(DeviceStatusExtractor, self).__init__(
            DEVICE_STATUS, {GET.GLOBALSETTINGS, GET.CM_SYSTEM_INFO, GET.CMSTATUS}, logger
        )

    def extract(self, raw_xmls: Dict[int, bytes]) -> Iterable[Metric]:
        assert len(raw_xmls) == 3

        # parse GlobalSettings
        root = etree.fromstring(
            raw_xmls[GET.GLOBALSETTINGS], parser=self._parsers[GET.GLOBALSETTINGS]
        )
        firmware_version = root.find("SwVersion").text
        cm_provision_mode = root.find("CmProvisionMode").text
        gw_provision_mode = root.find("GwProvisionMode").text
        operator_id = root.find("OperatorId").text

        # `cm_provision_mode` is known to be None in case `provisioning_status` is "DS scanning". We need to set it to
        # some string, otherwise the InfoMetricFamily call fails with AttributeError.
        if cm_provision_mode is None:
            cm_provision_mode = "Unknown"

        # parse cm_system_info
        root = etree.fromstring(
            raw_xmls[GET.CM_SYSTEM_INFO], parser=self._parsers[GET.CM_SYSTEM_INFO]
        )
        docsis_mode = root.find("cm_docsis_mode").text
        hardware_version = root.find("cm_hardware_version").text
        uptime_as_str = root.find("cm_system_uptime").text

        # parse cmstatus
        root = etree.fromstring(
            raw_xmls[GET.CMSTATUS], parser=self._parsers[GET.CMSTATUS]
        )
        cable_modem_status = root.find("cm_comment").text
        provisioning_status = root.find("provisioning_st").text

        yield InfoMetricFamily(
            "connectbox_device",
            "Assorted device information",
            value={
                "hardware_version": hardware_version,
                "firmware_version": firmware_version,
                "docsis_mode": docsis_mode,
                "cm_provision_mode": cm_provision_mode,
                "gw_provision_mode": gw_provision_mode,
                "cable_modem_status": cable_modem_status,
                "operator_id": operator_id,
            },
        )

        # return an enum-style metric for the provisioning status
        try:
            enum_provisioning_status = ProvisioningStatus(provisioning_status)
        except ValueError:
            self._logger.warning(f"Unknown provisioning status '{provisioning_status}'. Please open an issue on Github.")
            enum_provisioning_status = ProvisioningStatus.UNKNOWN

        yield StateSetMetricFamily(
            "connectbox_provisioning_status",
            "Provisioning status description",
            value={
                state.value: state == enum_provisioning_status
                for state in ProvisioningStatus
            },
        )

        # uptime is reported in a format like "36day(s)15h:24m:58s" which needs parsing
        uptime_pattern = r"(\d+)day\(s\)(\d+)h:(\d+)m:(\d+)s"
        m = re.fullmatch(uptime_pattern, uptime_as_str)
        if m is not None:
            uptime_timedelta = timedelta(days=int(m[1]), hours=int(m[2]), minutes=int(m[3]), seconds=int(m[4]))
            uptime_seconds = uptime_timedelta.total_seconds()
        else:
            self._logger.warning(f"Unexpected duration format '{uptime_as_str}', please open an issue on github.")
            uptime_seconds = -1

        yield GaugeMetricFamily(
            "connectbox_uptime",
            "Device uptime in seconds",
            unit="seconds",
            value=uptime_seconds,
        )
  */