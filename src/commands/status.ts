import { Flags} from '@oclif/core'
import Command from '../base-command'
import {login} from './login'
import {Modem, StatusData} from '../modem/modem'
import {Log } from '../logger'

export async function getStatus(modem: Modem, logger: Log): Promise<StatusData> {
  try {
    const statusData = await modem.status()
    logger.debug(statusData)
    return statusData
  } catch (error) {
    logger.warn(`Could not fetch status from modem.`)
    throw error;
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
    let modem
    try {
      modem = await login(password)
      const status = await getStatus(modem, this.logger)
    
      this.log(JSON.stringify(status))
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
