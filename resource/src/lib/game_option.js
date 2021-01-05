import store from "@/store";

// ("EVO视讯");
// ("500万彩票");
// ("丝瓜直播");
// ("PT");
const embedGameVendorList = ["evo", "allwin", "sigua_ly"];

export const getEmbedGameVendor = vendor => {
  if (!vendor) {
    return null;
  }
  const { memInfo } = store.state;
  let is = embedGameVendorList.includes(vendor);

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
