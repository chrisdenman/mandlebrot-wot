import compileWat from "../scripts/compileWat.js";
import path from "path";

await compileWat(path.resolve("src/MandlebrotColouring.wat"), path.resolve("build"));
await compileWat(path.resolve("src/Mandlebrot.wat"), path.resolve("build"));
