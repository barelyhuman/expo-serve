import process from 'node:process'
import express from 'express'
import assetsEndpoint from './asset.js'
import manifestEndpoint from './manifest.js'

process.env.HOSTNAME = process.env.HOSTNAME || 'http://localhost:3000'

const app = express()

const router = new express.Router()

router.get('/manifest', manifestEndpoint)
router.get('/assets', assetsEndpoint)

app.use('/api', router)

app.listen(3000, () => {
	console.log('>> Listening on', 3000)
})
