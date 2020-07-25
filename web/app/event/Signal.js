class Signal {
  constructor() {
    this._list = []
    this._onceList = []
  }

  add(...callbacks) {
    this._list.push(...callbacks)
  }

  addOnce(...callbacks) {
    this._onceList.push(...callbacks)
  }

  remove(...callbacks) {
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

  removeAll() {
    this._list = []
    this._onceList = []
  }

  dispatch(...data) {
    const all = [...this._list, ...this._onceList]
    this._onceList = []
    return Promise.all(all.map(callback => callback(...data)))
  }
}

module.exports = Signal
