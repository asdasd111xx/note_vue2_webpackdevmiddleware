<template>
  <div :class="$style['user-info-wrap']">
    <!-- 個人資訊 -->
    <div :class="$style['user-info-block']">
      <div ref="user-info" :class="$style['user-info']">
        <div :class="$style['avatar']">
          <img :src="avatarSrc" alt="avatar" />
        </div>

        <div ref="name" :class="$style['name']">
          <span>{{ memInfo.user.username }}</span>
          <span :style="`display: ${setVipTextDisplay}`">
            VIP{{ userVipInfo.now_level_seq }}
          </span>
        </div>
      </div>

      <div
        :class="$style['user-vip-desc']"
        @click="$router.push('/mobile/mcenter/accountVIP/detail')"
      >
        <div :class="$style['vip-text']">
          VIP详情
        </div>
        <div :class="$style['vip-level']">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/vip/ic_vip${userVipInfo.now_level_seq}.png`
              )
            "
            alt="vip"
          />
        </div>
      </div>
    </div>

    <!-- 進度條 -->
    <div :class="$style['run-block']">
      <div :class="[$style['run-level'], $style['current']]">
        <p>VIP{{ userVipInfo.now_level_seq }}</p>
      </div>
      <div :class="$style['run-bar']">
        <div :class="$style['run-ok-bar']" :style="{ width: runPercent }">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/vip/vip_run.png`
              )
            "
            :style="
              `right: ${
                userVipInfo.percent > 77 ? userVipInfo.percent - 100 : -23
              }px`
            "
            alt="run"
          />
          <span ::style="`right: ${userVipInfo.percent > 90 ? -10 : -15 }px`"
            >{{ userVipInfo.percent }}%</span
          >
        </div>
      </div>

      <div :class="[$style['run-level'], $style['next']]">
        <p>VIP{{ userVipInfo.next_level_seq }}</p>
      </div>
    </div>

    <!-- 說明資訊 -->
    <div :class="$style['user-desc-block']">
      <div :class="$style['desc-text']">
        ●累计充值(元)：
        <span :class="$style['money']">{{
          userVipInfo.amount_info.deposit_total
        }}</span>
        ({{ userVipInfo.amount_info.deposit_total }}/{{
          userVipInfo.next_level_deposit_total
        }})
      </div>
      <div :class="$style['desc-text']">
        ●当前流水(元)：
        <span :class="$style['money']">{{
          userVipInfo.amount_info.valid_bet
        }}</span>
        ({{ userVipInfo.amount_info.valid_bet }}/{{
          userVipInfo.next_level_valid_bet
        }})
      </div>
      <div :class="$style['desc-text']">
        ●保级投注(元)：
        <span :class="$style['money']">{{
          userVipInfo.amount_info.valid_bet
        }}</span>
        ({{ downgradeData }} , 保级{{ userVipInfo.downgrade_day }}天)
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  props: {
    userVipInfo: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      avatarSrc: "",
      levelIcon: "00",
      setVipTextDisplay: "inline",
      downgradeData: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    runPercent() {
      return this.userVipInfo.percent + "%";
    }
  },
  mounted() {
    this.avatarSrc = `/static/image/${this.siteConfig.MOBILE_WEB_TPL}/mcenter/avatar_nologin.png`;
    this.actionSetUserdata(true).then(() => {
      this.getAvatarSrc();
      this.getDowngradeData();
    });

    this.$nextTick(() => {
      const userInfo = this.$refs["user-info"];
      const name = this.$refs["name"];

      if (name && userInfo) {
        if (name.offsetWidth > userInfo.offsetWidth - (48 + 5)) {
          this.setVipTextDisplay = "block";
        }
      }
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata"]),
    getAvatarSrc() {
      if (!this.loginStatus) return;

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: "get",
          url: this.memInfo.user.custom_image
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.avatarSrc = res.data.ret;
            }
          })
          .catch(error => {
            this.actionSetGlobalMessage({ msg: error.data.msg });
            this.avatarSrc = this.$getCdnPath(
              `/static/image/${this.siteConfig.MOBILE_WEB_TPL}/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
      } else {
        this.avatarSrc = this.$getCdnPath(
          `/static/image/${this.siteConfig.MOBILE_WEB_TPL}/mcenter/default/avatar_${imgSrcIndex}.png`
        );
      }
    },
    getDowngradeData() {
      if (this.userVipInfo.amount_info.valid_bet == this.userVipInfo.downgrade_valid_bet) {
        this.downgradeData = '已达条件'
      } else {
        this.downgradeData = `${this.userVipInfo.amount_info.valid_bet}/${this.userVipInfo.downgrade_valid_bet}`
      }
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/vip/porn1.vipUser.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="@/css/page/vip/ey1.vipUser.scss"
  module="$style_ey1"
></style>
