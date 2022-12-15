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
      this.name = "LSNotFoundException";
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
 * @param {RegExp} pattern 
 */
function getWithPattern(pattern) {
   const ret = [];
   const lS = window.localStorage;
   for (const key in lS) {
      if (!lS.hasOwnProperty(key))
         continue;

      const item  = JSON.parse(lS.getItem(key));
      if (pattern.test(item._id))
         ret.push(item);
   }
   return ret;
}