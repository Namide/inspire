module.exports = {
  outputDir: '../public',

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        // pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    }
  },

  pwa: {
    themeColor: '#FF0077',
    msTileColor: '#FFFFFF'
  }
}
