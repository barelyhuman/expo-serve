import colors from 'kleur'

const {reset} = colors

export const bullet = colors.bold().white
export const info = colors.bold().bgBlue
export const infoText = colors.bold().blue
export const warning = colors.bold().bgYellow().black
export const warningText = colors.bold().yellow
export const error = colors.bold().bgRed
export const errorText = colors.bold().red
export const {dim} = colors.reset()

export const log = {
	info: (m) => console.log(info(' expo-serve '), reset(bullet(m))),
	warning: (m) => console.warn(warning(' expo-serve '), reset(warningText(m))),
	error: (m) => console.error(error(' expo-serve '), reset(errorText(m))),
}
