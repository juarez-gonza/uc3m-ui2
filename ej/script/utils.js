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