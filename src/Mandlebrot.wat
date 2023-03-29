(module
    (import "env" "iterationData" (memory 1 1024 shared))

    (;
        Calculates the number of iterations of Mandlebrot's equation to diverge for a given complex
        number: <code>z0=x0 + iy0<code>.

        @param {number} x0 - the real components of the point
        @param {number} y0 - the imaginary components of the point
        @param {number} maxModulusSquared - the maximum permitted modulus of the given iteration
        @param {number} maxIterationCount - the maximum number of allowed iterations

        @return {number} the number of iterations used
    ;)
    (func $mandlebrotPoint
        (export "mandlebrotPoint")                      ;; const mandlebrotPoint2 = function(
        (param $x0 f64)                                 ;;      x0: number,                         (double)
        (param $y0 f64)                                 ;;      y0: number,                         (double)
        (param $maxModulusSquared f64)                  ;;      maxModulusSquared: number,          (double, >0)
        (param $maxIterationCount i32)                  ;;      maxIterationCount: number           (int32, >0)
        (result i32)                                    ;; ): number

        (local $x f64)
        (local $x2 f64)
        (local $y f64)
        (local $y2 f64)
        (local $iterationCount i32)

        ;;    while (x2 + y2 ≤ 4 and iteration < max_iteration) do
        ;;    y:= 2 * x * y + y0
        ;;    x:= x2 - y2 + x0
        ;;    x2:= x * x
        ;;    y2:= y * y
        ;;    iteration:= iteration + 1

        (block $my_block
            (loop $while
                (f64.gt
                    (f64.add
                        (local.get $x2)
                        (local.get $y2)
                    )

                    (local.get $maxModulusSquared)
                )

                br_if $my_block

                (i32.ge_u
                    (local.get $iterationCount)
                    (local.get $maxIterationCount)
                )

                br_if $my_block

                ;; y = 2 * x * y + y0
                (local.set
                    $y
                    (f64.add
                        (f64.mul
                            (f64.add
                                (local.get $x)
                                (local.get $x)
                            )
                            (local.get $y)
                        )
                        (local.get $y0)
                    )
                )

                ;; x = x2 - y2 + x0
                (local.set
                    $x
                    (f64.add
                        (f64.sub
                            (local.get $x2)
                            (local.get $y2)
                        )
                        (local.get $x0)
                    )
                )

                ;; x2 = x * x
                (local.set
                    $x2
                    (f64.mul
                        (local.get $x)
                        (local.get $x)
                    )
                )

                ;; y2 = y * y
                (local.set
                    $y2
                    (f64.mul
                        (local.get $y)
                        (local.get $y)
                    )
                )

                ;; iterationCount += 1
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
        the results of which are stored as a run of 'count' i32 values starting at position 'count' in the
        'env.iterationData' memory.

        @param {number} offset - the i32 offset into 'env.iterationData' to store the first result.
        @param {number} count - how many results to calculate.
        @param {number} x0 - the real component of the first complex number.
        @param {number} y0 - the imaginary component of the complex numbers.
        @param {number} xInc - the amount to increment x0 by with each 'count' cycle.
        @param {number} maxModulusSquared - passed to $mandlebrotPoint as is.
        @param {number} maxIterationCount - passed to $mandlebrotPoint as is.

        This function doesn't return a value.
    ;)
    (func
        (export "mandlebrotLine")                       ;; const mandlebrotLine = function(
        (param $offset i32)                             ;;      offset: number,                     (int 32, >=0)
        (param $count i32)                              ;;      count: number,                      (int 32, >0)
        (param $x0 f64)                                 ;;      x0: number,                         (double)
        (param $y0 f64)                                 ;;      y0: number,                         (double)
        (param $xInc f64)                               ;;      xInc: number,                       (double)
        (param $maxModulusSquared f64)                  ;;      maxModulusSquared: number,          (double)
        (param $maxIterationCount i32)                  ;;      maxIterationCount: number)          (int 32, >0)

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
                        (local.get $maxModulusSquared)
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