import {
	getAssetMetadataSync,
	getMetadataSync,
	convertSHA256HashToUUID,
} from './helpers.js'

export default async function manifestEndpoint(request, response) {
	const platform = request.headers['expo-platform']
	const runtimeVersion = request.headers['expo-runtime-version']
	const updateBundlePath = `updates/${runtimeVersion}`

	if (request.method !== 'GET') {
		response.statusCode = 405
		response.json({error: 'Expected GET.'})
		return
	}

	if (platform !== 'ios' && platform !== 'android') {
		response.statusCode = 400
		response.json({
			error: 'Unsupported platform. Expected either ios or android.',
		})
		return
	}

	try {
		const {metadataJson, createdAt, id} = getMetadataSync({
			updateBundlePath,
			runtimeVersion,
		})
		const platformSpecificMetadata = metadataJson.fileMetadata[platform]
		const manifest = {
			id: convertSHA256HashToUUID(id),
			createdAt,
			runtimeVersion,
			assets: platformSpecificMetadata.assets.map((asset) =>
				getAssetMetadataSync({
					updateBundlePath,
					filePath: asset.path,
					ext: asset.ext,
					runtimeVersion,
					platform,
				})
			),
			launchAsset: getAssetMetadataSync({
				updateBundlePath,
				filePath: platformSpecificMetadata.bundle,
				isLaunchAsset: true,
				runtimeVersion,
				platform,
			}),
		}

		response.statusCode = 200
		response.setHeader('expo-protocol-version', 0)
		response.setHeader('expo-sfv-version', 0)
		response.setHeader('cache-control', 'private, max-age=0')
		response.setHeader('content-type', 'application/json; charset=utf-8')
		response.json(manifest)
	} catch (error) {
		response.statusCode = 404
		response.json({error})
	}
}
