import {describe, expect, test} from '@jest/globals';
import path from 'path'
import buildInstantiateWatModule from "../../scripts/loadModule.js";
import MemoryHelper from "../MemoryHelper.js";

describe('Mandlebrot WASM Tests', () => {

    const wasmModule = async (imports = {
        env: {
            iterationAndPaletteData: MemoryHelper.fromDescriptor(MemoryHelper.memoryDescriptor(1, 1))
        }
    }) => await buildInstantiateWatModule(path.resolve("src/MandlebrotColouring.wat"), imports);

    test(
        "That the iterationColouring function fills 'count' 32 bit words with red", async () => {
            const memory = MemoryHelper.fromDescriptor(MemoryHelper.memoryDescriptor(1, 1));
            await wasmModule({env: {iterationAndPaletteData: memory}})
                .then(({exports}) => {
                    const setInclusionIterationCount = 1000;
                    const iterationData = [
                        0xffffffff,
                        setInclusionIterationCount - 1, setInclusionIterationCount, setInclusionIterationCount + 1,
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
                    ];
                    const setInclusionColour = 1;
                    const palette = [0xff000000, 0x00ff00ff, 0x000000ff, 0x00ff0000];
                    buildMemory(memory, iterationData, palette);
                    // noinspection JSUnresolvedFunction
                    iterationColouringExports(exports).iterationColouring(
                        iterationData.length,
                        setInclusionIterationCount,
                        setInclusionColour,
                        palette.length
                    );

                    expect(
                        new Uint32Array(memory.buffer).slice(0, iterationData.length)
                    ).toEqual(
                        getMemoryExpectation(
                            iterationData,
                            setInclusionIterationCount,
                            setInclusionColour,
                            palette
                        )
                    );
                })
        }
    );

    /**
     * @param {number[]} iterationData
     * @param {number} setInclusionIterationCount
     * @param {number} setInclusionColour
     * @param {number[]} palette
     *
     * @return {Uint32Array}
     */
    const getMemoryExpectation =
        (iterationData, setInclusionIterationCount, setInclusionColour, palette) =>
            new Uint32Array(
                iterationData.map(
                    value => value >= setInclusionIterationCount ? setInclusionColour : palette[value % palette.length]
                )
            );

    /**
     * @param {WebAssembly.Memory} memory
     * @param {number[]} iterationData
     * @param {number[]} palette
     */
    const buildMemory = (memory, iterationData, palette) => {
        const memoryArray = new Uint32Array(memory.buffer);
        const iterationDataLength = iterationData.length;
        iterationData.forEach((value, index) => memoryArray[index] = value);
        palette.forEach((value, index) => memoryArray[iterationDataLength + index] = value);
    }

    // noinspection JSValidateTypes
    /**
     * @param {Exports} iterationColouringExports
     * @return IterationColouringExports
     */
    const iterationColouringExports = (iterationColouringExports) => iterationColouringExports
});

/**
 * @typedef IterationColouringExports
 * @property {IterationColouringFunction} iterationColouring
 */

/**
 * @callback IterationColouringFunction
 * @param {number} count
 * @param {number} maxIterationCount
 * @param {number} maxIterationColour
 * @param {number} numPaletteEntries
 */