import process from 'node:process'
import {processArguments} from './args.js'
import {updateBundleURL} from './bundle.js'
import {setConfig} from './config.js'
import {initializeExpoServe} from './init.js'
import {log} from './log.js'
import {updateRuntimeVersion} from './runtime.js'
import {startServer} from './server.js'
import {printUsage} from './usage.js'

function main() {
	const args = process.argv.slice(2)
	if (args.length === 0) {
		return startServer()
	}

	const flags = processArguments(args)

	// Handle the help flag first and then the remaining flags
	if (flags.help || flags.h) {
		return printUsage()
	}

	// Handle subcommands
	if (flags.init) {
		initializeExpoServe()
		return
	}

	if (flags.bundle) {
		if (flags.bundle.length === 0) {
			return log.error(
				'--bundle needs a value (eg: --bundle="https://localhost:3000/api/manifest")'
			)
		}

		updateBundleURL(flags.bundle)
		return
	}

	if (flags.runtime) {
		if (flags.runtime.length === 0) {
			return log.error('--runtime needs a value (eg: --runtime=0.0.1)')
		}

		updateRuntimeVersion()
		return
	}

	// Handle remaining flags
	if (flags.port || flags.p) {
		setConfig('port', flags.port || flags.p)
	}

	startServer()
}

main()
