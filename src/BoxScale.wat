(module
    (import "env" "imageAndThumbnail" (memory 1 1024))

    (;
        Scales down an image from 'sourceWidth' by 'sourceHeight' pixels to 'targetWidth' by 'targetHeight' pixels.

        The image data is read from the first 'sourceWidth'*'souceHeight' Int32 words (4 bytes per pixel) and is written
        immediately afterwards.

        @param {number} sourceWidth - the source image's width in pixels
        @param {number} sourceHeight - the source image's height in pixels
        @param {number} targetWidth - the desired image width in pixels
        @param {number} targetHeight - the desired image height in pixels
    ;)
    (func $boxScale
        (export "boxScale")                                 ;; const iterationColouring = function(
        (param $sourceWidth i32)                            ;;      sourceWidth:    (int 32, >0)
        (param $sourceHeight i32)                           ;;      sourceHeight:   (int 32, >0)
        (param $targetWidth i32)                            ;;      targetWidth:    (int 32, >0)
        (param $targetHeight i32)                           ;;      targetHeight:   (int 32, >0)
                                                            ;; ): void
        (local $scaleX f32)
        (local $scaleY f32)
        (local $xTemp i32)
        (local $yTemp i32)
        (local $numPixels i32)
        (local $thumbnailByteOffset i32)
        (local $i i32)

        (local.set
            $scaleX
            (f32.div
                (f32.convert_i32_u (local.get $sourceWidth))
                (f32.convert_i32_u (local.get $targetWidth))
            )
        )

        (local.set
            $scaleY
            (f32.div
                (f32.convert_i32_u (local.get $sourceHeight))
                (f32.convert_i32_u (local.get $targetHeight))
            )
        )

        (local.set
            $numPixels
            (i32.mul
                (local.get $targetWidth)
                (local.get $targetHeight)
            )
        )

        (local.set
            $thumbnailByteOffset
            (i32.shl
                (i32.mul
                    (local.get $sourceWidth)
                    (local.get $sourceHeight)
                )
                (i32.const 2)
            )
        )

        (block $iInit
            (loop $iFor
                (i32.ge_u
                    (local.get $i)
                    (local.get $numPixels)
                )
                br_if $iInit

                (local.set
                    $xTemp
                    (i32.trunc_f32_u    ;; Math.floor(Math.floor((i % targetWidth)) * scaleX)
                        (f32.floor
                            (f32.mul
                               (f32.convert_i32_u (i32.rem_u (local.get $i) (local.get $targetWidth)))
                               (local.get $scaleX)
                            )
                        )
                    )
                )

                (local.set
                    $yTemp
                    (i32.trunc_f32_u    ;; Math.floor(Math.floor((i / targetWidth)) * scaleY)
                        (f32.floor
                            (f32.mul
                               (f32.convert_i32_u (i32.div_u (local.get $i) (local.get $targetWidth)))
                               (local.get $scaleY)
                            )
                        )
                    )
                )

                (i32.store
                    (local.get $thumbnailByteOffset)

                    (call $boxAverage
                        (local.get $sourceWidth)
                        (local.get $xTemp)
                        (local.get $yTemp)
                        (i32.trunc_f32_u
                            (f32.min    ;; Math.min(Math.round(scaleX), sourceWidth - x)
                                (f32.nearest (local.get $scaleX))
                                (f32.convert_i32_u
                                    (i32.sub
                                        (local.get $sourceWidth)
                                        (local.get $xTemp)
                                    )
                                )
                            )
                        )
                        (i32.trunc_f32_u
                            (f32.min    ;; Math.min(Math.round(scaleX), sourceWidth - x)
                                (f32.nearest (local.get $scaleY))
                                (f32.convert_i32_u
                                    (i32.sub
                                        (local.get $sourceHeight)
                                        (local.get $yTemp)
                                    )
                                )
                            )
                        )
                    )
                )

                (local.set
                    $thumbnailByteOffset
                    (i32.add
                        (local.get $thumbnailByteOffset)
                        (i32.const 4)
                    )
                )

                (local.set
                    $i
                    (i32.add
                        (local.get $i)
                        (i32.const 1)
                    )
                )

                br $iFor
            )
        )
    )

    (;
        Averages a rectangular region's Int32 values.

        The image data is presented starting at memory location '0' in the normal line by line fashion with 4 bytes per
        pixel.

        @param {number} imageWidth - the width of the image to sample form
        @param {number} x - the region's top-left x-coordinate
        @param {number} y - the region's top-left y-coordinate
        @param {number} w - the region's width (inclusive)
        @param {number} h - the region's height (inclusive)
        @return {number} the average of the given region's Int32 words
    ;)
    (func $boxAverage
        (param $imageWidth i32)                             ;;      imageWidth:     (int 32, >0)
        (param $x i32)                                      ;;      x:              (int 32, >0)
        (param $y i32)                                      ;;      y:              (int 32, >0)
        (param $w i32)                                      ;;      w:              (int 32, >0)
        (param $h i32)                                      ;;      h:              (int 32, >0)
        (result i32)                                        ;; ): number

        (local $numPixels i32)

        (local $average f64)

        (local $byteOffset i32)
        (local $xO i32)
        (local $yO i32)

        (local.set
            $numPixels
            (i32.mul
                (local.get $w)
                (local.get $h)
            )
        )

        (block $xForInit
            (local.set
                $xO
                (local.get $x)
            )
            (loop $xFor
                (i32.gt_u
                    (local.get $xO)
                    (i32.add
                        (local.get $x)
                        (i32.sub
                            (local.get $w)
                            (i32.const 1)
                        )
                    )
                )
                br_if $xForInit

                (block $yForInit
                    (local.set
                        $yO
                        (local.get $y)
                    )
                    (loop $yFor
                         (i32.gt_u
                            (local.get $yO)
                            (i32.add
                            (local.get $y)
                                (i32.sub
                                    (local.get $h)
                                    (i32.const 1)
                                )
                            )
                        )
                        br_if $yForInit

                        (local.set $byteOffset
                            (i32.shl
                                (i32.add
                                    (i32.mul
                                        (local.get $yO)
                                        (local.get $imageWidth)
                                    )
                                    (local.get $xO)
                                )
                                (i32.const 2)
                            )
                        )

                        (local.set
                            $average
                            (f64.add
                                (local.get $average)
                                (f64.div
                                    (f64.convert_i32_u (i32.load (local.get $byteOffset)))
                                    (f64.convert_i32_u (local.get $numPixels))
                                )
                            )
                        )

                        (local.set
                            $yO
                            (i32.add
                                (local.get $yO)
                                (i32.const 1)
                            )
                        )

                        br $yFor
                    )
                )

                (local.set
                    $xO
                    (i32.add
                        (local.get $xO)
                        (i32.const 1)
                    )
                )

                br $xFor
            )
        )

        (i32.trunc_f64_u (f64.floor (local.get $average)))
    )
)