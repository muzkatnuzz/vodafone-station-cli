Vodafone Station Prometheus Exporter
====================

Scrape your Arris based Vodafone Station router (rudimentary support for Technicolor CGA4322DE, CGA6444VF) for Grafana visualization.

<!-- toc -->
* [Features](#features)
* [Demo](#demo)
* [Supported hardware](#supported-hardware)
* [Notes](#notes)
* [Useful related projects:](#useful-related-projects)
* [Running from source](#running-from-source)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Features

* Visualize connected W-/Lan Clients
* View Docsis Down-/Upstream channel metrics
* Retrieve modem stats (Firmware version, Firewall state...)

# Demo

![Alt text](/grafana_dashboard.jpg?raw=true "Grafana Dashboard")

# Supported hardware

Currently the following hardware/software is tested:

- Arris TG3442DE running `AR01.04.046.04.14_091322_7244.SIP.20.X2`

Rudimental support for
- Technicolor CGA4322DE running `1.0.9-IMS-KDG`, `2.0.17-IMS-KDG`, `3.0.41-IMS-KDG`
- Technicolor CGA6444VF running firmware `19.3B57-1.0.41`

Missing implmentation to retrieve overview pages and extract information for these modems.
<details>
  <summary>Docsis data format</summary>

```json
{
    "downstream": [
        {
            "channelId": "1",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 55.4,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 114
        },
        {
            "channelId": "2",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 55,
            "lockStatus": "Locked",
            "snr": 36,
            "frequency": 130
        },
        {
            "channelId": "3",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 55.2,
            "lockStatus": "Locked",
            "snr": 36,
            "frequency": 138
        },
        {
            "channelId": "4",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 54.8,
            "lockStatus": "Locked",
            "snr": 36,
            "frequency": 146
        },
        {
            "channelId": "5",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 56.4,
            "lockStatus": "Locked",
            "snr": 38,
            "frequency": 602
        },
        {
            "channelId": "6",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 55.9,
            "lockStatus": "Locked",
            "snr": 37,
            "frequency": 618
        },
        {
            "channelId": "7",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 55.7,
            "lockStatus": "Locked",
            "snr": 37,
            "frequency": 626
        },
        {
            "channelId": "8",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 54.7,
            "lockStatus": "Locked",
            "snr": 37,
            "frequency": 642
        },
        {
            "channelId": "9",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 55.3,
            "lockStatus": "Locked",
            "snr": 37,
            "frequency": 650
        },
        {
            "channelId": "10",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 56.1,
            "lockStatus": "Locked",
            "snr": 38,
            "frequency": 658
        },
        {
            "channelId": "11",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 56.3,
            "lockStatus": "Locked",
            "snr": 38,
            "frequency": 666
        },
        {
            "channelId": "12",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 57.5,
            "lockStatus": "Locked",
            "snr": 39,
            "frequency": 674
        },
        {
            "channelId": "13",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 57.7,
            "lockStatus": "Locked",
            "snr": 38,
            "frequency": 682
        },
        {
            "channelId": "14",
            "channelType": "SC-QAM",
            "modulation": "256QAM",
            "powerLevel": 58.3,
            "lockStatus": "Locked",
            "snr": 39,
            "frequency": 690
        },
        {
            "channelId": "15",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 52.2,
            "lockStatus": "Locked",
            "snr": 34,
            "frequency": 698
        },
        {
            "channelId": "16",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.2,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 706
        },
        {
            "channelId": "17",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.3,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 714
        },
        {
            "channelId": "18",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.1,
            "lockStatus": "Locked",
            "snr": 34,
            "frequency": 722
        },
        {
            "channelId": "19",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.1,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 730
        },
        {
            "channelId": "20",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.2,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 738
        },
        {
            "channelId": "21",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.7,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 746
        },
        {
            "channelId": "22",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.8,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 754
        },
        {
            "channelId": "23",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.9,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 762
        },
        {
            "channelId": "24",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.1,
            "lockStatus": "Locked",
            "snr": 34,
            "frequency": 770
        },
        {
            "channelId": "25",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.5,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 778
        },
        {
            "channelId": "26",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.7,
            "lockStatus": "Locked",
            "snr": 34,
            "frequency": 786
        },
        {
            "channelId": "27",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.7,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 794
        },
        {
            "channelId": "28",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.3,
            "lockStatus": "Locked",
            "snr": 34,
            "frequency": 802
        },
        {
            "channelId": "29",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.9,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 810
        },
        {
            "channelId": "30",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.5,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 818
        },
        {
            "channelId": "31",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 54.1,
            "lockStatus": "Locked",
            "snr": 35,
            "frequency": 826
        },
        {
            "channelId": "32",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 53.1,
            "lockStatus": "Locked",
            "snr": 34,
            "frequency": 834
        }
    ],
    "downstreamOfdm": [
        {
            "channelId": "33",
            "channelType": "OFDM",
            "modulation": "1024QAM",
            "powerLevel": 56.2,
            "lockStatus": "Locked",
            "snr": 40,
            "frequencyStart": 151,
            "frequencyEnd": 324
        }
    ],
    "upstream": [
        {
            "channelId": "3",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 111,
            "lockStatus": "ACTIVE",
            "snr": 0,
            "frequency": 37
        },
        {
            "channelId": "4",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 111,
            "lockStatus": "ACTIVE",
            "snr": 0,
            "frequency": 31
        },
        {
            "channelId": "1",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 111,
            "lockStatus": "ACTIVE",
            "snr": 0,
            "frequency": 51
        },
        {
            "channelId": "2",
            "channelType": "SC-QAM",
            "modulation": "64QAM",
            "powerLevel": 111,
            "lockStatus": "ACTIVE",
            "snr": 0,
            "frequency": 45
        }
    ],
    "upstreamOfdma": [
        {
            "channelId": "9",
            "channelType": "OFDMA",
            "modulation": "16_QAM",
            "powerLevel": 107,
            "lockStatus": "SUCCESS",
            "snr": 0,
            "frequencyStart": 29.8,
            "frequencyEnd": 64.8
        }
    ],
    "time": "2021-10-23T13:06:23.988Z"
}
```
</details>

<details>
  <summary>Table printer format</summary>

```
    Downstream
    +----+----------+------------+-------+-----------+-------------+-----+
    | ID | Ch. Type | Modulation | Power | Frequency | Lock status | SNR |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 1  | SC-QAM   | 256QAM     | 55.1  | 114       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 2  | SC-QAM   | 256QAM     | 54.7  | 130       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 3  | SC-QAM   | 256QAM     | 54.8  | 138       | Locked      | 36  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 4  | SC-QAM   | 256QAM     | 54.6  | 146       | Locked      | 36  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 5  | SC-QAM   | 256QAM     | 57    | 602       | Locked      | 38  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 6  | SC-QAM   | 256QAM     | 57.3  | 618       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 7  | SC-QAM   | 256QAM     | 57.7  | 626       | Locked      | 38  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 8  | SC-QAM   | 256QAM     | 58.5  | 642       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 9  | SC-QAM   | 256QAM     | 58.3  | 650       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 10 | SC-QAM   | 256QAM     | 58.3  | 658       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 11 | SC-QAM   | 256QAM     | 58.1  | 666       | Locked      | 38  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 12 | SC-QAM   | 256QAM     | 58.8  | 674       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 13 | SC-QAM   | 256QAM     | 58.8  | 682       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 14 | SC-QAM   | 256QAM     | 59.4  | 690       | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 15 | SC-QAM   | 64QAM      | 53    | 698       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 16 | SC-QAM   | 64QAM      | 54.1  | 706       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 17 | SC-QAM   | 64QAM      | 54.2  | 714       | Locked      | 34  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 18 | SC-QAM   | 64QAM      | 53.8  | 722       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 19 | SC-QAM   | 64QAM      | 53.9  | 730       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 20 | SC-QAM   | 64QAM      | 54.9  | 738       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 21 | SC-QAM   | 64QAM      | 55.3  | 746       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 22 | SC-QAM   | 64QAM      | 54.5  | 754       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 23 | SC-QAM   | 64QAM      | 54.5  | 762       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 24 | SC-QAM   | 64QAM      | 54.5  | 770       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 25 | SC-QAM   | 64QAM      | 55    | 778       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 26 | SC-QAM   | 64QAM      | 55    | 786       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 27 | SC-QAM   | 64QAM      | 54.9  | 794       | Locked      | 34  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 28 | SC-QAM   | 64QAM      | 54.4  | 802       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 29 | SC-QAM   | 64QAM      | 54.1  | 810       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 30 | SC-QAM   | 64QAM      | 54.5  | 818       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 31 | SC-QAM   | 64QAM      | 54.5  | 826       | Locked      | 35  |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 32 | SC-QAM   | 64QAM      | 53.7  | 834       | Locked      | 34  |
    +----+----------+------------+-------+-----------+-------------+-----+
    
    Downstream OFDM
    +----+----------+------------+-------+-----------+-------------+-----+
    | ID | Ch. Type | Modulation | Power | Frequency | Lock status | SNR |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 33 | OFDM     | 1024QAM    | 56.1  | 151-324   | Locked      | 39  |
    +----+----------+------------+-------+-----------+-------------+-----+
    
    Upstream
    +----+----------+------------+-------+-----------+-------------+-----+
    | ID | Ch. Type | Modulation | Power | Frequency | Lock status | SNR |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 3  | SC-QAM   | 64QAM      | 110.3 | 37        | Locked      | 0   |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 4  | SC-QAM   | 32QAM      | 110.3 | 31        | Locked      | 0   |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 1  | SC-QAM   | 64QAM      | 110.3 | 51        | Locked      | 0   |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 2  | SC-QAM   | 64QAM      | 110.3 | 45        | Locked      | 0   |
    +----+----------+------------+-------+-----------+-------------+-----+
    
    Upstream OFDMA
    +----+----------+------------+-------+-----------+-------------+-----+
    | ID | Ch. Type | Modulation | Power | Frequency | Lock status | SNR |
    +----+----------+------------+-------+-----------+-------------+-----+
    | 9  | OFDMA    | 16_QAM     | 106.2 | 29.8-64.8 | SUCCESS     | 0   |
    +----+----------+------------+-------+-----------+-------------+-----+
```
</details>

# Notes

A full login and logout sequence is being done on every command execution.
You can provide a password either by setting the environment variable `VODAFONE_ROUTER_PASSWORD` in your shell, in a local `.env` file or by using the `-p` flag.

# Useful related projects:

This code is heavily based on 
- https://github.com/totev/vodafone-station-cli

With some credits to
- https://github.com/Fluepke/vodafone-station-exporter

But as initial idea coming from the Connectbox:
- https://github.com/mbugert/connectbox-prometheus


Cable connection information/meaning:
- https://motorolacable.com/whitepapers/cable-connection

The Diagnose module is based on the guidelines/values provided by Meister Voda:
- https://www.vodafonekabelforum.de/viewtopic.php?t=32353

# Running from source

- Clone repo `git clone <repo url ()ssh or https>`
- install dependencies ``
- Build by `npm run-script build`
- ensure everything is ok `npm audit fix`
- (optional if package is missing `npm install typescript` or at specific version `npm i typescript@4.4.4` or as developer dependency `npm install --save-dev typescript` or as global package `npm install -g typescript`)
- Run by `npx vodafone-station-cli`

Run single command with debug output from within project base directory:
- `env DEBUG=* ./bin/dev status`

Rename file `.env.sample`to `.env`to add your router password as environment variable to the executable.

# Commands
<!-- commands -->
* [`vodafone-station-cli diagnose`](#vodafone-station-cli-diagnose)
* [`vodafone-station-cli discover`](#vodafone-station-cli-discover)
* [`vodafone-station-cli docsis`](#vodafone-station-cli-docsis)
* [`vodafone-station-cli help [COMMAND]`](#vodafone-station-cli-help-command)
* [`vodafone-station-cli login`](#vodafone-station-cli-login)
* [`vodafone-station-cli logout [FILE]`](#vodafone-station-cli-logout-file)
* [`vodafone-station-cli overview`](#vodafone-station-cli-overview)
* [`vodafone-station-cli restart`](#vodafone-station-cli-restart)
* [`vodafone-station-cli scrape [FILE]`](#vodafone-station-cli-scrape-file)
* [`vodafone-station-cli start [FILE]`](#vodafone-station-cli-start-file)
* [`vodafone-station-cli status`](#vodafone-station-cli-status)
* [`vodafone-station-cli temperature`](#vodafone-station-cli-temperature)

## `vodafone-station-cli diagnose`

Diagnose the quality of the docsis connection.

```
USAGE
  $ vodafone-station-cli diagnose [-p <value>] [-w]

FLAGS
  -p, --password=<value>  router/modem password
  -w, --web               review the docsis values in a webapp

DESCRIPTION
  Diagnose the quality of the docsis connection.

EXAMPLES
  $ vodafone-station-cli diagnose
```

_See code: [src/commands/diagnose.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/diagnose.ts)_

## `vodafone-station-cli discover`

Try to discover a cable modem in the network

```
USAGE
  $ vodafone-station-cli discover

DESCRIPTION
  Try to discover a cable modem in the network

EXAMPLES
  $ vodafone-station-cli discover
```

_See code: [src/commands/discover.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/discover.ts)_

## `vodafone-station-cli docsis`

Get the current docsis status as reported by the modem in a JSON format.

```
USAGE
  $ vodafone-station-cli docsis [-p <value>] [-f] [-w]

FLAGS
  -f, --file              write out a report file under ./reports/${CURRENT_UNIX_TIMESTAMP}_docsisStatus.json
  -p, --password=<value>  router/modem password
  -w, --web               review the docsis values in a webapp

DESCRIPTION
  Get the current docsis status as reported by the modem in a JSON format.

EXAMPLES
  $ vodafone-station-cli docsis -p PASSWORD
  {JSON data}
```

_See code: [src/commands/docsis.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/docsis.ts)_

## `vodafone-station-cli help [COMMAND]`

Display help for vodafone-station-cli.

```
USAGE
  $ vodafone-station-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for vodafone-station-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `vodafone-station-cli login`

Login and keep session open

```
USAGE
  $ vodafone-station-cli login [-p <value>]

FLAGS
  -p, --password=<value>  router/modem password

DESCRIPTION
  Login and keep session open

EXAMPLES
  $ vodafone-station-cli docsis -p PASSWORD
```

_See code: [src/commands/login.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/login.ts)_

## `vodafone-station-cli logout [FILE]`

describe the command here

```
USAGE
  $ vodafone-station-cli logout [FILE] [-n <value>] [-f]

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ vodafone-station-cli logout
```

_See code: [src/commands/logout.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/logout.ts)_

## `vodafone-station-cli overview`

Get the current overview as reported by the modem in a JSON format.

```
USAGE
  $ vodafone-station-cli overview [-p <value>]

FLAGS
  -p, --password=<value>  router/modem password

DESCRIPTION
  Get the current overview as reported by the modem in a JSON format.

EXAMPLES
  $ vodafone-station-cli status -p PASSWORD
  {JSON data}
```

_See code: [src/commands/overview.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/overview.ts)_

## `vodafone-station-cli restart`

Restart the router/modem

```
USAGE
  $ vodafone-station-cli restart [-p <value>]

FLAGS
  -p, --password=<value>  router/modem password

DESCRIPTION
  Restart the router/modem

EXAMPLES
  $ vodafone-station-cli restart -p PASSWORD
```

_See code: [src/commands/restart.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/restart.ts)_

## `vodafone-station-cli scrape [FILE]`

describe the command here

```
USAGE
  $ vodafone-station-cli scrape [FILE] [-n <value>] [-f]

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ vodafone-station-cli scrape
```

_See code: [src/commands/scrape.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/scrape.ts)_

## `vodafone-station-cli start [FILE]`

Start serving prometheus.

```
USAGE
  $ vodafone-station-cli start [FILE] [-n <value>] [-f] [-p <value>]

FLAGS
  -f, --force
  -n, --name=<value>      name to print
  -p, --password=<value>  router/modem password

DESCRIPTION
  Start serving prometheus.

EXAMPLES
  $ vodafone-station-cli start
```

_See code: [src/commands/start.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/start.ts)_

## `vodafone-station-cli status`

Get the current status as reported by the modem in a JSON format.

```
USAGE
  $ vodafone-station-cli status [-p <value>]

FLAGS
  -p, --password=<value>  router/modem password

DESCRIPTION
  Get the current status as reported by the modem in a JSON format.

EXAMPLES
  $ vodafone-station-cli status -p PASSWORD
  {JSON data}
```

_See code: [src/commands/status.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/status.ts)_

## `vodafone-station-cli temperature`

Read out modem temperature

```
USAGE
  $ vodafone-station-cli temperature [-p <value>]

FLAGS
  -p, --password=<value>  router/modem password

DESCRIPTION
  Read out modem temperature

EXAMPLES
  $ vodafone-station-cli temperature
```

_See code: [src/commands/temperature.ts](https://github.com/totev/vodafone-station-cli/blob/v1.2.8/src/commands/temperature.ts)_
<!-- commandsstop -->
