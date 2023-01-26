import Command from '../base-command'
import { Flags } from '@oclif/core'
import { modemFactory } from '../modem/factory';
import { discoverModemIp, ModemDiscovery } from '../modem/discovery';
import { Modem } from '../modem/modem';

export default class Login extends Command {
  static description = "Login and keep session open";
  static examples = ['$ vodafone-station-cli docsis -p PASSWORD']
  static flags = {
    password: Flags.string({
      char: 'p',
      description: 'router/modem password',
    }),
  };

  async run(): Promise<Modem> {
    const { flags } = await this.parse(Login)
    const password = flags.password ?? process.env.VODAFONE_ROUTER_PASSWORD
    if (!password || password === '') {
      this.log(
        'You must provide a password either using -p or by setting the environment variable VODAFONE_ROUTER_PASSWORD'
      )
      this.exit()
    }
    const modemIp = await discoverModemIp()
    const discoveredModem = await new ModemDiscovery(modemIp, this.logger).discover()
    const modem = modemFactory(discoveredModem, this.logger)

    try {
      await modem.login(password!)
    } catch (error) {
      this.error(error as Error, { message: "Login not successful" })
    } finally {
      if (modem) {
        await modem.logout()
      }
    }

    return modem
  }

}