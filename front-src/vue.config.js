module.exports = {
  outputDir: "../web/public",

  devServer: {
    proxy: {
      "/api": {
        target: "http://inspire-server-dev:80", // Docker proxy
        // target: "http://localhost:80", // Local proxy
        changeOrigin: true,
        secure: false,
      },
    },
  },

  pwa: {
    themeColor: "#FF0077",
    msTileColor: "#FFFFFF",
  },

  productionSourceMap: false,
};
