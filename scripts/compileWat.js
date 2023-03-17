// noinspection SpellCheckingInspection

import {readFileSync, writeFileSync} from "fs";
import wabt from "wabt";
import path from "path";
import {Buffer} from "buffer";

/**
 * Compiles a .wat file to a .wasm module file in the same directory using wabt.
 *
 * @param {string} watPath - the path to the wat file
 * @return {Promise<string>} - the path to the compiled wasm module file
 */
const compileWat = (watPath) => wabt()
    .then(wabtModule => {
        const parsedSourcePath = path.parse(watPath);
        const wasmPath = watPath.replace(parsedSourcePath.ext, ".wasm");
        const wasmModule = wabtModule.parseWat(
            watPath,
            readFileSync(path.resolve(watPath), "utf8")
        );
        const {buffer} = wasmModule.toBinary({});
        writeFileSync(wasmPath, Buffer.from(buffer));

        return wasmPath;
    })

export default compileWat;