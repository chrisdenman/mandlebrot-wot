export default class MemoryHelper {

    /**
     * Produces a new memory descriptor object for constructing <code>WebAssembly.Memory</code> objects.
     *
     * @param {number} initial - the initial number of web assembly 64KiB pages
     * @param {number} [maximum=initial] - the maximum number of web assembly 64KiB pages
     * @param {boolean} [shared=false] - is the memory shared?
     *
     * @return {WebAssembly.MemoryDescriptor}
     */
    static memoryDescriptor = (initial, maximum = initial, shared = false) =>
        ({initial, maximum, shared});

    /**
     * How many (whole) WebAssembly memory pages are required to store 'numberOfBytes' bytes?
     * <p>
     * The minimum result value is always 1.
     *
     * @param {number} numberOfBytes - the number of bytes to store
     *
     * @return {number} how many (whole) WebAssembly memory pages required
     */
    static pagesRequired = (numberOfBytes) =>
        Math.max(1, Math.ceil(numberOfBytes / WEB_ASSEMBLY_PAGE_SIZE_IN_BYTES));

    /**
     * Grows the memory to have 'totalPagesRequired' pages.
     * <p>
     * Note, <code>memory.grow</code> is not called if the memory already has the required number of pages.
     *
     * @param {WebAssembly.Memory} memory - the memory to grow
     * @param {number} totalPagesRequired - the number of pages required
     *
     * @return {WebAssembly.Memory} the 'memory' argument
     */
    static grow = (memory, totalPagesRequired) => {
        const currentNumberOfPages = memory.buffer.byteLength / WEB_ASSEMBLY_PAGE_SIZE_IN_BYTES;
        const numberOfNewPagesRequired = totalPagesRequired - currentNumberOfPages;
        if (numberOfNewPagesRequired > 0) {
            memory.grow(numberOfNewPagesRequired);
        }
        return memory;
    }

    /**
     * Either grows an existing <code>WebAssembly.Memory</code> or creates a new one.
     *
     * @param {number} requiredNumberOfPages - the required number of WebAssembly pages
     * @param {number} maximumNumberOfPages = 1024 - the maximum number of WebAssembly pages (that the memory can be
     * grown to)
     * @param {boolean} shared = false - if a new <code>WebAssembly.Memory</code> is created, should it be marked as
     * shared?
     * @param {WebAssembly.Memory} memory = undefined - the existing <code>WebAssembly.Memory</code> memory object to
     * grow
     *
     * @return {WebAssembly.Memory} the code>WebAssembly.Memory</code> instance passed in (newly grown) or a newly
     * constructed one
     */
    static createOrGrow = (
        requiredNumberOfPages,
        memory = undefined,
        maximumNumberOfPages = 1024,
        shared = false,
    ) =>
        memory === undefined ?
            MemoryHelper.create(requiredNumberOfPages, maximumNumberOfPages, shared) :
            MemoryHelper.grow(memory, requiredNumberOfPages);

    /**
     * Creates a new <code>WebAssembly.Memory</code> with the specified characteristics.
     *
     * @param {number} requiredNumberOfPages - the required number of WebAssembly pages
     * @param {number} maximumNumberOfPages = 1024 - the maximum number of WebAssembly pages (that the memory can be
     * grown to)
     * @param {boolean} shared = false - if a new <code>WebAssembly.Memory</code> is created, should it be marked as
     * shared?     *
     * @return {WebAssembly.Memory}
     */
    static create = (
        requiredNumberOfPages,
        maximumNumberOfPages = 1024,
        shared = false,
    ) => new WebAssembly.Memory(MemoryHelper.memoryDescriptor(requiredNumberOfPages, maximumNumberOfPages, shared));

    /**
     * @param {WebAssembly.MemoryDescriptor} descriptor
     * @return {WebAssembly.Memory}
     */
    static fromDescriptor = (descriptor) => new WebAssembly.Memory(descriptor);

    /**
     * Populates a <code>WebAssembly.Memory</code> instance from a <code>UInt32Array</code> source.
     *
     * @param {WebAssembly.Memory} memory - the instance to populate
     * @param {Uint32Array} source - the data source of 32 bit words
     * @param {number} writeOffset=0 - the 32 bit word offset to start populating from
     * @param {number} length=source.length - the number of 32 bit words to write
     */
    static populate = (memory, source, writeOffset = 0, length = source.length) => {
        const src = new Uint32Array(source, 0, length);
        new Uint32Array(memory.buffer, writeOffset << 2).set(src);
    }
}

const WEB_ASSEMBLY_PAGE_SIZE_IN_BYTES = 64 * 1024;