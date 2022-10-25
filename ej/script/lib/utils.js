/**
 * Funciones miscelaneas de utilidad para manejar estructuras de datos.
 * @module utils.js
 */

/**
 * Composición de funciones
 * @template A
 * @template B
 * @template C
 * @param {function(B): C} f
 * @param {function(A): B} g
 * @return {function(A): C}
 */
function compose(f, g) {
    return x => f(g(x));
}

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
 * @return {[T[], T | null]} - Tupla con la lista modificada y el objeto removido o null si ningun item satisface el predicado
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

/**
 * Toma elementos mientras se cumpla el predicado. No modifica input
 * @template T
 * @param {T[]} arr
 * @param {function(T): boolean} pred
 * @return {T[]}
 */
function takeWhile(arr, pred) {
    const idx = arr.findIndex(x => !pred(x));
    if (idx < 0)
        return [...arr];
    return take(arr, idx);
}

/**
 * Toma los primeros n items. No modifica el input
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @return {T[]}
 */
function take(arr, n) {
    return [...arr].splice(0, n);
}

/**
 * @template T
 * @template B
 * @param {function(B, T): B} f 
 * @param {T[]} arr 
 * @param {B} base 
 * @return {B}
 */
function foldl(f, arr, base) {
    return arr.reduce(f, base);
}

/**
 * @template T
 * @template B
 * @param {function(B, T): B} f 
 * @param {T[]} arr 
 * @param {B} base 
 * @return {B}
 */
function foldr(f, arr, base) {
    return arr.reduceRight(f, base);
}

/**
 * 
 * @template T
 * @param {T} y 
 * @param {T[]} xs 
 * @return {T[]}
 */
function intersperse(y, xs) {
    return xs.map((x, i) => i === xs.length-1 ? [x] : [x, y]).flat();
}

/**
 * @param {string} s
 * @param {string[]} xs
 */
function intercalateStr(s, xs) {
    return foldl((acc, x) => acc.concat(x), intersperse(s, xs), "");
}

/**
 * 
 * @template T
 * @param {T[]} xs 
 * @param {T[][]} xss
 * @return {T[]}
 */
function intercalate(xs, xss) {
    return intersperse(xs, xss).flat();
}

/**
 * @template T
 * @param {T[]} xs 
 * @return {T[]}
 */
function tail(xs) {
    const [, ...xs_] = xs;
    return xs_;
}

/**
 * Implementación tail-recursive de algoritmo sliding window. Hecha para uso interno en utils.js
 * @template T
 * @param {T[]} xs 
 * @param {number} n 
 * @param {T[][]} acc
 * @return {T[][]}
 */
function _slide_impl(xs, n, acc) {
    if (xs.length === 0)
        return acc;
    acc.push(take(xs, n));
    return _slide_impl(tail(xs), n, acc);
}

/**
 * Algoritmo sliding-window
 * @template T
 * @param {T[]} xs 
 * @param {number} n 
 * @return {T[][]}
 */
function slide(xs, n) {
   return _slide_impl(xs, n, []);
}

/**
 * Algoritmo para partir un array en varios arrays de tamaño n
 * @template T
 * @param {T[]} xs
 * @param {number} n
 * @return {T[][]}
 */
 function chunks(xs, n) {
    const ret = [];
    for (let i = 0; i < xs.length; i += n)
        ret.push(take(xs.slice(i), n));
    return ret;
}