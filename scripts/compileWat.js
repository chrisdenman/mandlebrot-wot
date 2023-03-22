// noinspection SpellCheckingInspection

import fs, {readFileSync, writeFileSync} from "fs";
import wabt from "wabt";
import path from "path";
import {Buffer} from "buffer";

/**
 * Compiles a .wat file to a .wasm file in the specified directory.
 *
 * @param {string} watPath - the path to the wat file
 * @param {string} outputDirectory - the directory into which to write the wasm file
 * @return {Promise<string>} - the path to the compiled wasm module file
 */
const compileWat = (watPath, outputDirectory) => wabt()
    .then(wabtModule => {
        fs.existsSync(outputDirectory) || fs.mkdirSync(outputDirectory);

        const parsedSourcePath = path.parse(watPath);
        const wasmPath = `${outputDirectory}/${parsedSourcePath.name}.wasm`
        const wasmModule = wabtModule.parseWat(
            watPath,
            readFileSync(path.resolve(watPath), "utf8"),
            {
                threads: true
            }
        );
        const {buffer} = wasmModule.toBinary({});
        writeFileSync(wasmPath, Buffer.from(buffer));

        return wasmPath;
    });


export default compileWat;