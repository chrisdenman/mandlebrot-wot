import {readFileSync} from "fs";
import compileWat from "./compileWat.js";
import path from "path";

/**
 * @typedef {object} InstantiatedInfo
 * @property {object} imports - the 'imports' object passed in
 * @property {Exports} exports - the instantiated module instance's exports
 */

/**
 * Compiles and instantiates a .wasm file using <code>WebAssembly</code>.
 *
 * @param {string} watPath - the path to your .wat file
 * @param {object} imports - the imports to provide to the wasm module
 * @return {Promise<InstantiatedInfo>} - the imports provided and the instantiated module's exports
 */
const buildInstantiateWatModule = (watPath, imports = {}) =>
    compileWat(watPath)
        .then(
            wasmFile => WebAssembly.compile(readFileSync(path.resolve(wasmFile)))
        )
        .then(
            webAssemblyModule => WebAssembly.instantiate(webAssemblyModule, imports)
        )
        .then(
            instance => ({imports: imports, exports: instance.exports})
        )

export default buildInstantiateWatModule;