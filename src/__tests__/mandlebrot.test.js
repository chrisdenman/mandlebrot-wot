
import {describe, expect, test} from '@jest/globals';
import path from 'path'
import buildInstantiateWatModule from "../../scripts/loadModule.js";

describe('Mandlebrot WASM Tests', () => {

    const wasmModule = async (imports = {
        env: {
            mem: new WebAssembly.Memory({
                initial: 1,
                maximum: 1,
                shared: true
            })
        }
    }) => await buildInstantiateWatModule(path.resolve("src/mandlebrot.wat"), imports);

    test(
        "That the mandlebrotLine function produces results that are consistent with a known implementation",
        () => wasmModule().then(({imports, exports}) => {
            const [offset, xMin, y0, xMax, maxModulus, maxIterationCount, xInc, count] =
                [0, -2.0, 0.6200000000000011, 0.47, 2.0, 10000, 0.01, 247];
            const lineData = [];
            for (let x0 = xMin; x0 < xMax; x0 += xInc) {
                lineData.push(jsMandlebrot(x0, y0, maxModulus, maxIterationCount));
            }
            exports.mandlebrotLine(offset, count, xMin, y0, xInc, maxModulus, maxIterationCount);
            expect(
                new Uint32Array(imports.env.mem.buffer).slice(offset, count)
            ).toEqual(
                new Uint32Array(lineData)
            );
        })
    );

    test(
        'That the mandlebrot function produces results consistent with a known implementation',
        () => wasmModule()
            .then(({exports}) => {
                    const [xMin, yMin, xMax, yMax, maxModulus, maxIterationCount, xInc, yInc] =
                        [-2.0, -1.12, 0.47, 1.12, 2.0, 10000, 0.01, .01];
                    for (let x0 = xMin; x0 < xMax; x0 += xInc) {
                        for (let y0 = yMin; y0 < yMax; y0 += yInc) {
                            expect(
                                exports.mandlebrotPoint(x0, y0, maxModulus, maxIterationCount)
                            ).toEqual(
                                jsMandlebrot(x0, y0, maxModulus, maxIterationCount)
                            )
                        }
                    }
                }
            )
    );

    const jsMandlebrot = function (x0, y0, maxModulus, maxIterationCount) {
        const maxModulusSquared = maxModulus * maxModulus;
        let [x,y, iterationCount] = [0, 0, 0];

        while ((x * x + y * y < maxModulusSquared) && (iterationCount < maxIterationCount)) {
            let xTemp = x * x - y * y + x0;
            y = 2 * x * y + y0;
            x = xTemp;
            iterationCount = iterationCount + 1;
        }

        return iterationCount;
    }
});