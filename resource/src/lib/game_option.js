import store from "@/store";

const embedGamesList = [
  {
    vendor: "evo",
    kind: ""
  },
  {
    vendor: "allwin",
    kind: 4
  },
  {
    vendor: "sigua_ly",
    kind: 4
  },
  {
    vendor: "lg_yb_card",
    kind: 5
  },
  {
    vendor: "lg_yb_casino",
    kind: 3
  },
  {
    vendor: "jdb",
    kind: 3
  },
  {
    vendor: "lg_live",
    kind: 2
  },
  {
    vendor: "lg_card",
    kind: 5
  },
  {
    vendor: "bc",
    kind: 2
  },
  {
    vendor: "bbp",
    kind: 3
  }
  // {
  //   vendor: "hb",
  //   kind: 3
  // },
  // {
  //   vendor: "bbin",
  //   kind: 3
  // }
];

const checkVersion = function() {
  var agent = window.navigator.userAgent,
    start = agent.indexOf("OS");
  if (
    (agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1) &&
    start > -1
  ) {
    return window.Number(agent.substr(start + 3, 3).replace("_", "."));
  }
  return 0;
};

export const getEmbedGameVendor = (vendor, kind = 0) => {
  console.log(vendor, kind);
  if (!vendor) {
    return null;
  }

  const { memInfo } = store.state;
  let is = false;

  if (kind) {
    is = embedGamesList.find(i => i.vendor === vendor && +i.kind === +kind);
  } else {
    is = embedGamesList.find(i => i.vendor === vendor);
  }

  let version = checkVersion();
  console.log("IOS VERSION:", version);

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
