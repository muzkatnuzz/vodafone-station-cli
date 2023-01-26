import { Flags} from '@oclif/core'
import Command from '../base-command'
import {discoverModemIp, ModemDiscovery} from '../modem/discovery'
import {StatusData} from '../modem/modem'
import {modemFactory} from '../modem/factory'
import {Log } from '../logger'

export async function getStatus(password: string, logger:Log): Promise<StatusData> {
  const modemIp = await discoverModemIp()
  const discoveredModem = await new ModemDiscovery(modemIp, logger).discover()
  const modem = modemFactory(discoveredModem, logger)
  try {
    await modem.login(password)
    const statusData = await modem.status()
    return statusData
  } catch (error) {
    logger.error(`Could not fetch status from modem.`,error)
    throw error;
  } finally {
    await modem.logout()
  }
}

export default class Status extends Command {
  static description =
    'Get the current status as reported by the modem in a JSON format.';

  static examples = [
    `$ vodafone-station-cli status -p PASSWORD
{JSON data}
`,
  ];

  static flags = {
    password: Flags.string({
      char: 'p',
      description: 'router/modem password',
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Status)
    const password = flags.password ?? process.env.VODAFONE_ROUTER_PASSWORD
    if (!password || password === '') {
      this.log(
        'You must provide a password either using -p or by setting the environment variable VODAFONE_ROUTER_PASSWORD'
      )
      this.exit()
    }

    try {
      const Status = await getStatus(password!, this.logger)
    
      this.log(JSON.stringify(Status))

      this.exit()
    } catch (error) {
      this.error(error as Error,{message:"Something went wrong"})
    }
  }
}
