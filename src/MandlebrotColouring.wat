(module
    (import "env" "iterationAndPaletteData" (memory 1 1024))

    (;
        Mutates interation data into RGBA colours using a palette.

        Operation:

            - For each 'iterationData' entry:
                - if value > 'maxIterationCount', change its value to 'mandlebrotColour'
                - , else change its value to the palette entry located at colour offset value % numPaletteEntries

        The 'env.iterationAndPaletteData' memory must have the following layout.

            - 'count' i32 iteration data entries
            - 'numPaletteEntries' i32 RGBA encoded colours

        @param {number} count - how many iteration data entries there are
        @param {number} maxIterationCount - the maximum iteration count present
        @param {number} mandlebrotColour -  the colour to assign to point that are in the Mandlebrot set proper
        @param {number} numPaletteEntries - the number of palette entries

    ;)
    (func $iterationColouring
        (export "iterationColouring")                       ;; const iterationColouring = function(
        (param $count i32)                                  ;;      count:                          (int 32, >0)
        (param $maxIterationCount i32)                      ;;      maxIterationCount:              (int 32, >0)
        (param $mandlebrotColour i32)                       ;;      mandlebrotColour:             (int 32, ABBR)
        (param $numPaletteEntries i32)                      ;;      numPaletteEntries:              (int 32, >0)
                                                            ;; ): void

        (local $offset i32)                                 ;; how many pixels we have processed
        (local $paletteOffset i32)                          ;; The palette memory offset

        (local.set $paletteOffset
            (i32.mul
                (local.get $count)
                (i32.const 4)
            )
        )

        (loop $while

            (i32.le_u
                (local.get $count)
                (i32.const 0)
            )
            if
                return
            end

            (i32.lt_u
                (i32.load (local.get $offset))
                (local.get $maxIterationCount)
            )
            (if
                (then
                    (i32.store
                        (local.get $offset)

                        (i32.load
                            (i32.add
                                (i32.mul
                                    (i32.rem_u (i32.load (local.get $offset)) (local.get $numPaletteEntries))
                                    (i32.const 4)
                                )
                                (local.get $paletteOffset)
                            )
                        )
                    )
                )
                (else
                    (i32.store
                        (local.get $offset)

                        (local.get $mandlebrotColour)
                    )
                )
            )

            (local.set $offset
                (i32.add
                    (local.get $offset)
                    (i32.const 4)
                )
            )

            (local.set $count
                (i32.sub
                    (local.get $count)
                    (i32.const 1)
                )
            )

            br $while
        )
    )
)


