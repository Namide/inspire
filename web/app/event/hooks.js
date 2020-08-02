const Signal = require('./Signal.js')

module.exports = {
  onStart: new Signal(),
  onBeforeStart: new Signal(),
  onAfterStart: new Signal(),

  onConfigureDbBefore: new Signal(),
  onConfigureDbAfter: new Signal(),

  onInitDb: new Signal(),
  onInitDbBefore: new Signal(),
  onInitDbAfter: new Signal()
}
