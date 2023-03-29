# [Mandlebrot-Wot 3.0.0](https://github.com/chrisdenman/mandlebrot-wot)

Mandlebrot set Web-Assembly routines packaged in two [WASM](https://webassembly.org/) modules:

- `Mandlebrot.wasm` which exposes the functions:
    - [mandlebrotPoint](src/Mandlebrot.wat) - for calculating the number of iterations for a given complex number.
    - [mandlebrotLine](src/Mandlebrot.wat) - which invokes `mandlebrotPoint` for a run of points with a shared y
      coordinate.
- `MandlebrotColouring.wasm` which exposes the functions:
    - [iterationColouring](src/MandlebrotColouring.wat) - for mutating iteration data presumably produced
      by `mandlebrotLine` into RGBA colours.

Please follow the links above for more detailed information.

## Aims

1. The efficient generation of Mandlebrot sets from JavaScript.
2. To provide a mechanism recolouring a given Mandlebrot set without having to regenerate it.

### Why are there two modules?

1. The aims necessitate the need for (at least) two functions: one to generate Mandlebrot iteration data and, another to
   colour said data.
2. We want everything to run as quickly as possible but, in particular, the generation of the iteration data, as this is
   the most computationally intensive portion, it needs to be threaded.
3. To share WebAssembly Memory objects between JavaScript and multiple worker tasks it needs to be marked as `shared`
   which implies at least a single module containing the Mandlebrot point and line routines.
4. To facilitate fast rendering of Mandlebrot images in JavaScript, we want to render an ImageData object directly to a
   JavaScript Canvas.
5. JavaScript does not allow an ImageData's buffer to be backed by those that are writable by multiple threads, so we
   can
   not back a ImageData buffer with a shared WebAssembly Memory.
6. WebAssembly modules can only currently have a single Memory declaration. They cannot declare e.g. two memories, one
   shared and one not. In particular this means we can't copy Memory data in WebAssembly.

All of this results in the design choice to have two buffers (or WebAssembly Memory instances)
for the Mandlebrot data, one for the raw iteration data (which is shared and threaded), and one containing RGBA data for
quick rendering (which is not shared and not threaded) and hence, two distinct WebAssembly modules, one that operates on
the shared memory and one that operates on the non-shared memory.

If we were happy to have 3 copies of the data, we could thread the colouring functions but as the colouring task is just
lookup table mapping, it may not be faster than the time it takes to launch multiple workers and to clone the buffer
another time (in JavaScript).

## Installing

- `npm install`

## Building

- `npm run build`

## Testing

`npm test` (coverage outputs to the [coverage](coverage) folder, see [index.html](./coverage/lcov-report/index.html)

Every test re-: assembles and compiles every .wat file to facilitate the development workflow.

## Linting

`npm run lint`

This will produce [build/Mandlebrot.wasm](build/Mandlebrot.wasm)
and [build/MandlebrotColouring.wasm](build/MandlebrotColouring.wasm) into the [build](./build) directory.

## Future Work

- If we are happy with 3 copies of the Mandlebrot data, we could thread the colouring:
    1. Mandlebrot raw iteration data (shared Memory for threaded generation)
    2. RGBA data (shared Memory for threaded colouring)
    3. RGBA data (non-shared Memory for fast rendering)
- Input validation and error code functionality?

## References

1. [Plotting algorithms for the Mandelbrot set](https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set)
2. [MDN Web Docs - WebAssembly ](https://developer.mozilla.org/en-US/docs/WebAssembly)

## Version History

See [Version History](./VERSIONS.md)

## Licensing

The [Unlicense](https://unlicense.org/)

Please re-read for more information.