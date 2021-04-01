const main = () => import(/* webpackChunkName: 'main' */ "./main");
let cdnHost = "";
let h;
// nignx F5 DC x-cdn header
function getCDNHost() {
  fetch(`/conf/domain`)
    .then(function(response) {
      console.log(response);
      h = response.headers;
      return response.json();
    })
    .then(function(data) {
      if (data.site === "porn1" && data.domain === "67") {
        cdnHost = h.get(`x-cdn-yb`);
      } else if (
        data.site === "sg1" &&
        (data.domain === "100009" || data.domain === "80")
      ) {
        cdnHost = h.get(`x-cdn-sg`);
      } else if (data.site === "ey1" && data.domain === "41") {
        cdnHost = h.get(`x-cdn-ey`);
      } else {
        cdnHost = "";
      }

      console.log("__webpack_public_path__:", cdnHost);
      window.SCRIPT_CDN_HOST = cdnHost ? `https://${cdnHost}/` : "";
      __webpack_public_path__ = cdnHost ? `https://${cdnHost}/` : "/";
    })
    .catch(function(e) {
      console.log(e);
    })
    .then(main);
}
getCDNHost();
