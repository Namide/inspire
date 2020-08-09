class Signal {
  constructor (name = 'signal') {
    this.name = name
    this._list = []
    this._onceList = []
  }

  add (...callbacks) {
    this._list.push(...callbacks)
  }

  addOnce (...callbacks) {
    this._onceList.push(...callbacks)
  }

  remove (...callbacks) {
    callbacks.forEach(callback => {
      const i = this._list.indexOf(callback)
      if (i > -1) {
        this._list.splice(i, 1)
      }
    })
    callbacks.forEach(callback => {
      const i = this._onceList.indexOf(callback)
      if (i > -1) {
        this._onceList.splice(i, 1)
      }
    })
  }

  removeAll () {
    this._list = []
    this._onceList = []
  }

  async dispatch (...data) {
    console.log(this.name, 'dispatch')
    const all = [...this._list, ...this._onceList]
    this._onceList = []
    return Promise.all(all.map(callback => callback(...data)))
  }

  log () {
    if (this._list.length || this._onceList.length) {
      console.log('Signal', this.name)
      if (this._list.length) {
        console.log('  - repeat', this._list.length)
      }
      if (this._onceList.length) {
        console.log('  - once  ', this._onceList.length)
      }
    }
  }
}

module.exports = Signal
