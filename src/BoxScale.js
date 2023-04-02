/**
 * Averages the RGBA values of a rectangular region of an image.
 *
 * @param {Uint32Array} imageData - the image's data array
 * @param {number} imageWidth - the image's width
 * @param {Region} region - the region to average
 *
 * @return {number} the average of the given region's pixels RGBA value
 */
const boxAverage = (imageData, imageWidth, region) => {
    let average = 0;
    const numSamples = region.w * region.h;
    for (let xO = region.x; xO <= region.x + region.w - 1; xO++) {
        for (let yO = region.y; yO <= region.y + region.h - 1; yO++) {
            average += imageData[(yO * imageWidth + xO)] / numSamples;
        }
    }

    return Math.floor(average);
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