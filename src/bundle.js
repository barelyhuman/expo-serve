import {join} from 'node:path'
import {bullet, log} from './log.js'
import {allScriptsExist, command} from './helpers.js'
import {constants} from './constants.js'

export const updateBundleURL = (url) => {
	if (!allScriptsExist()) {
		log.error(
			`The needed scripts do no exist, did you run ${bullet(
				`expo-serve -init`
			)} first?`
		)
		return
	}

	const scriptPath = join(
		'.',
		constants.CLI_DIRECTORY,
		constants.TEMPLATES.bundle
	)

	command(scriptPath, [url])
}
