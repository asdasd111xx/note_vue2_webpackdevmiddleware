<template>
  <div :class="$style['mem-list']">
    <template v-for="listInfo in list">
      <div
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
              $getCdnPath(`/static/image/ey1/mcenter/ic_${listInfo.image}.png`)
            "
          />
        </div>
        <span>{{ $text(listInfo.name, listInfo.initName) }}</span>

        <div v-if="listInfo.info" :class="$style['list-info']">
          {{ listInfo.info }}
        </div>
        <div :class="$style['btn-next']">
          <img
            :src="$getCdnPath(`/static/image/ey1/common/ic_arrow_next.png`)"
          />
        </div>
      </div>
    </template>

    <div :class="$style.list" @click="showShare">
      <div :class="$style['list-icon']">
        <img :src="$getCdnPath(`/static/image/ey1/mcenter/ic_share.png`)" />
      </div>
      <span>{{ $text("S_SHARE_APP", "分享APP") }}</span>

      <div :class="$style['btn-next']">
        <img :src="$getCdnPath(`/static/image/ey1/common/ic_arrow_next.png`)" />
      </div>
    </div>

    <!-- Share Modal -->
    <share v-if="isShowShare" :is-show-share.sync="isShowShare" />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import mcenter from "@/api/mcenter";
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import { API_MCENTER_DESPOSIT_AMOUNT } from "@/config/api";
import mobileLinkOpen from "@/lib/mobile_link_open";
import share from "./share";

export default {
  components: {
    share
  },
  data() {
    return {
      toggleShare: false
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
    isShowPromotion() {
      return this.loginStatus ? this.memInfo.user.show_promotion : true;
    },
    list() {
      return [
        {
          initName: "帮助中心",
          name: "S_HELP_CENTER",
          path: "/mobile/mcenter/help",
          pageName: "help",
          image: "help",
          info: "存提现、投注有疑问，看这里",
          isPart: true,
          show: true
        },
        {
          initName: "关於亿元娱乐",
          name: "S_ABOUT_EY1",
          path: "/mobile/mcenter/about",
          pageName: "about",
          image: "about",
          isPart: false,
          show: true
        },
        {
          initName: "我的推广",
          name: "S_TEAM_CENTER",
          path: "/mobile/mcenter/tcenter/management",
          pageName: "mypromotion",
          image: "mypromotion",
          info: "合营计划",
          isPart: false,
          show: this.isShowPromotion
        }
      ].filter(item => item.show);
    }
  },
  created() { },
  methods: {
    ...mapActions([
      "actionEnterMCenterThirdPartyLink",
      "actionSetGlobalMessage",
      "actionSetUserdata"
    ]),
    mobileLinkOpen,
    onListClick(item) {
      if (item.pageName === "mypromotion") {
        if (!this.loginStatus) {
          this.$router.push("/mobile/login");
          return;
        }
      }

      mcenterPageAuthControl(item.pageName).then(response => {
        if (response && response.status) {
          this.$router.push(item.path);
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
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  transition: all 0.4s;

  > span {
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
    background-color: #7d87a3;

    > span {
      display: block;
      left: 18px;
      position: absolute;
    }
  }
}
.list-info {
  color: #9ca3bf;
  font-size: 12px;
  position: absolute;
  right: 38px;
}

@media screen and (min-width: $phone) {
  .list {
    font-size: 14px;
  }
}

@media screen and (min-width: $pad) {
  .list {
    font-size: 15px;
  }
}
</style>
