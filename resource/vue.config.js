module.exports = {
  chainWebpack: config => {
    config.rule("js").include.add(/node_modules\/(dom7|swiper)\/.*/);
  }
};
