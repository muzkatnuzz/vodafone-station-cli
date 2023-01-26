import type {ArrisDocsisChannelStatus, ArrisDocsisStatus} from '../arris-modem'
import type {StatusData} from '../modem'

const nonceMatcher = /var csp_nonce = "(?<nonce>.*?)";/gm
const ivMatcher = /var myIv = ["|'](?<iv>.*?)["|'];/gm
const saltMatcher = /var mySalt = ["|'](?<salt>.*?)["|'];/gm
const sessionIdMatcher = /var currentSessionId = ["|'](?<sessionId>.*?)["|'];/gm
const swVersionMatcher = /_ga.swVersion = ["|'](?<swVersion>.*?)["|'];/gm

export interface CryptoVars {
  nonce: string;
  iv: string;
  salt: string;
  sessionId: string;
}

export function extractCryptoVars(html: string): CryptoVars {
  const nonce = nonceMatcher.exec(html)?.groups?.nonce
  const iv = ivMatcher.exec(html)?.groups?.iv
  const salt = saltMatcher.exec(html)?.groups?.salt
  const sessionId = sessionIdMatcher.exec(html)?.groups?.sessionId
  return {nonce, iv, salt, sessionId} as CryptoVars
}

export function extractFirmwareVersion(html: string): string|undefined {
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

  const downstream = docsisMatcher.dsData.exec(html)?.groups?.dsData ?? '[]'
  const upstream = docsisMatcher.usData.exec(html)?.groups?.usData ?? '[]'
  const downstreamChannels =
    docsisMatcher.dsChannels.exec(html)?.groups?.dsChannels ?? '0'
  const upstreamChannels =
    docsisMatcher.usChannels.exec(html)?.groups?.usChannels ?? '0'
  const ofdmChannels =
    docsisMatcher.ofdmChannels.exec(html)?.groups?.ofdmChannels ?? '0'
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
  return matcher.exec(html)?.groups?.credential ?? ''
}
