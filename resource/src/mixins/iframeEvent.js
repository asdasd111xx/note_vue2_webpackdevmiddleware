import mobileLinkOpen from "@/lib/mobile_link_open";

export function iframeEvent(_this, data, origin) {
  console.log("[EVENT]:", data.event);
  data.data && console.log("[DATA]:", data.data);
  data.from && console.log("[FROM]:", data.from);
  data.option && console.log("[OPTION]:", data.option);

  switch (data.event) {
    //=========泡泡/遊戲/優小蜜 共用Event=========
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
        setCookie("cid", "");
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
        `/mobile/mcenter/bankCard?redirect=${origin}&type=bankCard`
      );
      return;
    //===============================

    //=========優小蜜專屬Event=========
    case "EVENT_OPEN_LINK_INTERNAL":
      mobileLinkOpen({
        linkType: "internal",
        linkTo: data.option.to,
        linkItem: { "zh-cn": data.option.item },
        eventRedirect: "promotion"
      });
      return;

    case "EVENT_OPEN_LINK_GAME":
      mobileLinkOpen({
        linkType: data.option.type,
        linkTo: data.option.to,
        linkItem: { "zh-cn": data.option.item },
        site: _this.siteConfig.ROUTER_TPL,
        eventRedirect: "promotion"
      });
      return;
    //===============================

    default:
      return;
  }
}
