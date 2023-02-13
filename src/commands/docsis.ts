import { Flags} from '@oclif/core'
import {promises as fsp} from 'fs'
import Command from '../base-command'
import {Modem, DocsisStatus} from '../modem/modem'
import {Log } from '../logger'
import {webDiagnoseLink} from "../modem/web-diagnose"
import {login} from './login'

export async function getDocsisStatus(modem: Modem, logger:Log): Promise<DocsisStatus> {
  try {
    const docsisData = await modem.docsis()
    logger.debug(docsisData)
    return docsisData
  } catch (error) {
    logger.error(`Could not fetch docsis status from modem.`,error)
    throw error;
  }
}

export default class Docsis extends Command {
  static description =
    'Get the current docsis status as reported by the modem in a JSON format.';

  static examples = [
    `$ vodafone-station-cli docsis -p PASSWORD
{JSON data}
`,
  ];

  static flags = {
    password: Flags.string({
      char: 'p',
      description: 'router/modem password',
    }),
    file: Flags.boolean({
      char: 'f',
      description: 'write out a report file under ./reports/${CURRENT_UNIX_TIMESTAMP}_docsisStatus.json',
    }),
    web: Flags.boolean({
      char: 'w',
      description: 'review the docsis values in a webapp',
    }),
  };

  async writeDocsisStatus(docsisStatusJson: string): Promise<void> {
    const reportFile = `./reports/${Date.now()}_docsisStatus.json`
    this.log('Writing docsis report as json to file: ', reportFile)
    const data = new Uint8Array(Buffer.from(docsisStatusJson))
    return fsp.writeFile(reportFile, data)
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Docsis)
    const password = flags.password ?? process.env.VODAFONE_ROUTER_PASSWORD
    if (!password || password === '') {
      this.log(
        'You must provide a password either using -p or by setting the environment variable VODAFONE_ROUTER_PASSWORD'
      )
      this.exit()
    }

    let modem
    try {
      modem = await login(password!)
      const docsisStatus = await getDocsisStatus(modem, this.logger)
      const docsisStatusJSON = JSON.stringify(docsisStatus, undefined, 4)

      if (flags.file) {
        await this.writeDocsisStatus(docsisStatusJSON)
      } else {
        this.log(docsisStatusJSON)
      }

      if (flags.web) {
        this.log(`Review your docsis state online -> ${webDiagnoseLink(docsisStatus)}`)
      }
    } catch (error) {
      this.error(error as Error,{message:"Something went wrong"})
    }
    finally{
      if(modem){
        await modem.logout()
      }
    }
  }
}
