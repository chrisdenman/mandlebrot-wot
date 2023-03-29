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
5. 2.1.1 - Added JSDoc type definitions for  module exports to assist with JavaScript integration.
6. 3.0.0 - Implemented the "Optimised Escape Time Algorithm"