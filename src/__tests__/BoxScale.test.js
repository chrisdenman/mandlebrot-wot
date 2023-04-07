import {describe, expect, test} from '@jest/globals';
import path from 'path'
import buildInstantiateWatModule from "../../scripts/loadModule.js";
import MemoryHelper from "../MemoryHelper.js";
import {boxScale} from "../BoxScale.js";

describe('Image Scaling Tests', () => {
    test(
        "That the: JavaScript and AssemblyScript boxScaling implementations agree.",
        async () => {
            await Promise.all([
                checkScaling(extents(1, 1), extents(1, 1)),
                checkScaling(extents(1, 2), extents(1, 1)),
                checkScaling(extents(1, 3), extents(1, 1)),
                checkScaling(extents(2, 1), extents(1, 1)),
                checkScaling(extents(3, 1), extents(1, 1)),
                checkScaling(extents(3, 3), extents(1, 1)),
                checkScaling(extents(4, 2), extents(2, 2)),
                checkScaling(extents(32, 16), extents(5, 7)),
                checkScaling(extents(47, 33), extents(17, 11)),
                checkScaling(extents(382, 73), extents(11, 72)),
                checkScaling(extents(2000, 2000), extents(100, 100)),
            ])
        }
    );
});

const wasmModule = async imports => await buildInstantiateWatModule(path.resolve("src/BoxScale.wat"), imports);

const checkScaling = async ({w: sourceWidth, h: sourceHeight}, {w: targetWidth, h: targetHeight}) => {
    const numSourcePixels = sourceWidth * sourceHeight;

    const imageData = randomImageData(numSourcePixels);

    const numTargetPixels = targetWidth * targetHeight;
    const numTotalPixels = numSourcePixels + numTargetPixels;
    const wasmMemory = MemoryHelper.fromDescriptor(MemoryHelper.memoryDescriptor(
        MemoryHelper.pagesRequired(numTotalPixels << 2),
        1024,
        true
    ));

    MemoryHelper.populate(wasmMemory, imageData);
    return await wasmModule({env: {imageAndThumbnail: wasmMemory}}).then(({exports}) => {
        const jsScaledImageData = new Uint32Array(numTargetPixels);
        boxScale(
            imageData,
            sourceWidth,
            sourceHeight,
            jsScaledImageData,
            targetWidth,
            targetHeight
        )

        imageScalingExports(exports)
            .boxScale(sourceWidth, sourceHeight, targetWidth, targetHeight);
        const wasmScaled = new Uint32Array(wasmMemory.buffer, numSourcePixels << 2, numTargetPixels);

        expect(wasmScaled).toEqual(jsScaledImageData);
    });
};

// noinspection JSValidateTypes
/**
 * @param {Exports} imageScalingExports
 *
 * @return {ImageScalingExports}
 */
const imageScalingExports = imageScalingExports => imageScalingExports

/**
 * Construct a new <code>Extents</code> object.
 * 
 * @param w - the width
 * @param h - the height
 * 
 * @return {Extents}
 */
const extents = (w, h) => ({w, h});

/**
 * Constructs a <code>UInt32Array</code> filled with random values.
 * 
 * @param length the number of 32 bit words to create
 * 
 * @return {Uint32Array}
 */
const randomImageData = length => {
    const data = new Uint32Array(length);
    data.map((_, index) => data[index] = Math.ceil(Math.random() * 0xFFFFFFFF));
    return data;
}

/**
 * @typedef Extents
 * @property w
 * @property h
 */