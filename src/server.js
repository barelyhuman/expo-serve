import express from 'express'
import assetsEndpoint from './asset.js'
import manifestEndpoint from './manifest.js'
import {config} from './config.js'
import {log} from './log.js'

export function startServer() {
	const app = express()

	const router = new express.Router()

	router.get('/manifest', manifestEndpoint)
	router.get('/assets', assetsEndpoint)

	app.use('/api', router)

	app.listen(config.port, () => {
		log.info(`>> Listening on ${config.port}`)
	})
}
