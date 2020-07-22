module.exports = {
  outputDir: '../server/public',

  devServer: {
    proxy: {
      "/api": {
        target: "http://inspire-server-dev:8082",
        // pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    }
  },

  pwa: {
    themeColor: "#FF0077",
    msTileColor: "#FFFFFF"
  },

  productionSourceMap: false
};
