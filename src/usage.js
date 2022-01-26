import {bullet, dim} from './log.js'

const flags = [
	{
		command: '-h,--help',
		description: 'Print this message',
	},
	{
		command: '-p,--port',
		description: 'Change the port the server runs on',
	},
]

const subCommands = [
	{
		command: '--init',
		description:
			'Initialize the project folder with the needed helpers and scripts ',
	},
	{
		command: '--bundle',
		description: 'Update the bundle url',
		eg: '> expo-serve --bundle http://localhost:3000/api/manifest',
	},
	{
		command: '--runtime',
		description: 'Update the runtime version',
		eg: '> expo-serve --runtime 0.0.1',
	},
]

const commandHelperToText = (helper) => {
	let message = `
        ${bullet(helper.command)} - ${dim(helper.description)}
`

	if (helper.eg) {
		message += `            ${dim('eg: ')}
            ${dim('> expo-serve --bundle http://localhost:3000/api/manifest')}
`
	}

	return message
}

const subCommandsText = subCommands
	.map((item) => commandHelperToText(item))
	.join('')

const flagsText = flags.map((item) => commandHelperToText(item)).join('')

const usage = `
${bullet('expo-serve')}
    ${dim('Simple self hosted server for expo-updates as a CLI tool')}
    
    ${dim('Usage')}
        expo-serve [subcommands] [flags]

    ${dim('Subcommands')}
       ${subCommandsText}

    ${dim('Flags')}
        ${flagsText}
`

export const printUsage = () => {
	console.log(`\n${usage}\n`)
}
