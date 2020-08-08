const Signal = require('./Signal.js')

module.exports = {
  onStart: new Signal('onStart'),
  onBeforeStart: new Signal('onBeforeStart'),
  onAfterStart: new Signal('onAfterStart'),

  onInstallDbBefore: new Signal('onInstallDbBefore'),
  onInstallDbAfter: new Signal('onInstallDbAfter'),

  onInstallAdminBefore: new Signal('onInstallAdminBefore'),
  onInstallAdminAfter: new Signal('onInstallAdminAfter'),

  onInitDb: new Signal('onInitDb'),
  onInitDbBefore: new Signal('onInitDbBefore'),
  onInitDbAfter: new Signal('onInitDbAfter')
}
