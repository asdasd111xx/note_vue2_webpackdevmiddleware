/* eslint-disable */
require("eventsource-polyfill");
var hotClient = require("webpack-hot-middleware/client?reload=true"); //reload=true,排除HMR的改動會reload
// var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true') //noInfo就不顯示[HMR] bundle rebuilding

hotClient.subscribe(function(event) {
  if (event.action === "reload") {
    window.location.reload(); //????
  }
});
