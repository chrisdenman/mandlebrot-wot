#!/usr/bin/env bash

# Dump the contents of src/mandlebrot.wasm in a format for simple inclusion in a JS file

xxd -p src/mandlebrot.wasm | sed -e 's/\(..\)/0x\1,/g' -e '1 i\const MANDLEBROT_WASM_BYTES=[' -e '$ a\];'
