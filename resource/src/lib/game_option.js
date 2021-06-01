import store from "@/store";

// ("EVO视讯");
// ("500万彩票");
// ("丝瓜直播");
// ("PT");
const embedGameVendorList = ["evo", "allwin", "sigua_ly","lg_yb_card","lg_yb_casino","jdb" ,"lg_live"];
const checkVersion = function () {
    var agent = window.navigator.userAgent,
    start = agent.indexOf( 'OS' );
    if( ( agent.indexOf('iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1 ){
        return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
    }
    return 0;
}
export const getEmbedGameVendor = vendor => {
  if (!vendor) {
    return null;
  }
  const { memInfo } = store.state;
  let is = embedGameVendorList.includes(vendor);

  let version = checkVersion();
  console.log('IOS VERSION:',version);

  if (!is) {
    return null;
  }

  if (memInfo.vendors) {
    let gameData = memInfo.vendors.find(item => item.vendor === vendor);
    return gameData;
  } else {
    return {};
  }
};
