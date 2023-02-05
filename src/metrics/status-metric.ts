import { MetricBaseClass } from "./metrics-base";
import { Counter, Gauge } from 'prom-client'

export class StatusMetric extends MetricBaseClass {
    private uptimeGauge: Gauge

    /**
     * Create status metric
     */
    constructor(name: string, help:string) {
        super(name, help);

        // report uptime as counter: var js_UptimeSinceReboot = '34,13,39';
        // TODO: parse uptime string from status data
        this.uptimeGauge = new Gauge({ 
            name: "Uptime",
            help: "Time since last reboot",
            labelNames: ["status"],
        });
    }
    
    override extract<StatusData>(data: StatusData) {
        
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

        this.uptimeGauge.set(10)

        // # uptime is reported in a format like "36day(s)15h:24m:58s" which needs parsing
        // uptime_pattern = r"(\d+)day\(s\)(\d+)h:(\d+)m:(\d+)s"
        // m = re.fullmatch(uptime_pattern, uptime_as_str)
        // if m is not None:
        //     uptime_timedelta = timedelta(days=int(m[1]), hours=int(m[2]), minutes=int(m[3]), seconds=int(m[4]))
        //     uptime_seconds = uptime_timedelta.total_seconds()
        // else:
        //     self._logger.warning(f"Unexpected duration format '{uptime_as_str}', please open an issue on github.")
        //     uptime_seconds = -1

        // yield GaugeMetricFamily(
        //     "connectbox_uptime",
        //     "Device uptime in seconds",
        //     unit="seconds",
        //     value=uptime_seconds,
        // )
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