/**
 * Averages the RGBA values of a rectangular region of an image.
 *
 * @param {Uint32Array} imageData - the image's data array
 * @param {number} imageWidth - the image's width
 * @param {Region} region - the region to average
 *
 * @return {number} the average of the given region's pixels RGBA value
 */
const boxAverage = (imageData, imageWidth, {x, y, w, h}) => {
    let average0 = 0;
    let average1 = 0;
    let average2 = 0;
    let average3 = 0;
    const numSamples = w * h;
    for (let xO = x; xO <= x + w - 1; xO++) {
        for (let yO = y; yO <= y + h - 1; yO++) {
            let sample = imageData[(yO * imageWidth + xO)];
            average0 += ((sample & 0xFF) / numSamples);
            average1 += ((sample >>= 8) & 0xFF) / numSamples;
            average2 += ((sample >>= 8) & 0xFF) / numSamples;
            average3 += ((sample >>= 8) & 0xFF) / numSamples;
        }
    }

    return Math.trunc(average3 << 24) | (average2 << 16) | (average1 << 8) | average0;
}

/**
 * Scales down an image from 'sourceWidth' by 'sourceHeight' pixels to 'targetWidth' by 'targetHeight' pixels.
 *
 * @param {Uint32Array} sourceData the source image data
 * @param {Uint32Array} targetData the target image data
 * @param {number} sourceWidth - the source image's width in pixels
 * @param {number} sourceHeight - the source image's height in pixels
 * @param {number} targetWidth - the desired image width in pixels
 * @param {number} targetHeight - the desired image height in pixels
 */
const boxScale = (
    sourceData,
    sourceWidth,
    sourceHeight,
    targetData,
    targetWidth,
    targetHeight
) => {
    const scaleX = sourceWidth / targetWidth;
    const scaleY = sourceHeight / targetHeight;
    const numPixels = targetWidth * targetHeight;
    for (let i = 0; i < numPixels; i++) {
        const x = Math.floor(Math.floor((i % targetWidth)) * scaleX);
        const y = Math.floor(Math.floor((i / targetWidth)) * scaleY);
        const samplingRegion = region(
            x,
            y,
            Math.min(Math.round(scaleX), sourceWidth - x),
            Math.min(Math.round(scaleY), sourceHeight - y)
        );
        targetData[i] = boxAverage(
            sourceData,
            sourceWidth,
            samplingRegion
        );
    }
}

/**
 * @typedef Region
 * @property {number} x - the x-coordinate of the top left pixel
 * @property {number} y - the y-coordinate of the top left pixel
 * @property {number} w - the inclusive width of the region
 * @property {number} h - the inclusive height of the region
 */

/**
 * Construct a new <code>Region</code> object.
 *
 * @param {number} x - the x-coordinate of the top left pixel
 * @param {number} y - the y-coordinate of the top left pixel
 * @param {number} w - the inclusive width of the region
 * @param {number} h - the inclusive height of the region
 *
 * @return {Region}
 */
const region = (x, y, w, h) => ({x, y, w, h});

export {boxScale};