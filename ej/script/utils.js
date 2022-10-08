/**
 * Funciones miscelaneas de utilidad para manejar estructuras de datos.
 * @module utils.js
 */

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
 * Remueve el primer item de una lista que cumpla con un predicado.
 * @template T
 * @param {T[]} arr
 * @param {function(T): boolean} pred
 * @return {[T[], T]} - Tupla con la lista modificada y el objeto removido o null si ningun item satisface el predicado
 */
function removeFirstWhere(arr, pred) {
    const idx = arr.findIndex(pred);
    if (idx < 0)
        return [arr, null];
    return removeIndex(arr, idx);
}

/**
 * Remueve el item en el indice especificado
 * @template T
 * @param {T[]} arr
 * @param {number} idx - índice a remover. NO se verifica que el índice sea menor a la longitud
 * @return {[T[], T]} - Tupla con la lista modificada y el objeto removido
 */
function removeIndex(arr, idx) {
    return [[arr.slice(0, idx), arr.slice(idx + 1)].flat(), arr[idx]];
}