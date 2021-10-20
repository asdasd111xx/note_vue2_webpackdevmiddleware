import { getCookie, setCookie } from "@/lib/cookie";
import {
  lib_useGlobalWithdrawCheck,
  lib_useLocalWithdrawCheck
} from "@/lib/withdrawCheckMethod";
import { mapActions, mapGetters } from "vuex";

import Vue from "vue";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";
import mcenter from "@/api/mcenter";
import openGame from "@/lib/open_game";
import { sendUmeng } from "@/lib/sendUmeng";
import swag from "@/mixins/mcenter/swag/swag";

export default {
  mixins: [swag],
  data() {
    return {
      stopScroll: false,
      isReceive: false,
      isSliding: false,
      isTop: false,
      isShow: false,
      isBottom: false,
      typeStartTouchY: 0,
      startTouchY: 0,
      slideDirection: "",
      wrapHeight: 0,
      allGame: [],
      maintainList: [],
      selectedIndex: 0,
      currentLevel: 0,
      userViplevelId: 0,
      showPromotion: false,
      isLoading: false,
      isCheckWithdraw: false,
      RedEnvelopeTouchType: true,
      showRedirectJump: false,
      mcenterList: [
        { name: "deposit", text: "充值", path: "deposit" },
        { name: "myWallet", text: "钱包", path: "wallet" },
        { name: "withdraw", text: "提现", path: "withdraw" },
        { name: "creditTrans", text: "转让", path: "creditTrans" },
        { name: "grade", text: "等级", path: "accountVip" }
      ],
      mcenterEy1List: [
        { name: "deposit", text: "充值", path: "deposit" },
        { name: "balanceTrans", text: "转帐", path: "balanceTrans" },
        { name: "makemoney", text: "推广", path: "tcenterLobby" },
        { name: "vip", text: "VIP", path: "accountVip" }
      ],
      timer: null,
      isShowPop: false,
      sitePostList: null,
      trialList: []
    };
  },
  watch: {
    isShowPop(val) {
      if (val) {
        document.querySelector("body").style = "overflow: hidden";
      } else {
        document.querySelector("body").style = "";
      }
    },
    isReceive() {
      this.onResize();
    },
    noticeData() {
      if (this.noticeData && this.noticeData.length > 0) {
        let temp = this.noticeData[this.noticeData.length - 1];
        if (temp.event === "vendor_maintain_notice") {
          setTimeout(() => {
            this.getMaintainList();
          }, 7000);

          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.getMaintainList();
            this.timer = null;
            return;
          }, 70000);
        }

        if (temp.event === "outer_maintain" && temp.vendor === "swag") {
          setTimeout(() => {
            this.initSWAGConfig(true);
          }, 1500);

          if (temp.turn === "off" || temp.start_at) {
            this.swagMaintainTimer = null;
            this.swagMaintainTimer = setTimeout(() => {
              this.initSWAGConfig(true);
            }, 70000);
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      rechargeConfig: "getRechargeConfig",
      membalance: "getMemBalance",
      yaboConfig: "getYaboConfig",
      noticeData: "getNoticeData",
      withdrawCheckStatus: "getWithdrawCheckStatus",
      post: "getPost"
    }),
    isAdult() {
      return true;
      // if (localStorage.getItem("content_rating")) {
      //   return localStorage.getItem("content_rating") === "1" ? true : false;
      // } else {
      //   return (
      //     this.memInfo.config.content_rating && this.memInfo.user.content_rating
      //   );
      // }
    },
    typeList() {
      if (this.allGame) {
        let typeList = this.allGame
          .map(game => ({
            category: game.category,
            id: game.id,
            icon: game.iconName.toLowerCase(),
            name: game.name
          }))
          .filter(type => {
            return this.isAdult ? type : type.icon.toLowerCase() !== "welfare";
          });

        return [...typeList, ...typeList, ...typeList];
      }
    },
    options() {
      return {
        slidesPerView: "auto",
        spaceBetween: 4,
        slideClass: this.$style.tag
      };
    },
    allGameList() {
      if (this.maintainList.length > 0) {
        // console.log("存入維護狀態");
        this.allGame.find(data => {
          if (!data.vendors) {
            return;
          }
          data.vendors.find(game => {
            this.maintainList.find(maintainData => {
              if (
                maintainData.vendor === game.vendor &&
                maintainData.kind === game.kind
              ) {
                game.isMaintain = true;
                game.start_at = Vue.moment(maintainData.start_at)
                  .utcOffset(-4)
                  .format("YYYY-MM-DD HH:mm:ss"); //maintainData.start_at;
                game.end_at = Vue.moment(maintainData.end_at)
                  .utcOffset(-4)
                  .format("YYYY-MM-DD HH:mm:ss"); //maintainData.end_at;
                // console.log(game);
              }
            });
          });
        });
      }

      let gameList = this.allGame
        .map(game => game)
        .filter(item => {
          return this.isAdult
            ? item
            : item.iconName.toLowerCase() !== "welfare";
        });

      if (this.siteConfig.ROUTER_TPL === "ey1") {
        let pass = false;

        gameList = gameList.map((item, key) => {
          let _item = item.vendors.map((vendor, index) => {
            if (
              !pass &&
              vendor.imageType === 0 &&
              item.vendors[index + 1] &&
              item.vendors[index + 1].imageType === 0
            ) {
              pass = true;
              return { ...vendor, imageFlag: true };
            } else {
              pass = false;
              return vendor;
            }
          });

          return { ...item, vendors: _item };
        });
      }
      return gameList;
    },
    currentGame() {
      const length = this.typeList.length / 3;
      const index = this.selectedIndex % length;
      return { ...this.allGameList[index] };
    },
    vipLevel() {
      return this.currentLevel <= 10 ? this.currentLevel : "max";
    },
    siteName() {
      return this.siteConfig.SITE_NAME;
    }
  },
  created() {
    sendUmeng(1);
    if (localStorage.getItem("redirect_url")) {
      this.showRedirectJump = true;
    } else {
      localStorage.removeItem("is-open-game");
      localStorage.removeItem("iframe-third-url");
      localStorage.removeItem("enable-swag");

      // 先顯示彈跳公告關閉後再顯示一般公告
      // 顯示過公告 localStorage.getItem('is-shown-announcement')
      // 不在提示 localStorage.getItem('do-not-show-home-post')
      if (this.loginStatus) {
        localStorage.setItem("is-shown-announcement", true);
        axios({
          method: "get",
          url: "/api/v1/c/player/popup-announcement"
        }).then(res => {
          if (res.data) {
            if (res.data.ret && res.data.ret.length > 0) {
              // 顯示彈跳公告
              this.sitePostList = res.data.ret;
              this.isShowPop = true;
            } else {
              // 顯示一般公吿
              this.closePop(true);
            }
          }
        });
      } else {
        // 顯示一般公吿
        // 登入前公告
        this.closePop(true);
      }

      this.showPromotion = this.loginStatus
        ? this.memInfo.user.show_promotion
        : true;
      this.getMaintainList();
      if (
        this.siteConfig.ROUTER_TPL === "porn1" ||
        this.siteConfig.ROUTER_TPL === "sg1" ||
        this.siteConfig.ROUTER_TPL === "aobo1"
      ) {
        // this.initSWAGConfig(true);
        if (this.loginStatus) {
          this.getTaskCheck();
        }
      }
    }
  },
  mounted() {
    window.addEventListener("resize", this.onResize);

    if (this.siteConfig.ROUTER_TPL === "ey1") {
      this.getAllGame();
    } else {
      // 首頁選單列表預設拿local
      const cache = this.getAllGameFromCache();

      const setDefaultSelected = () => {
        setTimeout(() => {
          this.onResize();
          //0616 預設選項為list 第一個
          let defaultType = "";
          let selectIndex = 0;
          if (localStorage.getItem("default-home-menu-type")) {
            defaultType = localStorage.getItem("default-home-menu-type");
            let defaultIndex = this.typeList.findIndex(type => {
              return type.icon.toLowerCase() === defaultType.toLowerCase();
            });

            defaultIndex = defaultIndex >= 0 ? defaultIndex : 0;

            selectIndex = this.typeList.length / 3 + defaultIndex;
          } else {
            selectIndex = this.typeList.length / 3;
          }
          this.onChangeSelectIndex(selectIndex);
          this.isShow = true;
        }, 300);
      };

      if (!cache) {
        const params = [this.getAllGame()];
        Promise.all(params).then(() => {
          this.isReceive = true;
          setDefaultSelected();
        });
      } else {
        this.isReceive = true;
        setDefaultSelected();
        this.getAllGame();
      }
    }

    if (!this.loginStatus) {
      return;
    }

    mcenter.vipUserDetail({
      success: ({ result, ret }) => {
        if (result !== "ok") {
          return;
        }
        this.currentLevel = ret.find(item => item.complex).now_level_seq;

        this.userViplevelId = ret.find(item => item.complex).now_level_id;
        this.getFilterList();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    clearTimeout(this.swagMaintainTimer);
    this.swagMaintainTimer = null;
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetRechargeStatus",
      "actionGetMemInfoV3",
      "actionSetYaboConfig",
      "actionSetShowRedEnvelope",
      "actionSetPost"
    ]),
    getTrialList() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Trial/List`,
        params: {
          kind: 3
        }
      }).then(res => {
        if (res && res.status === "000") {
          localStorage.setItem("trial-game-list", JSON.stringify(res.data));
          this.trialList = res.data;
        }
      });
    },
    // 關閉彈跳公告後是否顯示公告
    closePop(isFromSitePost) {
      this.isShowPop = false;
      this.sitePostList = null;

      if (
        isFromSitePost &&
        localStorage.getItem("do-not-show-home-post") !== "true"
      ) {
        this.actionSetPost("1").then(() => {
          if (this.post && this.post.list && this.post.list.length > 0) {
            this.isShowPop = true;
          }
        });
      }
    },
    getImg(info) {
      const longSizeImag = [1, 5];

      let imageType = info.imageType;
      if (longSizeImag.includes(imageType)) {
        imageType = 1;
      }
      return {
        src: info.image,
        error: this.$getCdnPath(
          `/static/image/${this.siteConfig.ROUTER_TPL}/default/default_${imageType}.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/${this.siteConfig.ROUTER_TPL}/default/default_${imageType}.png`
        )
      };
    },
    // 取得所有遊戲
    getAllGameFromCache() {
      let result = false;
      try {
        let gameList = localStorage.getItem("game-list");
        if (gameList) {
          this.allGame = JSON.parse(localStorage.getItem("game-list"));
          result = true;
        }
      } catch (e) {
        console.log(e);
      }

      return result;
    },
    // 取得所有遊戲
    getAllGame() {
      if (!this.loginStatus) {
        this.getTrialList();
      }

      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Game/list`
      }).then(response => {
        if (!response.data) {
          return;
        }

        this.isReceive = true;
        let data = response.data;
        // SWAG 客製客端判斷開關
        // let welfare = data.find(i => i.category === "Welfare");
        // if (welfare) {
        //   let swag = welfare.vendors.find(i => i.vendor === "SWAG");
        //   const isEnableSWAG =
        //     swag && swag.type && swag.type.toLowerCase() === "thirdparty";
        //   // localStorage.setItem("enable-swag", isEnableSWAG || false);
        // }

        try {
          localStorage.setItem("game-list", JSON.stringify(response.data));
        } catch (e) {
          console.log(e);
        }

        this.allGame = [...response.data];
      });
    },
    onResize() {
      // 計算外框高度
      setTimeout(() => {
        // 跑馬燈 header footer
        let extraHeight = 30 + 43 + 60 + 8;
        let homeSliderHeight =
          document.getElementById("home-slider") &&
          document.getElementById("home-slider").offsetHeight
            ? document.getElementById("home-slider").offsetHeight
            : 120;

        // 上方功能列
        if (this.siteConfig.ROUTER_TPL === "ey1") {
          extraHeight += homeSliderHeight + 72;
        } else {
          extraHeight += homeSliderHeight + 50;
        }
        this.wrapHeight =
          document.body.offsetHeight - extraHeight > 0
            ? document.body.offsetHeight - extraHeight
            : 225;
      }, 300);
    },
    onTypeTouchStart(e) {
      if (this.isSliding) {
        return;
      }

      // 取得touch起始位置
      this.typeStartTouchY = e.touches[0].clientY;
    },
    onTypeTouchMove(e) {
      if (this.isSliding) {
        return;
      }

      const ele = this.$refs["type-wrap"];
      const isGoBottom = this.typeStartTouchY > e.touches[0].clientY;

      if (
        isGoBottom &&
        ele.scrollHeight - 10 <= ele.scrollTop + ele.clientHeight
      ) {
        e.preventDefault();
      }
    },
    onTouchStart(e) {
      if (this.isSliding) {
        return;
      }

      // 取得touch起始位置
      this.startTouchY = e.touches[0].clientY;
    },
    onTouchMove(e) {
      let wrap = this.$refs["game-wrap"];

      if (this.siteConfig.ROUTER_TPL === "ey1") {
        wrap = this.$refs["new-game-wrap"];
      }

      if (this.isSliding) {
        return;
      }

      // 判斷滑動方向
      this.slideDirection =
        this.startTouchY > e.touches[0].clientY ? "down" : "up";
      // 判斷是否置頂
      this.isTop = this.slideDirection === "up" && wrap.scrollTop <= 10;
      // 判斷是否置底
      this.isBottom =
        this.slideDirection === "down" &&
        wrap.scrollHeight - 10 <= wrap.scrollTop + wrap.clientHeight;
      if (this.isTop || this.isBottom) {
        e.preventDefault();
      }
    },
    onTouchEnd() {
      if (this.isSliding) {
        return;
      }

      if (this.slideDirection === "") {
        return;
      }

      if (this.isTop) {
        const index =
          this.selectedIndex <= 0
            ? this.typeList.length - 1
            : this.selectedIndex - 1;
        this.onChangeSelectIndex(index, true);
        return;
      }

      if (this.isBottom) {
        const index =
          this.selectedIndex >= this.typeList.length - 1
            ? 0
            : this.selectedIndex + 1;
        this.onChangeSelectIndex(index);
      }
    },
    // 切換當前分類
    onChangeSelectIndex(index, isSetEnd = false, type) {
      // 億元特立獨行
      if (this.siteConfig.ROUTER_TPL === "ey1") {
        if (type === "anchor") {
          let key = Object.keys(this.newTypeList).find(
            key => this.newTypeList[key].id === +index
          );

          if (key) {
            this.setSlideTypeBar(this.newTypeList[+key]);
            this.$refs[`game-swiper`].$swiper.slideTo(+key + 1);
          }
        }

        return;
      }

      if (index === this.selectedIndex) {
        return;
      }
      let offsetTop = 0;
      if (type === "anchor") {
        let anchor = document.querySelectorAll(`div[data-id="${index}"]`);
        if (anchor && anchor[1]) {
          offsetTop = anchor[1].offsetTop;
        }
        this.selectedIndex = this.typeList.findIndex(i => +i.id === +index);
      } else {
        offsetTop = index * 63;
        this.selectedIndex = index;
      }
      switch (this.typeList[this.selectedIndex].name) {
        case "体育":
          if (this.siteConfig.ROUTER_TPL === "sg1") {
            sendUmeng(15);
          } else {
            sendUmeng(10);
          }
          break;
        case "福利":
          if (this.siteConfig.ROUTER_TPL === "sg1") {
            sendUmeng(10);
          } else {
            sendUmeng(11);
          }
          break;
        case "真人":
          if (this.siteConfig.ROUTER_TPL === "sg1") {
            sendUmeng(16);
          } else {
            sendUmeng(12);
          }
          break;
        case "捕鱼":
          sendUmeng(13);
          break;
        case "牛牛":
          sendUmeng(14);
          break;
        case "电子":
          if (this.siteConfig.ROUTER_TPL === "sg1") {
            sendUmeng(12);
          } else {
            sendUmeng(15);
          }
          break;
        case "棋牌":
          if (this.siteConfig.ROUTER_TPL === "sg1") {
            sendUmeng(11);
          } else {
            sendUmeng(16);
          }
          break;
        case "彩票":
          sendUmeng(17);
          break;
        case "代理":
          sendUmeng(18);
          break;
        default:
          break;
      }

      this.isSliding = true;
      this.isTop = false;
      this.isBottom = false;
      this.typeStartTouchY = 0;
      this.startTouchY = 0;
      this.slideDirection = "";
      this.stopScroll = true;

      $(this.$refs["type-wrap"]).animate({ scrollTop: offsetTop }, 300);
      $(this.$refs["game-wrap"]).animate({ scrollTop: 0 }, 0);

      this.$nextTick(() => {
        this.isSliding = false;
      });

      if (this.typeList[this.selectedIndex]) {
        localStorage.setItem(
          "default-home-menu-type",
          this.typeList[this.selectedIndex].icon
        );
      }

      setTimeout(() => {
        this.stopScroll = false;
        if (isSetEnd) {
          this.$refs["game-wrap"].scrollTop =
            this.$refs["game-wrap"].scrollHeight -
            this.$refs["game-wrap"].clientHeight -
            this.$refs["wrap-buffer"].offsetHeight;
        }
      }, 100);
    },
    // 前往會員中心
    onGoToMcenter(path) {
      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }
      switch (path) {
        case "deposit":
          sendUmeng(5);
          this.$router.push(`/mobile/mcenter/deposit`);
          //   0706 統一RD5判斷銀行卡
          // yaboRequest({
          //   method: 'get',
          //   url: `${
          //     this.siteConfig.YABO_API_DOMAIN
          //     }/AccountBank/GetBankBindingStatus/${getCookie('cid')}`,
          //   headers: {
          //     'x-domain': this.memInfo.user.domain
          //   }
          // }).then(res => {
          //   if (res.data) {
          //     this.$router.push(`/mobile/mcenter/deposit`);
          //   } else {
          //     this.actionSetGlobalMessage({ type: 'bindcard', code: 'C50099' });
          //   }
          // });
          return;

        case "creditTrans":
          sendUmeng(8);
          this.actionGetMemInfoV3().then(() => {
            this.actionGetRechargeStatus("home");
          });
          return;

        case "makemoney":
          this.$router.push("/mobile/mcenter/tcenter/management/member");
          return;

        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/balanceTrans`);
          return;

        // 如之後點擊轉帳時需檢查 withdrawcheck，使用 lib_useLocalWithdrawCheck(path , routerPush)

        case "withdraw":
          sendUmeng(7);
          const routerPush = "/mobile/mcenter/withdraw";

          if (this.siteConfig.ROUTER_TPL === "ey1") {
            lib_useLocalWithdrawCheck("withdraw", routerPush);
            return;
          }

          this.$router.push(routerPush);
          return;

        case "tcenterLobby":
          this.$router.push("/mobile/mcenter/tcenterLobby");
          return;

        case "wallet":
          sendUmeng(6);
          this.$router.push(`/mobile/mcenter/wallet?redirect=home`);
          return;
        case "accountVip":
          sendUmeng(9);
          this.$router.push(`/mobile/mcenter/accountVip`);
          return;
        default:
          this.$router.push(`/mobile/mcenter/${path}`);
          return;
      }
    },
    // 開啟遊戲
    onOpenGame(game) {
      if (localStorage.getItem("is-open-game")) {
        return;
      }

      localStorage.setItem("iframe-third-url-title", game.name);

      if (this.routerTPL === "sg1") {
        switch (game.vendor) {
          //丝瓜直播
          case "sigua_ly":
            sendUmeng(55);
            break;
          // 丝瓜;
          case "LF":
            sendUmeng(56);
            break;
          // 鸭脖视频;
          case "YV":
            sendUmeng(57);
            break;
          // 向日葵;
          case "SF":
            sendUmeng(58);
            break;
          // 小猪视频;
          case "PIG":
            sendUmeng(59);
            break;
          // 丝瓜小说;
          case "DZ":
            sendUmeng(60);
            break;
          // 芭乐;
          case "BALE":
            sendUmeng(61);
            break;
          // 草莓;
          case "STB":
            sendUmeng(62);
            break;
          // SWAG小说;
          case "LQ":
            sendUmeng(63);
            break;
          // 鸭脖影视;
          case "PPV":
            sendUmeng(64);
            break;
        }
      } else {
        switch (game.vendor) {
          //丝瓜直播
          // case "sigua_ly":
          //   sendUmeng(55);
          //   break;
          // 鸭脖视频;
          case "YV":
            sendUmeng(56);
            break;
          // 丝瓜;
          case "LF":
            sendUmeng(57);
            break;
          // 向日葵;
          case "SF":
            sendUmeng(58);
            break;
          // 丝瓜小说;
          case "DZ":
            sendUmeng(59);
            break;
          // 小猪视频;
          case "PIG":
            sendUmeng(60);
            break;
          // 草莓;
          case "STB":
            sendUmeng(61);
            break;
          // 芭乐;
          case "BALE":
            sendUmeng(62);
            break;
          // SWAG小说;
          case "LQ":
            sendUmeng(63);
            break;
          // 鸭脖影视;
          case "PPV":
            sendUmeng(64);
            break;
        }
      }

      switch (game.type) {
        case "strong_activity":
          this.$router.push(`/mobile/activity/all/`);
          return;

        case "thirdparty":
          let userId = "guest";
          if (
            this.memInfo &&
            this.memInfo.user &&
            this.memInfo.user.id &&
            this.memInfo.user.id !== 0
          ) {
            userId = this.memInfo.user.id;
          }
          if (!this.loginStatus) {
            userId = getCookie("guestUserid");
          }
          this.isLoading = true;

          switch (game.vendor) {
            case "SWAG":
              if (!this.loginStatus) {
                this.$router.push("/mobile/joinmember");
                return;
              } else {
                localStorage.setItem("is-open-game", true);
                setTimeout(() => {
                  localStorage.removeItem("is-open-game");
                }, 2000);
                // SWAG入口統一
                this.checkSWAGMaintain({ linkTo: true, origin: "home" });
                return;
              }

            // 鴨脖影視(人人影視) → PPV
            // 美國花花公子 → APB
            // 日本花花公子 → JPB
            // 絲瓜→ LF
            // 芭樂 → BALE
            // 草莓 → STB
            // 向日葵 → SF
            // 屌絲漫畫 → DSC
            // SWAG小說 → LQ
            // 絲瓜小說 → DZ
            default:
              localStorage.setItem("is-open-game", true);
              if (
                game.vendor === "SL" &&
                this.siteConfig.ROUTER_TPL != "ey1" &&
                this.RedEnvelopeTouchType
              ) {
                this.RedEnvelopeTouchType = false;
                goLangApiRequest({
                  method: "get",
                  url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Drawing/GetDrawing`,
                  params: {
                    cid: getCookie("cid")
                  }
                }).then(res => {
                  console.log(res);
                  if (res.status === "000") {
                    if (res.data.status != -1) {
                      this.actionSetShowRedEnvelope(res.data);
                    } else {
                      this.isLoading = true;
                      this.actionSetYaboConfig().then(() => {
                        let noLoginVideoSwitch;

                        if (this.yaboConfig) {
                          noLoginVideoSwitch = this.yaboConfig.find(
                            i => i.name === "NoLoginVideoSwitch"
                          ).value;
                        }

                        // // 第三方開啟有問題時 可調整iframe內嵌
                        // let newWindow = window.open('');
                        // goLangApiRequest({
                        //     method: 'get',
                        //     url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/ThirdParty/${game.vendor}/${this.memInfo.user.id}`,
                        //     headers: {
                        //         'x-domain': this.memInfo.user.domain
                        //     },
                        // }).then(res => {
                        //     if (res.data) {
                        //         newWindow.location.href = res.data;
                        //     } else {
                        //         newWindow.close();
                        //     }
                        // }).catch(error => {
                        //     newWindow.close();
                        // })
                        // return;
                        let cid = !this.loginStatus
                          ? getCookie("guestCid")
                          : getCookie("cid");

                        const getThridUrl = () =>
                          goLangApiRequest({
                            method: "get",
                            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/ThirdParty/${game.vendor}/${userId}`,
                            headers: {
                              cid: cid
                            }
                          }).then(res => {
                            localStorage.removeItem("is-open-game");
                            this.isLoading = false;

                            if (res && res.status !== "000") {
                              if (res.msg) {
                                this.actionSetGlobalMessage({ msg: res.msg });
                              }
                              return;
                            } else {
                              localStorage.setItem(
                                "iframe-third-url",
                                res.data
                              );
                              this.$router.push(
                                `/mobile/iframe/thirdParty?vendor=${game.vendor}`
                              );
                              return;
                            }
                          });

                        // 未登入開關 開啟時未登入可進入
                        if (noLoginVideoSwitch === "true") {
                          getThridUrl();
                          return;
                        }

                        // 未登入開關 未開啟時需登入可進入
                        if (!this.loginStatus) {
                          this.$router.push("/mobile/login");
                          return;
                        } else {
                          getThridUrl();
                        }
                      });
                      return;
                    }
                  }
                });
              } else {
                this.actionSetYaboConfig().then(() => {
                  let noLoginVideoSwitch;

                  if (this.yaboConfig) {
                    noLoginVideoSwitch = this.yaboConfig.find(
                      i => i.name === "NoLoginVideoSwitch"
                    ).value;
                  }

                  // // 第三方開啟有問題時 可調整iframe內嵌
                  // let newWindow = window.open('');
                  // goLangApiRequest({
                  //     method: 'get',
                  //     url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/ThirdParty/${game.vendor}/${this.memInfo.user.id}`,
                  //     headers: {
                  //         'x-domain': this.memInfo.user.domain
                  //     },
                  // }).then(res => {
                  //     if (res.data) {
                  //         newWindow.location.href = res.data;
                  //     } else {
                  //         newWindow.close();
                  //     }
                  // }).catch(error => {
                  //     newWindow.close();
                  // })
                  // return;
                  let cid = !this.loginStatus
                    ? getCookie("guestCid")
                    : getCookie("cid");

                  const getThridUrl = () =>
                    goLangApiRequest({
                      method: "get",
                      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/ThirdParty/${game.vendor}/${userId}`,
                      headers: {
                        cid: cid
                      }
                    }).then(res => {
                      localStorage.removeItem("is-open-game");
                      this.isLoading = false;

                      if (res && res.status !== "000") {
                        if (res.msg) {
                          this.actionSetGlobalMessage({ msg: res.msg });
                        }
                        return;
                      } else {
                        localStorage.setItem("iframe-third-url", res.data);
                        this.$router.push(
                          `/mobile/iframe/thirdParty?vendor=${game.vendor}`
                        );
                        return;
                      }
                    });

                  // 未登入開關 開啟時未登入可進入
                  if (noLoginVideoSwitch === "true") {
                    getThridUrl();
                    return;
                  }

                  // 未登入開關 未開啟時需登入可進入
                  if (!this.loginStatus) {
                    this.$router.push("/mobile/login");
                    return;
                  } else {
                    getThridUrl();
                  }
                });
              }
          }
          return;
        case "link_to":
          switch (game.vendor) {
            case "agent":
              // if (!this.loginStatus) {
              //   if (this.siteConfig.ROUTER_TPL === "ey1") {
              //     this.$router.push("/mobile/login");
              //   } else {
              //     this.$router.push("/mobile/joinmember");
              //   }
              //   return;
              // }
              let newWindow = "";
              newWindow = window.open(`${game.memo}`, "_blank");
              // this.$router.push("/mobile/mcenter/makeMoney");
              return;

            case "YV":
              this.$router.push({
                name: "videoList",
                query: { source: "yabo" }
              });
              return;

            case "PV":
              this.$router.push({
                name: "videoList",
                query: { source: "smallPig" }
              });
              return;

            case "BB":
              this.$router.push({
                name: "videoList",
                query: { source: "gay" }
              });
              return;

            case "GG":
              this.$router.push({
                name: "videoList",
                query: { source: "les" }
              });
              return;

            case "BL":
              this.$router.push("/mobile/liveStream?type=cutiesLive");
              return;

            case "SL":
              this.$router.push("/mobile/liveStream?type=ballLive");
              return;

            case "lg_yb_card":
            case "lg_yb_casino":
              if (!this.loginStatus) {
                this.$router.push("/mobile/login");
                return;
              }

              this.$router.push(`/mobile/hotLobby/${game.vendor}`);
              return;
          }

        case "anchor":
          this.onChangeSelectIndex(game.vendor, false, "anchor");
          return;

        case "U":
          this.actionSetGlobalMessage({ type: "upgrade" });
          return;

        case "T":
          this.actionSetGlobalMessage({ type: "incoming" });
          return;

        // 大廳
        case "game_lobby":
          let hasTrial = this.trialList.find(
            i =>
              i.vendor === game.vendor &&
              +i.kind === +game.kind &&
              i.mobile_trial
          );

          if (!this.loginStatus) {
            if (!hasTrial) {
              this.$router.push("/mobile/login");
              return;
            }
          }
          if ([3, 5, 6].includes(game.kind)) {
            const trans = { 3: "casino", 5: "card", 6: "mahjong" };
            this.$router.push(
              `/mobile/${trans[game.kind]}/${game.vendor}${
                hasTrial ? "?label=trial" : ""
              }`
            );
            return;
          }
          return;
        case "external":
          console.log("外開？");
          let newWindow = "";
          newWindow = window.open(`${game.memo}`, "_blank");
          return;
        // 開啟遊戲
        case "game":
        default:
          switch (game.vendor) {
            case "sigua_ly":
              break;
            default:
              if (!this.loginStatus) {
                let hasTrial = this.trialList.find(
                  i =>
                    i.vendor === game.vendor &&
                    +i.kind === +game.kind &&
                    i.mobile_trial
                );

                if (hasTrial) {
                  break;
                }

                this.$router.push("/mobile/login");
                return;
              }
          }
          this.isLoading = true;

          // 0421 進入遊戲前檢查withdrawcheck(維護時除外)
          if (!game.isMaintain && !this.withdrawCheckStatus.account) {
            lib_useGlobalWithdrawCheck("home");
            return;
          }

          const openGameSuccessFunc = res => {
            this.isLoading = false;
            // BB捕魚切換樣式跑版問題
            if (game.vendor === "bbin" && game.kind === 3) {
              window.GAME_RELOAD = true;
            }
          };

          const openGameFailFunc = res => {
            this.isLoading = false;
            window.GAME_RELOAD = undefined;

            if (res && res.data) {
              let data = res.data;

              if (this.siteConfig.ROUTER_TPL != "ey1") {
                if (data.code === "C50101" || data.code === "C50100") {
                  goLangApiRequest({
                    method: "get",
                    url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Drawing/GetDrawing`,
                    params: {
                      cid: getCookie("cid")
                    }
                  }).then(res => {
                    console.log(res);
                    if (res.status === "000") {
                      if (res.data.status != -1) {
                        this.actionSetShowRedEnvelope(res.data);
                      } else {
                        this.actionSetGlobalMessage({
                          msg: data.msg,
                          code: data.code,
                          origin: "home"
                        });
                      }
                    }
                  });
                } else {
                  this.actionSetGlobalMessage({
                    msg: data.msg,
                    code: data.code,
                    origin: "home"
                  });
                }
              } else {
                this.actionSetGlobalMessage({
                  msg: data.msg,
                  code: data.code,
                  origin: "home"
                });
              }
            }
          };

          openGame(
            {
              kind: game.kind,
              vendor: game.vendor,
              code: game.code,
              gameType: game.type,
              gameName: game.name
            },
            openGameSuccessFunc,
            openGameFailFunc
          );
          return;
      }
    },
    getUserViplevel() {
      let cid = getCookie("cid");
      if (!cid && this.loginStatus) {
        return;
      }
      // yaboRequest({
      //     method: "get",
      //     url: `${
      //         this.siteConfig.YABO_API_DOMAIN
      //         }/player/vipinfo/${cid}`,
      //     headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //     this.userViplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
      // });
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Player/vipinfo`,
        headers: {
          cid: cid
        }
      }).then(res => {
        this.userViplevel = res.data
          ? res.data[0] && res.data[0].now_level_seq
          : 0;
      });
    },

    getMaintainList() {
      if (this.loginStatus) {
        //取維護狀態
        axios({
          method: "get",
          url: "/api/v1/c/vendor/maintains"
        })
          .then(res => {
            if (res.data.result == "ok") {
              localStorage.removeItem("vendorMaintainList");

              // console.log("取維護狀態");
              // console.log(res.data);
              this.maintainList = res.data.ret;
              localStorage.setItem(
                "vendorMaintainList",
                JSON.stringify(this.maintainList)
              );
            }
          })
          .catch(res => {
            // console.log("取維護狀態XXXX");
          });
      }
    },
    getFilterList() {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Games/Vip/Filter`,
        params: {
          vipId: this.userViplevelId
        }
      }).then(response => {
        // console.log(`needFilterGameData is ${response}`);
        localStorage.setItem(
          "needFilterGameData",
          JSON.stringify(response.data)
        );
      });
    },
    getTaskCheck() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Task/GetTaskCheck`,
        headers: {
          cid: getCookie("cid")
        },
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.errorCode === "00" && res.status === "000") {
        }
      });
    },
    closeRedirect_url() {
      if (localStorage.getItem("redirect_url").includes("http")) {
        // window.location.replace(localStorage.getItem("redirect_url"));
        // window.location.replace(window.location.href);
        window.location.href = localStorage.getItem("redirect_url");
        // setTimeout(() => {
        //   window.location.replace(window.location.href);
        // }, 1000);
      } else {
        window.location.href = `https://${localStorage.getItem(
          "redirect_url"
        )}`;
      }

      localStorage.removeItem("redirect_url");
    }
  }
};
