module.exports = {
  lintOnSave: false,
  devServer: {
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://open_coupon.test/',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
