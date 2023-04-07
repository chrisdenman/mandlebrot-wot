# Version History

1. 1.0.0 - First public version. Point function, and line function with shared memory access.
2. 1.1.0 - Added helper script to dump the src/mandlebrot.wasm file as a JS compatible array. Added src/mandlebrot.wasm
   to .gitignore
3. 2.0.0 - Changed mandlebrotLine WASM function to take point offsets instead of byte offsets. Changed makeJSHexArray.js
   to output byte values and to output valid JS array code.
4. 2.1.0 - Added a WASM function to colour previously generated iteration data. The 'compileWat.js' script now creates
   the output directory if it is present. The 'loadModule.js' script defaults the compilation output directory to '
   build'. Renamed the WebAssembly Memory imports to something more useful. Updated the README.md. Better documentation
   for the '.wat' files. Added a package.json build target. Moved 'makeJSHexArray.sh' into the scripts directory.
5. 2.1.1 - Added JSDoc type definitions for module exports to assist with JavaScript integration.
6. 3.0.0 - Implemented the "Optimised Escape Time Algorithm". Using 'tee' to reduce local variable instructions in '
   mandlebrotPoint'. Moved the i32 test to the first position in 'mandlebrotPoint'.
7. 3.1.0 - Added 'BoxScale.wat' WebAssembly script that export 'boxScale' for box scaling images. Added '
   MemoryHelper.js' for common WebAssembly memory JS code.
8. 4.0.0 - Fixed a bug in 'boxScale' (and the corresponding WebAssembly Script function) whereby it wasn't treating RGBA
   components separately, leading to errors bleeding between components. Removed the 'homepage' package.json entry. Made
   the memory shared so that it can be run via a WebWorker.
9. 4.0.1 - Renamed 'maxIterationColour'>'mandlebrotColour'. npm update. Moved the JSDoc types to separate file.