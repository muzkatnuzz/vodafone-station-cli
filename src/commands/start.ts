import {Flags} from '@oclif/core'
import Command from '../base-command'
import {PrometheusExporter} from '../prometheus-exporter'

export default class Start extends Command {
  static description = 'Start serving prometheus.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    password: Flags.string({
      char: 'p',
      description: 'router/modem password',
    })
  }

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Start)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /home/abb/Dokumente/Code/vodafone-station-cli/src/commands/start.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    const password = flags.password ?? process.env.VODAFONE_ROUTER_PASSWORD
    if (!password || password === undefined) {
      this.log(
        'You must provide a password either using -p or by setting the environment variable VODAFONE_ROUTER_PASSWORD'
      )
      this.exit()
    }

    try {
      // start http client
      new PrometheusExporter(password!, this.logger);
  } catch (error) {
      this.logger.error(error)
  }
  }
}
