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
}

module.exports = Signal
