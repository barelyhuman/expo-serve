import fs from 'node:fs'
import path from 'node:path'
import mime from 'mime'
import {getMetadataSync} from './helpers.js'

export default function assetsEndpoint(request, response) {
	const {asset: assetName, runtimeVersion, platform} = request.query

	if (!assetName) {
		response.statusCode = 400
		response.json({error: 'No asset name provided.'})
		return
	}

	if (!platform) {
		response.statusCode = 400
		response.json({error: 'No platform provided. Expected "ios" or "android".'})
		return
	}

	if (!runtimeVersion) {
		response.statusCode = 400
		response.json({error: 'No runtimeVersion provided.'})
		return
	}

	const updateBundlePath = `updates/${runtimeVersion}`
	const {metadataJson} = getMetadataSync({
		updateBundlePath,
		runtimeVersion,
	})

	const assetPath = path.resolve(assetName)
	const assetMetadata = metadataJson.fileMetadata[platform].assets.find(
		(asset) =>
			asset.path === assetName.replace(`updates/${runtimeVersion}/`, '')
	)
	const isLaunchAsset =
		metadataJson.fileMetadata[platform].bundle ===
		assetName.replace(`updates/${runtimeVersion}/`, '')

	if (!fs.existsSync(assetPath)) {
		response.statusCode = 404
		response.json({error: `Asset "${assetName}" does not exist.`})
		return
	}

	try {
		const asset = fs.readFileSync(assetPath, null)

		response.statusCode = 200
		response.setHeader(
			'content-type',
			isLaunchAsset ? 'application/javascript' : mime.getType(assetMetadata.ext)
		)
		response.end(asset)
	} catch (error) {
		response.statusCode = 500
		response.json({error})
	}
}
