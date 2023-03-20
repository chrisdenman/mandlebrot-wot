# Version History

1. 1.0.0 - First public version. Point function, and line function with shared memory access.
2. 1.1.0 - Added helper script to dump the src/mandlebrot.wasm file as a JS compatible array. Added src/mandlebrot.wasm
   to .gitignore
3. 2.0.0 - Changed mandlebrotLine WASM function to take point offsets instead of byte offsets. Changed makeJSHexArray.js
   to output byte values and to output valid JS array code.   