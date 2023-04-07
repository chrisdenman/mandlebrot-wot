// noinspection JSUnusedGlobalSymbols
export const Types = {};

/**
 * @typedef IterationColouringExports
 * @property {IterationColouringFunction} iterationColouring
 */

/**
 * @callback IterationColouringFunction
 * @param {number} count
 * @param {number} maxIterationCount
 * @param {number} mandlebrotColour
 * @param {number} numPaletteEntries
 */


/**
 * @typedef MandlebrotExports
 * @property {MandlebrotPointFunction} mandlebrotPoint
 * @property {MandlebrotLineFunction} mandlebrotLine
 */

/**
 * @callback MandlebrotPointFunction
 * @param {number} x0
 * @param {number} y0
 * @param {number} maxModulusSquared
 * @param {number} maxIterationCount
 * @return {number}
 */

/**
 * @callback MandlebrotLineFunction
 * @param {number} offset
 * @param {number} count
 * @param {number} x0
 * @param {number} y0
 * @param {number} xInc
 * @param {number} maxModulus
 * @param {number} maxIterationCount
 */

/**
 * @typedef ImageScalingExports
 * @property {BoxScaleFunction} boxScale
 */


/**
 * @callback BoxScaleFunction
 * @param {number} sourceWidth
 * @param {number} sourceHeight
 * @param {number} targetWidth
 * @param {number} targetHeight
 */
