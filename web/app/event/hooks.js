const Signal = require('./Signal.js')

const hooks = {
  onStart: new Signal('onStart'),
  onBeforeStart: new Signal('onBeforeStart'),
  onAfterStart: new Signal('onAfterStart'),

  onInstallDbBefore: new Signal('onInstallDbBefore'),
  onInstallDbAfter: new Signal('onInstallDbAfter'),

  onInstallAdminBefore: new Signal('onInstallAdminBefore'),
  onInstallAdminAfter: new Signal('onInstallAdminAfter'),

  onInitDb: new Signal('onInitDb'),
  onInitDbBefore: new Signal('onInitDbBefore'),
  onInitDbAfter: new Signal('onInitDbAfter'),

  editUsersDocumentShema: new Signal('editUsersDocumentShema')
}

module.exports = hooks

// setInterval(() => {
//   console.log('debug Signal:')
//   for (var key in hooks) {
//     hooks[key].log()
//   }
// }, 1000)
