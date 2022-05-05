import gameCategory from "@/config/gameCategory";
export function iframeEvent(_this, data, origin) {
  console.log("[EVENT]:", data.event);
  console.log("[DATA]:", data.data);
  data.from && console.log("[FROM]:", data.from);
  data.option && console.log("[OPTION]:", data.option);
  const option = data.option;

  switch (data.event) {
    //＝＝＝＝＝＝泡泡/遊戲/優小蜜 共用Event＝＝＝＝＝
    case "EVENT_GET_GAME_URL":
    case "EVENT_THIRDPARTY_SWITCH_GAME":
      if (_this.loginStatus) {
        _this.linkToGame(data.data, data.event, true);
      } else {
        _this.actionSetGlobalMessage({
          msg: "请重新登入",
          cb: () => {
            _this.$router.push("/mobile/login");
          }
        });
      }

      return;

    case "EVENT_THIRDPARTY_CLOSE":
      _this.$router.replace(_this.originUrl);
      return;

    // 避免迴圈重複本站
    case "SELF_INTO":
      if (
        _this.$route.params.page.toUpperCase() === "PROMOTION" &&
        !_this.src.includes("popcontrol")
      ) {
        _this.$router.replace("/mobile/login");
        return;
      }
      return;
    case "EVENT_THIRDPARTY_LOGIN":
      if (_this.loginStatus) {
        return;
      } else {
        setCookie("cid", ""); //????
        _this.$router.push("/mobile/login");
      }

      return;

    case "EVENT_THIRDPARTY_JOINMEMBER":
      if (_this.loginStatus) {
        return;
      } else {
        _this.$router.push("/mobile/joinmember?prev=home");
      }

      return;

    case "EVENT_THIRDPARTY_WALLET":
      if (_this.loginStatus) {
        _this.$router.push("/mobile/mcenter/wallet?prev=back");
        return;
      } else {
        _this.$router.push("/mobile/login");
      }

      return;

    case "EVENT_THIRDPARTY_MAIN_DEPOSIT":
      if (_this.loginStatus) {
        _this.$router.push("/mobile/mcenter/deposit?prev=back");
      } else {
        _this.$router.replace("/mobile/login");
      }

      return;

    case "EVENT_THIRDPARTY_HOME":
      _this.$router.push("/mobile");
      return;

    // 彩金任務
    // 去推广
    case "EVENT_BOUNS_PROMOTE":
      const { tagId, cid, userid, domain } = data;
      return;

    // 绑定银行卡
    case "EVENT_THIRDPARTY_BANKCARD":
      localStorage.setItem(
        "bank-card-back-redirect",
        location.pathname + location.search
      );
      _this.$router.push(
        `/mobile/mcenter/bankCard?redirect=${origin}&type=bankCard` //????
      );
      return;

    //======優小蜜專屬Event======
    case "EVENT_OPEN_LINK_INTERNAL":
      switch (option) {
        case "internal":
          switch (option.to) {
            case "home":
              _this.$router.push("/mobile");
              break;
            case "join":
              if (_this.loginStatus) {
                return;
              } else {
                _this.$router.push("/mobile/joinmember?prev=home");
              }
              break;
            case "join-agent":
              break;
            case "mobile-bet":
              break;
            case "ubb":
              break;
            case "cgpay":
              break;
            case "domain":
              break;
            case "deposit":
              break;
            case "withdraw":
              break;
            case "bank-rebate":
              break;
            case "service":
              break;
            case "message":
              break;
            case "binding-card":
              break;
            case "[待確認]":
              break;
            case "promotion":
              break;
            case "message":
              break;
            case "message":
              break;

            default:
              break;
          }
          break;

        case "EVENT_OPEN_LINK_GAME": //iframe/index 是用舊版分割字串的方式開遊戲（泡泡需要傳data.event,old=true）(要把linkToGame搬過來嗎????)
          const kind = gameCategory.find(v => v.vender === option.type).kind;
          const string = option.item
            ? `game-${option.to}-${kind}-${option.item}` //開遊戲
            : `lobby-${option.to}-${kind}`; //開大廳(尚不知如何重現，但憂小蜜有此新增事件)
          if (_this.loginStatus) {
            _this.linkToGame(string, data.event, true);
          } else {
            _this.actionSetGlobalMessage({
              msg: "请重新登入",
              cb: () => {
                _this.$router.push("/mobile/login");
              }
            });
          }
          break;

        default:
          break;
      }
      return;

    default:
      return;
  }
}

// "- 原『去存款、去投注、開啟登入頁面』事件改成此事件

// 內部連結：
// 首頁：internal, home
// 加入會員：internal, join
// 加入代理：internal, join-agent
// 會員登入：internal, login
// 代理登入：internal, agent-login
// 手機下注：internal, mobile-bet
// 寰宇瀏覽器：internal, ubb
// CGPay教程：internal, cgpay
// 備用網址：internal, domain
// 充值：internal, deposit
// 取款：internal, withdraw
// 我的返水：internal, bank-rebate
// 在線客服：internal, service
// 站內信：internal, message
// 綁定銀行卡頁：internal, binding-card
// VIP特權頁：internal, [待確認]
// 優惠大廳：internal, promotion
// 審核進度：internal, promotion, verify
// 自領大廳：internal, promotion, collect"

// "//範例1-BB電子-糖果派對
// {
//     event: 'EVENT_OPEN_LINK_GAME',
//     option: {
//         type: 'casino'
//         to: 'bbin'
//         item: '5902'
//     }
// }
// //範例2-BB電子-大廳
// {
//     event: 'EVENT_OPEN_LINK_GAME',
//     option: {
//         type: 'casino'
//         to: 'bbin'
//         item: ''
//     }
// }"
