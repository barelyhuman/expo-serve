const isFlag = (x) => x.startsWith('--') || x.startsWith('-')
const isDirectAssignment = (x) => x.split('=').length === 2
const cleanFlagKey = (x) => x.replace(/-/g, '')

export function processArguments(args) {
	const flags = {}
	const ignoreIndex = []

	for (const [index, arg] of args.entries()) {
		if (ignoreIndex.includes(index)) {
			continue
		}

		if (!isFlag(arg)) {
			continue
		}

		if (isDirectAssignment(arg)) {
			const [flagKey, value] = arg.split('=')
			flags[cleanFlagKey(flagKey)] = value
			continue
		}

		const flagKey = cleanFlagKey(arg)
		flags[flagKey] = true

		if (
			args[index + 1] &&
			!isDirectAssignment(arg) &&
			!isFlag(args[index + 1])
		) {
			flags[flagKey] = args[index + 1]
			ignoreIndex.push(index + 1)
		}
	}

	return flags
}
