import {describe, expect, test} from '@jest/globals';
import path from 'path'
import buildInstantiateWatModule from "../../scripts/loadModule.js";

describe('Mandlebrot WASM Tests', () => {

    const wasmModule = async (imports = {
        env: {
            iterationAndPaletteData: new WebAssembly.Memory({
                initial: 1,
                maximum: 1
            })
        }
    }) => await buildInstantiateWatModule(path.resolve("src/MandlebrotColouring.wat"), imports);

    test(
        "That the iterationColouring function fills 'count' 32 bit words with red", async () => {
            const MEMORY = new WebAssembly.Memory({
                initial: 1,
                maximum: 1
            });
            await wasmModule({env: {iterationAndPaletteData: MEMORY}})
                .then(({exports}) => {
                    const MAX_ITERATION_COUNT = 1000;
                    const ITERATION_DATA = [
                        0xffffffff, MAX_ITERATION_COUNT + 1, MAX_ITERATION_COUNT, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
                    ];
                    const MAX_ITERATION_COLOUR = 1;
                    const PALETTE = [0xff000000, 0x00ff00ff, 0x000000ff, 0x00ff0000];
                    buildMemory(MEMORY, ITERATION_DATA, PALETTE);
                    // noinspection JSUnresolvedFunction
                    exports.iterationColouring(
                        ITERATION_DATA.length,
                        MAX_ITERATION_COUNT,
                        MAX_ITERATION_COLOUR,
                        PALETTE.length
                    );
                    expect(
                        new Uint32Array(MEMORY.buffer).slice(0, ITERATION_DATA.length)
                    ).toEqual(
                        getMemoryExpectation(
                            ITERATION_DATA,
                            MAX_ITERATION_COUNT,
                            MAX_ITERATION_COLOUR,
                            PALETTE
                        )
                    );
                })
        }
    );

    /**
     * @param {number[]} iterationData
     * @param {number} maxIterationCount
     * @param {number} maxIterationColour
     * @param {number[]} palette
     *
     * @return {Uint32Array}
     */
    const getMemoryExpectation =
        (iterationData, maxIterationCount, maxIterationColour, palette) =>
            new Uint32Array(
                iterationData.map(
                    value => value > maxIterationCount ? maxIterationColour : palette[value % palette.length]
                )
            );

    /**
     * @param {WebAssembly.Memory} memory
     * @param {number[]} iterationData
     * @param {number[]} palette
     */
    const buildMemory = (memory, iterationData, palette) => {
        const MEMORY_ARRAY = new Uint32Array(memory.buffer);
        const ITERATION_DATA_LENGTH = iterationData.length;
        iterationData.forEach((value, index) => MEMORY_ARRAY[index] = value);
        palette.forEach((value, index) => MEMORY_ARRAY[ITERATION_DATA_LENGTH + index] = value);
    }
});