import {existsSync} from 'node:fs'
import {copyFile, mkdir} from 'node:fs/promises'
import {join} from 'node:path'
import {constants} from './constants.js'

// Create the empty updates folder and any other
// deps for it
const createUpdates = async () => {
	await mkdir('updates', {
		recursive: true,
	})
}

// Create a hidden scripts folder to handle
// syncing data between the manifest and the needed plist
const createScripts = async () => {
	const serveFolder = join(constants.CLI_DIRECTORY)
	await mkdir(serveFolder, {
		recursive: true,
	})

	const templates = Object.values(constants.TEMPLATES)

	await Promise.all(
		templates.map((item) => {
			const targetPath = join(serveFolder, item)
			// Do not override existing template as it may contain modifications from
			// the developer
			if (existsSync(targetPath)) {
				return
			}

			return copyFile(join('..', 'templates', item), join(serveFolder, item))
		})
	)
}

// Leaving errors as is for the first few version
export const initializeExpoServe = async () => {
	await Promise.all([createUpdates(), createScripts()])
}
