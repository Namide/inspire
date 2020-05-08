module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.99.100:8100',
        pathRewrite: { '^/api': '' },
        changeOrigin: false
      }
    }
  },

  pwa: {
    themeColor: '#FF0077',
    msTileColor: '#FFFFFF'
  }
}
