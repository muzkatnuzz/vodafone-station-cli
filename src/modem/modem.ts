import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { Log } from '../logger';

export type DocsisChannelType = 'OFDM' | 'OFDMA' | 'SC-QAM'

export type Modulation = "16QAM" | "64QAM" | "256QAM" | "1024QAM" | "2048QAM" | "4096QAM"

export interface HumanizedDocsisChannelStatus {
  channelId: string;
  channelType: DocsisChannelType;
  snr: number; // dB
  frequency: number; // MHz
  modulation: Modulation;
  lockStatus: string;
  powerLevel: number; // dBmV
}

export interface DiagnosedDocsisChannelStatus extends HumanizedDocsisChannelStatus {
  diagnose: Diagnose
}
export interface DiagnosedDocsis31ChannelStatus extends HumanizedDocsis31ChannelStatus {
  diagnose: Diagnose
}

export interface Diagnose {
  deviation: boolean
  color: "red" | "green" | "yellow"
  description: string;
}

export interface HumanizedDocsis31ChannelStatus extends Omit<HumanizedDocsisChannelStatus, 'frequency'> {
  frequencyStart: number;// MHz
  frequencyEnd: number;// MHz
}

export interface DocsisStatus {
  downstream: HumanizedDocsisChannelStatus[];
  downstreamOfdm: HumanizedDocsis31ChannelStatus[];
  upstream: HumanizedDocsisChannelStatus[];
  upstreamOfdma: HumanizedDocsis31ChannelStatus[];
  time: string;
}

// members based on Arris Modem
export interface StatusData {
  SerialNumber: string;
  FirmwareVersion: string;
  HardwareTypeVersion: number;
  UptimeSinceReboot: string;
  FirewallConfig: string,
  IPv4Adress: string,
  IPv4Gateway: string,
  IPv6Adress: string,
  IPv6Prefix: string,
  time: string;
}

// members based on Arris Modem
export interface OverviewData {
  IsCmOperational: number;
  WifiEnabled: boolean;
  GuestWifiEnabled: boolean;
  WpsEnabled: boolean;
  ScheduleEnabled: boolean;
  Phones: PhoneStatus[],
  LanAttachedDevices: AttachedLanDevice[],
  PrimaryWlanAttachedDevice: AttachedWlanDevice[],
  GuestWlanAttachedDevice: AttachedWlanDevice[],
  GwMode: string,
  DsLitePlusIPv6: boolean;
  MtaEnabledByDHCP: boolean;
  WifiEnabledByMso: boolean;
  ModemConnectionStatus: string;
}

export interface PhoneStatus{
  Number: string
}

export interface AttachedLanDevice{
  MAC: string;
  Active: boolean;
  Index: number;
  HostName: string;
  IPv4: string;
  IPv6: string;
  Interface: string;
  IndexAP: number;
  Comment: string;
  Speed: string;
}

export interface AttachedWlanDevice{
  MAC: string;
  Active: boolean;
  Index: number;
  HostName: string;
  IPv4: string;
  IPv6: string;
  Interface: string;
  IndexAP: number;
  Comment: string;
  Speed: string;
  LinkRate: number
}

export interface DiagnosedDocsisStatus {
  downstream: DiagnosedDocsisChannelStatus[];
  downstreamOfdm: DiagnosedDocsis31ChannelStatus[];
  upstream: DiagnosedDocsisChannelStatus[];
  upstreamOfdma: DiagnosedDocsis31ChannelStatus[];
  time: string;
}

export interface GenericModem {
  logout(): Promise<void>;
  login(password: string): Promise<void>;
  docsis(): Promise<DocsisStatus>;
  restart(): Promise<unknown>;
  status(): Promise<StatusData>;
  overview(): Promise<OverviewData>;
}

export abstract class Modem implements GenericModem {
  protected readonly cookieJar: CookieJar
  protected readonly httpClient: AxiosInstance
  static USERNAME = 'admin'

  constructor(protected readonly modemIp: string, protected readonly logger: Log) {
    this.cookieJar = new CookieJar()
    this.httpClient = this.initAxios()
  }

  temperature(): Promise<Number> {
    throw new Error('Method not implemented.');
  }

  overview(): Promise<OverviewData> {
    throw new Error('Method not implemented.');
  }

  status(): Promise<StatusData> {
    throw new Error('Method not implemented.');
  }

  restart(): Promise<unknown> {
    throw new Error('Method not implemented.')
  }

  docsis(): Promise<DocsisStatus> {
    throw new Error('Method not implemented.')
  }

  login(_password: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  logout(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  private initAxios(): AxiosInstance {
    return wrapper(axios.create({
      withCredentials: true,
      jar: this.cookieJar,
      baseURL: `http://${this.modemIp}`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: 45000
    }))
  }
}

export function normalizeModulation(modulation: string): Modulation {
  let normalizedModulation = modulation;
  if (modulation.match("/")) {
    return normalizeModulation(modulation.split("/")[0]);
  }
  if (modulation.match("-")) {
    normalizedModulation = modulation.split("-").join("");
  }
  if (modulation.match(" ")) {
    normalizedModulation = modulation.split(" ").join("");
  }
  return normalizedModulation.toUpperCase() as Modulation;
}