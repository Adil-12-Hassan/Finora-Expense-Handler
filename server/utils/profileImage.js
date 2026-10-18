const MAX_PROFILE_IMAGE_BYTES = 500 * 1024

const imageSignatures = {
    'image/jpeg': (buffer) =>
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff,
    'image/png': (buffer) =>
        buffer.length >= 8 &&
        buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/webp': (buffer) =>
        buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP',
}

export const validateProfileImage = (dataUrl) => {
    if (typeof dataUrl !== 'string') {
        return 'Profile image must be a valid image file'
    }

    const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/)
    if (!match) {
        return 'Profile image must be a JPEG, PNG, or WebP image'
    }

    const [, mimeType, base64] = match
    const imageBuffer = Buffer.from(base64, 'base64')

    if (imageBuffer.toString('base64') !== base64) {
        return 'Profile image data is invalid'
    }

    if (imageBuffer.length > MAX_PROFILE_IMAGE_BYTES) {
        return 'Profile image must be 500 KB or smaller'
    }

    if (!imageSignatures[mimeType](imageBuffer)) {
        return 'Profile image content does not match its file type'
    }

    return null
}
