/**
 * Crea una secuencia desde 0 hasta n-1
 * 
 * @param {number} n 
 * @return {number[]}
 */
function iota(n) {
    return Array(n).fill().map((_, i) => i);
}

/**
 * Obtiene caracter ascii
 * @param {number} n - offset desde el caracter 'A' en ascii
 * @returns 
 */
function intToChar(n) {
    const code = 'A'.charCodeAt(0);
    return String.fromCharCode(code + Math.round(n));
}

/**
 * @template T
 * @param {T[]} arr
 * @param {function(T): boolean} pred
 * @return {[T[], T]}
 */
function removeFirstWhere(arr, pred) {
    const idx = arr.findIndex(pred);
    if (idx < 0)
        return [arr, null];
    return removeIndex(arr, idx);
}

/**
 * @template T
 * @param {T[]} arr
 * @param {number} idx
 * @return {[T[], T]}
 */
function removeIndex(arr, idx) {
    return [[arr.slice(0, idx), arr.slice(idx + 1)].flat(), arr[idx]];
}