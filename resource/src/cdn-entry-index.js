const main = () => import(/* webpackChunkName: 'main' */ './main');
let cdnHost = '';
function getCDNHost() {
  fetch(`/conf/domain`)
    .then(function(response) {
      console.log(response.headers.get('x-cdn-sg'));
      cdnHost = response.headers.get('x-cdn-sg');

      return response.json();
    })
    .then(function(data) {
      console.log(data);
      __webpack_public_path__ = `/${cdnHost}/`;
    })
    .catch(function(e) {
      console.log(e);
    })
    .then(main);
}
getCDNHost();
