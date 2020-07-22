module.exports = {
  outputDir: '../web/public',

  devServer: {
    proxy: {
      "/api": {
        target: "http://inspire-server-dev:3000",
        // pathRewrite: { '^/api': '' },
        // changeOrigin: true,
        secure: false
      }
    }
  },

  pwa: {
    themeColor: "#FF0077",
    msTileColor: "#FFFFFF"
  },

  productionSourceMap: false
};
