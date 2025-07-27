/**
 * storage.js
 *
 * Exports a singleton Storage instance which reads from and
 * writes to localStorage, if it's available, or just pretends to
 * do so if it's not.
 */



/**
 * If window.localStorage is not available, an instance of the
 * CustomStorage class will be used instead. No data will be saved
 * to the user's hard drive, and no errors will occur.
 *
 * @class      CustomStorage (name)
 */
class CustomStorage{
  constructor() {
    this.storage = {}
  }

  // Called by _save() in Storage instance
  setItem(key, value) {
    this.storage[key] = value
  }
}



class Storage{
  constructor() {
    /// <<< HARD-CODED
    this.id = "goldlist"
    /// HARD-CODED >>>

    this.stored = false // let's be pessimistic

    try {
      this.storage = window.localStorage
      this.settings = JSON.parse(this.storage.getItem(this.id))
      // may be null
      this.stored = true // we can be optimistic now

    } catch(error) {
      this.storage = new CustomStorage()
    }

    if (!this.settings || typeof this.settings !== "object") {
      this.settings = {}
    }
  }


  /** Tunnels into this.settings object to place items from map
   *  map:             should be a heirarchical object
   *  checkType and  : only have any effect when they are truthy
   *  rejectInsertion  When rejectInsertion is truthy, items in
   *                   map will not be added if no corresponding
   *                   item exists in this.settings.
   *                   When checkType is truthy, a new item will
   *                   only replace an item of the same type.
   *                   checkType therefore has a similar effect to
   *                   rejectInsertion, although it will allow an
   *                   undefined value to be inserted, thus adding
   *                   a key to this.settings that can be used
   *                   later, even when rejectInsertion is truthy
   * territory:        should initially be undefined. It will be
   *                   populated later by a branch of
   *                   this.settings if this function is called
   *                   recursively.
   */
  placeItems(map, checkType, rejectInsertion, territory) {
    if (typeof map !== "object") { return }

    let saveToStorage = false

    if (!territory) {
      // console.log("before", JSON.stringify(this.settings, null, '  '));

      territory = this.settings
      saveToStorage = true
    }

    const entries = Object.entries(map)
    entries.forEach(([ key, value ]) => {
      const target = territory[key]// value? undefined? object?
      const valueType = typeof value
      const targetType = typeof target
      if (valueType == "object" && targetType == "object") {
        // Tunnel deeper into both objects
        this.placeItems(value, checkType, rejectInsertion,target)
        
      } else if (target === undefined && rejectInsertion) {
        // Don't add a leaf where there is none already
      } else if ((valueType !== targetType) && checkType) {
        // don't replace a value with a different type

      } else {
        // There is an existing entry to replace and types match,
        // or we don't care 
        territory[key] = value
      }
    })

    if (saveToStorage) {
      // console.log("setting", JSON.stringify(map, null, '  '));
      
      // console.log("after", JSON.stringify(this.settings, null, '  '));
      
      this._save()    
    }
  }


  setItem(key, value) {
    this.settings[key] = value
    this._save()
    return this.stored // false for a simulation
  }


  set(settings) {
    Object.assign(this.settings, settings)
    this._save()
    return this.stored // false for a simulation
  }


  getItem(key, defaultValue) {
    if (!this.settings.hasOwnProperty(key)) {
      if (defaultValue !== undefined) {
        this.setItem(key, defaultValue)
      }
    }

    return this.settings[key]
  }


  get() {
    return Object.assign({}, this.settings)
  }


  restore(settings) {
    Object.assign(settings, this.settings)
  }


  _save() {
    const string = JSON.stringify(this.settings)
    this.storage.setItem(this.id, string)
  }
}



export default new Storage()