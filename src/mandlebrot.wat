(module
    (import "env" "mem" (memory 1 1024 shared))

    (;
        Calculates the number of iterations it takes for Mandlebrot's equation to be considered non-divergent for a
        given complex number: <code>z0=x0 + iy0<code>.

        A complex number is considered non-divergent if it takes less than 'maxIterationCount' iterations of
        Mandlebrot's equation before its modulus exceeds or is equal to 'maxModulus'.

        @param {number} x0 - the real components of the point
        @param {number} y0 - the imaginary components of the point
        @param {number} maxModulus - the maximum permitted modulus of the given iteration
        @param {number} maxIterationCount - the maximum number of allowed iterations

        @return {number} the number of iterations used
    ;)
    (func $mandlebrotPoint
        (export "mandlebrotPoint")                      ;; const mandlebrotPoint = function(
        (param $x0 f64)                                 ;;      x0: number,
        (param $y0 f64)                                 ;;      y0: number,
        (param $maxModulus f64)                         ;;      maxModulus: number,
        (param $maxIterationCount i32)                  ;;      maxIterationCount: number
        (result i32)                                    ;; ): number

        (local $x f64)
        (local $y f64)
        (local $maxModulusSquared f64)
        (local $iterationCount i32)

        (local.set $maxModulusSquared
            (f64.mul
                (local.get $maxModulus)
                (local.get $maxModulus)
            )
        )

        (block $my_block
            (loop $while
                (f64.le
                    (local.get $maxModulusSquared)

                    (f64.add
                        (f64.mul
                            (local.get $x)
                            (local.get $x)
                        )

                        (f64.mul
                            (local.get $y)
                            (local.get $y)
                        )
                    )
                )

                br_if $my_block

                (i32.le_u
                    (local.get $maxIterationCount)
                    (local.get $iterationCount)
                )

                br_if $my_block

                (f64.add
                    (local.get $x0)

                    (f64.sub
                        (f64.mul
                            (local.get $x)
                            (local.get $x)
                        )

                        (f64.mul
                            (local.get $y)
                            (local.get $y)
                        )
                    )
                )

                (f64.add
                    (local.get $y0)
                    (f64.mul
                        (f64.mul
                            (f64.const 2.0)
                            (local.get $x)
                        )
                        (local.get $y)
                    )
                )

                local.set $y
                local.set $x

                (local.set $iterationCount
                    (i32.add
                        (local.get $iterationCount)
                        (i32.const 1)
                    )
                )

                br $while
            )
        )
        local.get $iterationCount
    )

        (;
            Invokes the function '$mandlebrotPoint' for a sequence of complex numbers of increasing 'x' for a given 'y',
            the results of which are stored as a run of 'count' i32 values starting at position 'count' in the 'env.mem'
            memory.

            @param {number} offset - the i32 offset into 'env.mem' to store the first result.
            @param {number} count - how many results to calculate. This must be positive.
            @param {number} x0 - the real component of the first complex number.
            @param {number} y0 - the imaginary component of the complex numbers.
            @param {number} xInc - the amount to increment x0 by with each 'count' cycle.
            @param {number} maxModulus - passed to $mandlebrotPoint as is.
            @param {number} maxIterationCount - passed to $mandlebrotPoint as is.

            This function doesn't return a value.
        ;)
    (func
        (export "mandlebrotLine")                       ;; const mandlebrotLine = function(
        (param $offset i32)                             ;;      offset: number,
        (param $count i32)                              ;;      count: number,
        (param $x0 f64)                                 ;;      x0: number,
        (param $y0 f64)                                 ;;      y0: number,
        (param $xInc f64)                               ;;      xInc: number,
        (param $maxModulus f64)                         ;;      maxModulus: number,
        (param $maxIterationCount i32)                  ;;      maxIterationCount: number)

         (local.set $offset
                (i32.mul
                    (local.get $offset)
                    (i32.const 4)
                )
            )

        (block $my_block
            (loop $while
                (i32.le_u
                    (local.get $count)
                    (i32.const 0)
                )
                br_if $my_block

                (i32.store
                    (local.get $offset)

                    (call $mandlebrotPoint
                        (local.get $x0)
                        (local.get $y0)
                        (local.get $maxModulus)
                        (local.get $maxIterationCount)
                    )
                )

                (local.set $x0
                    (f64.add
                        (local.get $x0)
                        (local.get $xInc)
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
)