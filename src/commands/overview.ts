import { Flags} from '@oclif/core'
import Command from '../base-command'
import {discoverModemIp, ModemDiscovery} from '../modem/discovery'
import {Modem, OverviewData} from '../modem/modem'
import {modemFactory} from '../modem/factory'
import {Log } from '../logger'

export async function getOverview(modem: Modem, logger: Log): Promise<OverviewData> {
  try {
    const overviewData = await modem.overview()
    logger.debug(overviewData)
    return overviewData
  } catch (error) {
    logger.error(`Could not fetch overview from modem.`,error)
    throw error;
  }
}

export default class Overview extends Command {
  static description =
    'Get the current overview as reported by the modem in a JSON format.';

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
    const { flags } = await this.parse(Overview)
    const password = flags.password ?? process.env.VODAFONE_ROUTER_PASSWORD
    if (!password || password === undefined) {
      this.log(
        'You must provide a password either using -p or by setting the environment variable VODAFONE_ROUTER_PASSWORD'
      )
      this.exit()
    }
    let modem
    try {
      // TODO: use login command
      const modemIp = await discoverModemIp()
      const discoveredModem = await new ModemDiscovery(modemIp, this.logger).discover()
      modem = modemFactory(discoveredModem, this.logger)
      await modem.login(password!)
      const overview = await getOverview(modem, this.logger)
    
      this.log(JSON.stringify(overview))
    } catch (error) {
      this.error(error as Error,{message:"Something went wrong"})
    }
    finally {
      if (modem) {
      await modem.logout() 
      }
    }
  }
}
