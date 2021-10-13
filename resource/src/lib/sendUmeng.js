export const sendUmeng = eventCode => {
  if (!localStorage.getItem("YMKey")) return;
  console.log(`YM Code ` + eventCode);
  let category = "";
  let action = "";
  let label = "";

  if (eventCode < 24) {
    category = "首页";
  }
  switch (eventCode) {
    case 1:
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
