<template>
  <div :class="$style['mem-list']">
    <template v-for="listInfo in list">
      <div
        v-if="listInfo.pageName !== 'super' || isShowSuper"
        :key="`list-${listInfo.pageName}`"
        :class="[
          $style.list,
          { [$style['list-part']]: listInfo.isPart },
          { [$style['list-border-bottom']]: !listInfo.isPart }
        ]"
        @click="onListClick(listInfo)"
      >
        <div :class="$style['list-icon']">
          <img
            :src="
              $getCdnPath(`/static/image/sg1/mcenter/ic_${listInfo.image}.png`)
            "
          />
        </div>
        <span>{{ $text(listInfo.name, listInfo.initName) }}</span>

        <div v-if="listInfo.info" :class="$style['list-info']">
          {{ listInfo.info }}
        </div>
        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
        </div>
      </div>
    </template>

    <div
      v-if="memInfo.config.content_rating"
      :class="[$style['list'], $style['list-part']]"
    >
      <div :class="$style['list-icon']">
        <img :src="$getCdnPath(`/static/image/sg1/mcenter/ic_18+.png`)" />
      </div>
      <span>{{ $text("S_PORN_SWITCH", "色站开关") }}</span>
      <label
        :class="[$style['switch'], { [$style.active]: pornSwitchState }]"
        @click="toggleSwitch"
      >
        <span />
      </label>
    </div>
    <!-- Share Modal -->
    <share v-if="isShowShare" :is-show-share.sync="isShowShare" />
    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import { getCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import bbosRequest from "@/api/bbosRequest";
import common from "@/api/common";
import goLangApiRequest from "@/api/goLangApiRequest";
import mcenter from "@/api/mcenter";
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import share from "./share";
import Vue from "vue";
import yaboRequest from "@/api/yaboRequest";

export default {
  components: {
    share,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  data() {
    return {
      isReceive: false,
      isShowPromotion: localStorage.getItem("is-show-promotion")
        ? localStorage.getItem("is-show-promotion") === "true"
        : true,
      isShowSuper: false, // *顯示超級簽開關
      pornSwitchState: false,
      requiredMoney: "load",
      superAppUrl: "", // 超級簽URL
      superErrorMsg: "", // 超級簽錯誤訊息
      toggleShare: false,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    isShowShare: {
      get() {
        return this.toggleShare;
      },
      set(value) {
        this.toggleShare = value;
      }
    },
    list() {
      return [
        {
          initName: "下载超级签，成为超级会员",
          name: "S_VIP_APP",
          path: "",
          pageName: "super",
          image: "vip",
          isPart: true,
          show: true
        },
        {
          initName: "帮助中心",
          name: "S_HELP_CENTER",
          path: "/mobile/mcenter/helpCenter",
          pageName: "help",
          image: "help",
          info: "存提现、投注有疑问，看这里",
          isPart: true,
          show: true
        },
        {
          initName: "关於丝瓜直播",
          name: "S_ABOUT_SGLIVE",
          path: "/mobile/mcenter/about",
          pageName: "about",
          image: "about",
          isPart: false,
          show: true
        },
        {
          initName: "我的推广",
          name: "S_TEAM_CENTER",
          path: "/mobile/mcenter/tcenter/management/member",
          pageName: "mypromotion",
          image: "mypromotion",
          info: "合营计划",
          isPart: false,
          show: this.isShowPromotion
        },
        {
          initName: "打码王",
          name: "S_LEADERBOARD",
          path: "",
          pageName: "leaderboard",
          image: "leaderboard",
          info: "",
          isPart: false,
          show: true
        },
        {
          initName: "分享APP",
          name: "S_SHARE_APP",
          path: "",
          pageName: "share",
          image: "share",
          info: "",
          isPart: false,
          show: true
        }
      ].filter(item => item.show);
    }
  },
  created() {
    if (localStorage.getItem("content_rating")) {
      this.pornSwitchState =
        localStorage.getItem("content_rating") === "1" ? true : false;
    } else {
      this.pornSwitchState =
        this.memInfo.config.content_rating && this.memInfo.user.content_rating;
    }

    let type = "ccf";

    yaboRequest({
      method: "get",
      url: `${this.siteConfig.YABO_API_DOMAIN}/System/config`,
      params: {
        type: type
      }
    }).then(res => {
      if (res && res.data) {
        this.isShowSuper =
          res.data.find(i => i.name === "VipDownload").value === "true";
      }
    });

    if (this.loginStatus) {
      this.isShowPromotion =
        localStorage.getItem("is-show-promotion") === "true";
      this.actionSetUserdata(true).then(() => {
        this.isShowPromotion = this.memInfo.user.show_promotion;
        localStorage.setItem(
          "is-show-promotion",
          this.memInfo.user.show_promotion
        );
      });
    } else {
      this.isShowPromotion = true;
      return;
    }

    // 超級籤需滿足的最低金額
    const requiredMoney = 200;

    // 會員存款狀態
    axios({
      method: "get",
      url: "/api/v1/c/user-stat/deposit-withdraw"
    })
      .then(res => {
        if (res && res.data && res.data.ret.deposit_total) {
          const depositTotal = Number(res.data.ret.deposit_total);
          //   超級簽需求200充值
          if (depositTotal >= requiredMoney) {
            this.requiredMoneyStatus = "ok";
            return;
          } else {
            this.superErrorMsg = this.$text(
              "S_VIP_ONLY_DOWNLOAD",
              "充值超过％s即可下载"
            ).replace("％s", requiredMoney);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

    setTimeout(() => {
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/App/Download",
        reqHeaders: {
          Vendor: 67
        },
        params: {
          lang: "zh-cn",
          bundleID: "chungyo.foxyporn.prod.enterprise.vip",
          platform: 1
        }
      }).then(res => {
        this.superAppUrl = res.data.url;
      });
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
    onListClick(item) {
      if (item.pageName === "super") {
        if (!this.loginStatus) {
          this.$router.push("/mobile/login");
          return;
        }

        if (this.requiredMoneyStatus === "ok") {
          // 超級籤app下載網址
          const appUrl =
            this.superAppUrl || "https://user.51cjq.xyz/pkgs/ybsp2.app";
          window.open(appUrl, "_blank");
        } else {
          this.actionSetGlobalMessage({ msg: this.superErrorMsg });
        }

        return;
      }

      if (item.pageName === "mypromotion") {
        if (!this.loginStatus) {
          this.$router.push("/mobile/login");
          return;
        }
      }

      if (item.pageName === "leaderboard") {
        let w = window.open("", "_blank");
        this.isLoading = true;
        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
          params: {
            urlName: "ad_promotion",
            lang: "zh-cn",
            needToken: "true",
            externalCode: "promotion"
          }
        }).then(res => {
          this.isLoading = false;

          if (res && res.data && res.data.uri) {
            w.location.href = res.data.uri + "&v=m";
            return;
          }
          w.close();
          if (res && res.msg) {
            this.actionSetGlobalMessage({ msg: res.msg });
          }
        });
        return;
      }

      if (item.pageName === "share") {
        this.showShare();
        return;
      }

      mcenterPageAuthControl(item.pageName).then(response => {
        if (response && response.status) {
          this.$router.push(item.path);
        }
      });
    },

    /**
     * 色站開關 狀態切換
     * @function toggleSwitch
     * @param {string} e - input argument
     */
    toggleSwitch() {
      if (!this.loginStatus) {
        this.$router.push("/mobile/joinmember");
        return;
      }
      if (!this.memInfo.config.content_rating) {
        return;
      }

      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      mcenter.accountDataSet({
        params: {
          content_rating: +!this.pornSwitchState
        },
        success: () => {
          localStorage.setItem("content_rating", +!this.pornSwitchState);
          if (+!this.pornSwitchState) {
            localStorage.setItem("home-menu-type", "welfare");
          } else {
            localStorage.setItem("home-menu-type", "");
          }
          this.memInfo.user.content_rating = +!this.pornSwitchState;
          this.pornSwitchState = !this.pornSwitchState;
          this.isReceive = false;
        }
      });
    },
    showShare() {
      this.isShowShare = true;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.mem-list {
  background-color: $main_background_white1;
}

.list-part {
  margin: 10px 0;
}

.list-border-bottom {
  border-bottom: 1px solid #eee;
}

.list {
  position: relative;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  background-color: $main_white_color1;
  color: $main_text_color3;

  > span {
    width: 100%;
    padding: 0 5px;
  }

  .btn-next {
    width: 14px;
    height: 100%;
    display: flex;
    align-items: center;
    > img {
      height: 14px;
      width: 14px;
    }
  }

  .list-icon {
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    margin-right: 5px;

    > img {
      height: 100%;
    }
  }
}

.arrow {
  position: absolute;
  top: 8px;
  right: 14px;
  width: 24px;
  height: 24px;

  &.is-active {
    display: none;
  }
}

.switch {
  position: relative;
  display: block;
  width: 60px;
  height: 28px;
  border-radius: 18px;
  background-color: #ccc;
  transition: all 0.4s;

  > span {
    margin: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    transition: all 0.4s;
    display: block;
    left: 0;
    position: absolute;
  }

  &.active {
    background-color: #e61938;

    > span {
      margin: 2px;
      display: block;
      left: 18px;
      position: absolute;
    }
  }
}
.list-info {
  color: #a2a2a2;
  font-size: 12px;
  position: absolute;
  right: 38px;
}
</style>
