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
}

/**
 * @param {string} key
 * @param {string} value
 */
function save(key, value) {
   window.localStorage.setItem(key, value);
}

/**
 * @param {string} key
 * @return {string}
 */
function find(key) {
   const item = window.localStorage.getItem(key);
   if (item === null)
      throw new LSNotFoundException(`${key} is not present in localStorage`);
   return item;
}

class Rec {
   /** @type {string} */
   _id;

   /**
    * 
    * @param {string} _id 
    */
   constructor(_id) {
      this._id = _id;
   }

   saveRec() {
      save(this._id, JSON.stringify({...this}));
   }

   /**
    * @param {string} key
    */
   static findRec(key) {
      return JSON.parse(find(key));
   }
};
