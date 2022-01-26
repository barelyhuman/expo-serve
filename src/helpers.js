import fs, {existsSync} from 'node:fs'
import crypto from 'node:crypto'
import {join} from 'node:path'
import {exec} from 'node:child_process'
import mime from 'mime'

import {config} from './config.js'
import {log} from './log.js'
import {constants} from './constants.js'

export const createHash = (file, hashingAlgorithm) => {
	return crypto.createHash(hashingAlgorithm).update(file).digest('hex')
}

export const getAssetMetadataSync = ({
	updateBundlePath,
	filePath,
	ext,
	isLaunchAsset,
	runtimeVersion,
	platform,
}) => {
	const assetFilePath = `${updateBundlePath}/${filePath}`
	const asset = fs.readFileSync(assetFilePath, null)
	const assetHash = createHash(asset, 'sha256')
	const keyHash = createHash(asset, 'md5')
	const keyExtensionSuffix = isLaunchAsset ? 'bundle' : ext
	const contentType = isLaunchAsset
		? 'application/javascript'
		: mime.getType(ext)

	return {
		hash: assetHash,
		key: `${keyHash}.${keyExtensionSuffix}`,
		contentType,
		url: `${config.hostname}/api/assets?asset=${assetFilePath}&runtimeVersion=${runtimeVersion}&platform=${platform}`,
	}
}

export const getMetadataSync = ({updateBundlePath, runtimeVersion}) => {
	try {
		const metadataPath = `${updateBundlePath}/metadata.json`
		const updateMetadataBuffer = fs.readFileSync(metadataPath, null)
		const metadataJson = JSON.parse(updateMetadataBuffer.toString('utf-8'))
		const metadataStat = fs.statSync(metadataPath)

		return {
			metadataJson,
			createdAt: new Date(metadataStat.birthtime).toISOString(),
			id: createHash(updateMetadataBuffer, 'sha256'),
		}
	} catch (error) {
		throw new Error(
			`No update found with runtime version: ${runtimeVersion}. Error: ${error}`
		)
	}
}

export const convertSHA256HashToUUID = (value) => {
	return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(
		12,
		16
	)}-${value.slice(16, 20)}-${value.slice(20, 32)}`
}

export const allScriptsExist = () => {
	let exists = true

	if (!existsSync(constants.CLI_DIRECTORY)) {
		return false
	}

	for (const temporaryPath of Object.values(constants.TEMPLATES)) {
		const pathToCheck = join(constants.CLI_DIRECTORY, temporaryPath)
		if (!existsSync(pathToCheck)) {
			exists = true
		}
	}

	return exists
}

export const command = (cmd, parameters) => {
	const toExec = [cmd, ...parameters].join(' ')
	exec(toExec, (error, stdout, stderr) => {
		if (error) throw error
		if (stdout) log.info(stdout)
		if (stderr) log.error(stderr)
	})
}
