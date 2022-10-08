/**
 * @module storage.js
 */

class LSNotFoundException extends Error {
   /**
    * 
    * @param {string} message 
    */
   constructor(message) {
      super(message);
      this.name = "MyNotFoundException";
   }
};

/**
 * @param {string} key
 * @param {string} value
 */
function saveLS(key, value) {
   window.localStorage.setItem(key, value);
}

/**
 * @param {string} key
 * @return {string}
 */
function findLS(key) {
   const item = window.localStorage.getItem(key);
   if (item === null)
      throw new LSNotFoundException(`${key} is not present in localStorage`);
   return item;
}

/**
 * @param {string} key
 */
function removeLS(key) {
   window.localStorage.removeItem(key);
}

/**
 * 
 * @param {string} key 
 * @return  {Object}
 */
function findRec(key) {
   return JSON.parse(findLS(key));
}

/**
 * 
 * @param {string} key 
 * @param {Object} obj 
 */
function saveRec(key, obj) {
   saveLS(key, JSON.stringify(obj));
}

/**
 * 
 * @template T
 * @template U
 * @param {{find: (id: U) => T}} C - Parametro que tiene una función find que toma un parametro id
 * @return {function(U): T}
 */
function restoreFromId(C) {
   return id => C.find(id);
}