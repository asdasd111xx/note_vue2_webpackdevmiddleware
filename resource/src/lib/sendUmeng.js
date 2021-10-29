export const sendUmeng = eventCode => {
  if (!localStorage.getItem("YMKey")) return;
  // console.log(`YM Code ` + eventCode);
  let category = "";
  let action = "";
  let label = "";

  if (eventCode < 24) {
    category = "首页";
  } else if (eventCode > 23 && eventCode < 37) {
    category = "首页_我的";
  } else if (eventCode > 36 && eventCode < 45) {
    category = "首页_我的_我的钱包";
  } else if (eventCode === 45 || eventCode === 46) {
    category = "首页-我的-交易记录";
  } else if (eventCode > 46 && eventCode < 52) {
    category = "首页_充值";
  } else if (eventCode > 51 && eventCode < 55) {
    category = "首页_下方Tab区_优惠";
  } else if (eventCode > 54) {
    category = "游戏导览列_福利";
  }
  switch (eventCode) {
    case 1:
    case 24:
    case 37:
    case 45:
    case 47:
    case 52:
      action = "进入";
      break;
    default:
      action = "点击";
  }
  // switch (eventCode) {
  //   case 2:
  //     label = "访客彩金";
  //     break;
  //   case 3:
  //     label = "登录";
  //     break;
  //   case 4:
  //     label = "跑马灯";
  //     break;
  //   case 5:
  //     label = "充值";
  //     break;
  //   case 6:
  //     label = "转帐";
  //     break;
  //   case 7:
  //     label = "提现";
  //     break;
  //   case 8:
  //     label = "转让";
  //     break;
  //   case 9:
  //     label = "等级";
  //     break;
  //   case 10:
  //     label = "游戏导览列_体育";
  //     break;
  //   case 11:
  //     label = "游戏导览列_福利";
  //     break;
  //   case 12:
  //     label = "游戏导览列_真人";
  //     break;
  //   case 13:
  //     label = "游戏导览列_捕鱼";
  //     break;
  //   case 14:
  //     label = "游戏导览列_牛牛";
  //     break;
  //   case 15:
  //     label = "游戏导览列_电子";
  //     break;
  //   case 16:
  //     label = "游戏导览列_棋牌";
  //     break;
  //   case 17:
  //     label = "游戏导览列_彩票";
  //     break;
  //   case 18:
  //     label = "游戏导览列_代理";
  //     break;
  //   case 19:
  //     label = "下方Tab区_首页";
  //     break;
  //   case 20:
  //     label = "下方Tab区_优惠";
  //     break;
  //   case 21:
  //     label = "下方Tab区_客服";
  //     break;
  //   case 22:
  //     label = "下方Tab区_联盟";
  //     break;
  //   case 23:
  //     label = "下方Tab区_我的";
  //     break;
  //   default:
  //     label = "";
  //     break;
  // }
  const { aplus_queue } = window;

  aplus_queue.push({
    action: "aplus.record",
    arguments: [
      eventCode.toString(),
      "CLK",
      { category: category, action: action, label: label }
    ]
  });
};
