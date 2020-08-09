const CONFIG_FILENAME = '../../config.json'

const getConfig = () => {
  if (!checkConfigFile()) {
    initConfigFile()
  }

  return require(CONFIG_FILENAME)
}

const checkConfigFile = () => {
  const fs = require('fs')
  const path = require('path')
  const fileName = path.resolve(__dirname, CONFIG_FILENAME)
  try {
    if (fs.existsSync(fileName)) {
      return true
    }
  } catch (err) {
    return false
  }
}

const initConfigFile = () => {
  const fs = require('fs')
  const path = require('path')
  const fileName = path.resolve(__dirname, CONFIG_FILENAME)
  const generateSecret = () => (Math.random() * 0xFFFFFFFFFFFFFF).toString(16)
  const json = {
    server: {
      port: 80
    },
    cookie: {
      keys: [
        generateSecret(),
        generateSecret()
      ]
    }
  }

  fs.writeFileSync(fileName, JSON.stringify(json, null, 2))
}

const addToConfigFile = (data) => {
  const fs = require('fs')
  const path = require('path')
  const fileName = path.resolve(__dirname, CONFIG_FILENAME)
  const config = getConfig()
  const newConfig = Object.assign(config, data)
  fs.writeFileSync(fileName, JSON.stringify(newConfig, null, 2))

  return newConfig
}

module.exports = {
  getConfig,
  checkConfigFile,
  initConfigFile,
  addToConfigFile
}
