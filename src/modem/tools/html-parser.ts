import type { ArrisDocsisChannelStatus, ArrisDocsisStatus } from '../arris-modem'
import type { OverviewData, StatusData } from '../modem'

export interface CryptoVars {
  nonce: string;
  iv: string;
  salt: string;
  sessionId: string;
}

export function extractCryptoVars(html: string): CryptoVars {
  const cryptoVarMatcher = {
    nonceMatcher: /var csp_nonce = "(?<nonce>.*?)";/gm,
    ivMatcher: /var myIv = ["|'](?<iv>.*?)["|'];/gm,
    saltMatcher: /var mySalt = ["|'](?<salt>.*?)["|'];/gm,
    sessionIdMatcher: /var currentSessionId = ["|'](?<sessionId>.*?)["|'];/gm
  }

  // reset index for regex global switch from previous calls
  {
    let key: keyof typeof cryptoVarMatcher;
    for (key in cryptoVarMatcher) {
      cryptoVarMatcher[key].lastIndex = 0
    }
  }
  const nonce = cryptoVarMatcher.nonceMatcher.exec(html)?.groups?.nonce
  const iv = cryptoVarMatcher.ivMatcher.exec(html)?.groups?.iv
  const salt = cryptoVarMatcher.saltMatcher.exec(html)?.groups?.salt
  const sessionId = cryptoVarMatcher.sessionIdMatcher.exec(html)?.groups?.sessionId
  return { nonce, iv, salt, sessionId } as CryptoVars
}

export function extractFirmwareVersion(html: string): string | undefined {
  const swVersionMatcher = /_ga.swVersion = ["|'](?<swVersion>.*?)["|'];/gm
  swVersionMatcher.lastIndex = 0 // reset index for regex global switch from previous calls
  return swVersionMatcher.exec(html)?.groups?.swVersion
}

export function extractStatus(
  html: string,
  date: Date = new Date()
): StatusData {
  const statusMatcher = {
    serialNumber: /var js_SerialNumber = ["|'](?<serialNumber>.*?)["|'];/gm,
    firmwareVersion: /var js_FWVersion = ["|'](?<firmwareVersion>.*?)["|'];/gm,
    uptime: /var js_UptimeSinceReboot = ["|'](?<uptime>.*?)["|'];/gm,
    // var js_HWTypeVersion = '7';
    hardwareTypeVersion: /var js_HWTypeVersion = ["|'](?<hardwareTypeVersion>.*?)["|'];/gm,
    time: /var js_DateTime = ["|'](?<time>.*?)["|'];/gm,
    ipv4Address: /var js_ipv4addr = ["|'](?<ipv4Address>.*?)["|'];/gm,
    ipv4Gateway: /var js_ipv4gateway = ["|'](?<ipv4Gateway>.*?)["|'];/gm,
    ipv6Address: /var js_ipv6addr = ["|'](?<ipv6Address>.*?)["|'];/gm,
    ipv6Prefix: /var js_ipv6prefix = ["|'](?<ipv6Prefix>.*?)["|'];/gm,
    firewallConfig: /var js_FirewallConfig = ["|'](?<firewallConfig>.*?)["|'];/gm,
  }

  // reset index for regex global switch from previous calls
  {
    let key: keyof typeof statusMatcher;
    for (key in statusMatcher) {
      statusMatcher[key].lastIndex = 0
    }
  }

  const serialNumber = statusMatcher.serialNumber.exec(html)?.groups?.serialNumber ?? ''
  const firmwareVersion = statusMatcher.firmwareVersion.exec(html)?.groups?.firmwareVersion ?? ''
  const uptime = statusMatcher.uptime.exec(html)?.groups?.uptime ?? ''
  const hardwareTypeVersion = Number(statusMatcher.hardwareTypeVersion.exec(html)?.groups?.hardwareTypeVersion) ?? 0
  const time = statusMatcher.time.exec(html)?.groups?.time ?? ''
  const ipv4Address = statusMatcher.ipv4Address.exec(html)?.groups?.ipv4Address ?? ''
  const ipv4Gateway = statusMatcher.ipv4Gateway.exec(html)?.groups?.ipv4Gateway ?? ''
  const ipv6Address = statusMatcher.ipv6Address.exec(html)?.groups?.ipv6Address ?? ''
  const ipv6Prefix = statusMatcher.ipv6Prefix.exec(html)?.groups?.ipv6Prefix ?? ''
  const firewallConfig = statusMatcher.firewallConfig.exec(html)?.groups?.firewallConfig ?? ''

  return {
    SerialNumber: serialNumber,
    FirmwareVersion: firmwareVersion,
    HardwareTypeVersion: hardwareTypeVersion,
    UptimeSinceReboot: uptime,
    FirewallConfig: firewallConfig,
    IPv4Adress: ipv4Address,
    IPv4Gateway: ipv4Gateway,
    IPv6Adress: ipv6Address,
    IPv6Prefix: ipv6Prefix,
    time: time
  }
}

export function extractOverviewData(
  html: string,
  date: Date = new Date()
): OverviewData {
  const overviewMatcher = {
    isCmOperational: /js_isCmOperational = ["|'](?<isCmOperational>.*?)["|'];/gm,
    wifiEnable: /js_wifiEnable = ["|'](?<wifiEnable>.*?)["|'];/gm,
    guestWifiEnable: /js_guestWifiEnable = ["|'](?<guestWifiEnable>.*?)["|'];/gm,
    wpsEnable: /js_wpsEnable = ["|'](?<wpsEnable>.*?)["|'];/gm,
    scheduleEnable: /js_scheduleEnable = ["|'](?<scheduleEnable>.*?)["|'];/gm,
    phone1: /js_phone1 = ["|'](?<phone1>.*?)["|'];/gm,
    phone2: /js_phone2 = ["|'](?<phone2>.*?)["|'];/gm,
    lanAttachedDevice: /json_lanAttachedDevice = (?<lanAttachedDevice>.*?);/gm,
    primaryWlanAttachedDevice: /json_primaryWlanAttachedDevice = (?<primaryWlanAttachedDevice>.*?);/gm,
    guestWlanAttachedDevice: /json_guestWlanAttachedDevice = (?<guestWlanAttachedDevice>.*?);/gm,
    gwMode: /_ga.gwMode = ["|'](?<gwMode>.*?)["|'];/gm,
    dsLitePlusIpv6Mode: /_ga.dsLitePlusIpv6Mode = ["|'](?<dsLitePlusIpv6Mode>.*?)["|'];/gm,
    mtaEnabledByDhcp: /_ga.mtaEnabledByDhcp = ["|'](?<mtaEnabledByDhcp>.*?)["|'];/gm,
    wifiEnabledByMso: /_ga.wifiEnabledByMso = ["|'](?<wifiEnabledByMso>.*?)["|'];/gm,
    modemConnectionStatus: /_ga.modemConnectionStatus = ["|'](?<modemConnectionStatus>.*?)["|'];/gm,
  }

  // reset index for regex global switch from previous calls
  {
    let key: keyof typeof overviewMatcher;
    for (key in overviewMatcher) {
      overviewMatcher[key].lastIndex = 0
    }
  }

  const isCmOperational = Number(overviewMatcher.isCmOperational.exec(html)?.groups?.isCmOperational ?? 0)
  const wifiEnable = Boolean(overviewMatcher.wifiEnable.exec(html)?.groups?.wifiEnable ?? undefined)
  const guestWifiEnable = Boolean(overviewMatcher.guestWifiEnable.exec(html)?.groups?.guestWifiEnable ?? undefined)
  const wpsEnable = Boolean(overviewMatcher.wpsEnable.exec(html)?.groups?.wpsEnable ?? undefined)
  const scheduleEnable = Boolean(overviewMatcher.scheduleEnable.exec(html)?.groups?.scheduleEnable ?? undefined)
  const phone1 = overviewMatcher.phone1.exec(html)?.groups?.phone1 ?? ''
  const phone2 = overviewMatcher.phone2.exec(html)?.groups?.phone2 ?? ''
  const lanAttachedDevice = JSON.parse(overviewMatcher.lanAttachedDevice.exec(html)?.groups?.lanAttachedDevice ?? '[]')
  const primaryWlanAttachedDevice = JSON.parse(overviewMatcher.primaryWlanAttachedDevice.exec(html)?.groups?.primaryWlanAttachedDevice ?? '[]')
  const guestWlanAttachedDevice = JSON.parse(overviewMatcher.guestWlanAttachedDevice.exec(html)?.groups?.guestWlanAttachedDevice ?? '[]')
  const gwMode = overviewMatcher.gwMode.exec(html)?.groups?.gwMode ?? ''
  const dsLitePlusIpv6Mode = Boolean(overviewMatcher.dsLitePlusIpv6Mode.exec(html)?.groups?.dsLitePlusIpv6Mode ?? undefined)
  const mtaEnabledByDhcp = Boolean(overviewMatcher.mtaEnabledByDhcp.exec(html)?.groups?.mtaEnabledByDhcp ?? undefined)
  const wifiEnabledByMso = Boolean(overviewMatcher.wifiEnabledByMso.exec(html)?.groups?.wifiEnabledByMso ?? undefined)
  const modemConnectionStatus = overviewMatcher.modemConnectionStatus.exec(html)?.groups?.modemConnectionStatus ?? ''

  return {
    IsCmOperational: isCmOperational,
    WifiEnabled: wifiEnable,
    GuestWifiEnabled: guestWifiEnable,
    WpsEnabled: wpsEnable,
    ScheduleEnabled: scheduleEnable,
    Phones: [{Number: phone1}, {Number: phone2}],
    LanAttachedDevices: lanAttachedDevice,
    PrimaryWlanAttachedDevice: primaryWlanAttachedDevice,
    GuestWlanAttachedDevice: guestWlanAttachedDevice,
    GwMode: gwMode,
    DsLitePlusIPv6: dsLitePlusIpv6Mode,
    MtaEnabledByDHCP: mtaEnabledByDhcp,
    WifiEnabledByMso: wifiEnabledByMso,
    ModemConnectionStatus: modemConnectionStatus
  }
}

export function extractDocsisStatus(
  html: string,
  date: Date = new Date()
): ArrisDocsisStatus {
  const docsisMatcher = {
    dsData: /json_dsData = (?<dsData>.*?);/gm,
    usData: /json_usData = (?<usData>.*?);/gm,
    dsChannels: /js_dsNums = ["|'](?<dsChannels>.*?)["|'];/gm,
    usChannels: /js_usNums = ["|'](?<usChannels>.*?)["|'];/gm,
    ofdmChannels: /js_ofdmNums = ["|'](?<ofdmChannels>.*?)["|'];/gm,
  }

  // reset index for regex global switch from previous calls
  {
    let key: keyof typeof docsisMatcher;
    for (key in docsisMatcher) {
      docsisMatcher[key].lastIndex = 0
    }
  }

  const downstream = docsisMatcher.dsData.exec(html)?.groups?.dsData ?? '[]'
  const upstream = docsisMatcher.usData.exec(html)?.groups?.usData ?? '[]'
  const downstreamChannels = docsisMatcher.dsChannels.exec(html)?.groups?.dsChannels ?? '0'
  const upstreamChannels = docsisMatcher.usChannels.exec(html)?.groups?.usChannels ?? '0'
  const ofdmChannels = docsisMatcher.ofdmChannels.exec(html)?.groups?.ofdmChannels ?? '0'

  return {
    downstream: JSON.parse(downstream) as ArrisDocsisChannelStatus[],
    upstream: JSON.parse(upstream) as ArrisDocsisChannelStatus[],
    downstreamChannels: Number.parseInt(downstreamChannels, 10),
    upstreamChannels: Number.parseInt(upstreamChannels, 10),
    ofdmChannels: Number.parseInt(ofdmChannels, 10),
    time: date.toISOString(),
  }
}

export function extractCredentialString(html: string): string {
  const matcher = /createCookie\([\n]*\s*"credential"\s*,[\n]*\s*["|'](?<credential>.*?)["|']\s*/gims
  matcher.lastIndex = 0 // reset index from previous calls
  return matcher.exec(html)?.groups?.credential ?? ''
}
