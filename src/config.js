import process from 'node:process'

export const config = {
	port: process.env.PORT || 3000,
	hostname: process.env.HOSTNAME || 'http://localhost:3000',
}

export const setConfig = (key, value) => {
	config[key] = value
	return config
}
