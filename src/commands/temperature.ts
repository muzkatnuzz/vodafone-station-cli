import Command from '../base-command'
import { Flags} from '@oclif/core'
import { login } from './login';

export default class Temperature extends Command{
    static description = "Read out modem temperature";
    static examples =['$ vodafone-station-cli temperature']
    static flags = {
        password: Flags.string({
          char: 'p',
          description: 'router/modem password',
        }),
      };

    async run(): Promise<void> {
        try {        
            const { flags } = await this.parse(Temperature);
            const password = flags.password ?? process.env.VODAFONE_ROUTER_PASSWORD
            if (!password || password === '') {
                this.log(
                'You must provide a password either using -p or by setting the environment variable VODAFONE_ROUTER_PASSWORD'
            )
            this.exit()
            }
            const modem = await login(password!)
            const temperature = await modem.temperature();
        } catch (error) {
            this.error(error as Error,{message:"Login not successful"})
        }
    }

}