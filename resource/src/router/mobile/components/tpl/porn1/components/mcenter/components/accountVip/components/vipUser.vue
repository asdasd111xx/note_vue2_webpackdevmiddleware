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
            {{ userVipInfo.now_level_alias }}
          </span>
        </div>
      </div>

      <div
        :class="$style['user-vip-desc']"
        @click="$router.push('/mobile/mcenter/accountVIP/detail')"
      >
        <div :class="$style['vip-text']">VIP详情</div>
        <div :class="$style['vip-level']">
          <img
            :src="
              $getCdnPath(
                `/static/image/common/vip/ic_vip${userVipInfo.now_level_seq}.png`
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
        <p>{{ userVipInfo.now_level_alias }}</p>
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

      <div
        v-if="userVipInfo.now_level_seq < vipLevelList.length"
        :class="[$style['run-level'], $style['next']]"
      >
        <p>{{ userVipInfo.next_level_alias }}</p>
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
          nextLevelDepositTotalData
        }})
      </div>
      <div :class="$style['desc-text']">
        ●当前流水(元)：
        <span :class="$style['money']">{{
          userVipInfo.amount_info.valid_bet
        }}</span>
        ({{ userVipInfo.amount_info.valid_bet }}/{{ nextLevelValidBetData }})
      </div>

      <!-- <template v-if="['porn1', 'sg1'].includes(themeTPL)">
        <div :class="$style['desc-text']">
          ●保级推广(位)：
          <span :class="$style['money']">{{
            userVipInfo.downgrade_members
          }}</span>
          (有效会员充值{{ userVipInfo.downgrade_valid_bet }} , 保级{{
            userVipInfo.downgrade_day
          }}天)
        </div>
      </template> -->

      <template v-if="['ey1'].includes(themeTPL)">
        <div :class="$style['desc-text']">
          ●保级投注(元)：
          <span :class="$style['money']">{{
            userVipInfo.amount_info.valid_bet
          }}</span>
          ({{ downgradeData }} , 保级{{ userVipInfo.downgrade_day }}天)
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  props: {
    vipLevelList: {
      type: Array | null,
      required: true
    },
    userVipInfo: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      avatarSrc: "",
      levelIcon: "00",
      setVipTextDisplay: "inline"
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
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    runPercent() {
      return this.userVipInfo.percent + "%";
    },
    downgradeData() {
      if (this.vipLevelList.length <= 0 || !this.userVipInfo) {
        return;
      }
      if (this.userVipInfo.now_level_seq < this.vipLevelList.length) {
        if (
          Number(this.userVipInfo.amount_info.valid_bet) >=
          Number(
            this.vipLevelList[this.userVipInfo.now_level_seq]
              .downgrade_valid_bet
          )
        ) {
          return "已达条件";
        } else {
          return `${this.userVipInfo.amount_info.valid_bet}/${
            this.vipLevelList[this.userVipInfo.now_level_seq]
              .downgrade_valid_bet
          }`;
        }
      } else {
        return "已达条件";
      }
    },
    nextLevelDepositTotalData() {
      if (this.vipLevelList.length <= 0 || !this.userVipInfo) {
        return;
      }
      if (this.userVipInfo.now_level_seq < this.vipLevelList.length) {
        return this.userVipInfo.next_level_deposit_total;
      } else {
        return this.vipLevelList[this.userVipInfo.now_level_seq - 1]
          .deposit_total;
      }
    },
    nextLevelValidBetData() {
      if (this.vipLevelList.length <= 0 || !this.userVipInfo) {
        return;
      }
      if (this.userVipInfo.now_level_seq < this.vipLevelList.length) {
        return this.userVipInfo.next_level_valid_bet;
      } else {
        return this.vipLevelList[this.userVipInfo.now_level_seq - 1]
          .valid_bet_limit;
      }
    }
  },
  mounted() {
    this.avatarSrc = `/static/image/common/default/avatar_nologin.png`;
    this.actionSetUserdata(true).then(() => {
      this.getAvatarSrc();

      if (this.themeTPL === "ey1") {
        // this.getDowngradeData();
      }
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
              `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
      } else {
        this.avatarSrc = this.$getCdnPath(
          `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
        );
      }
    },
    getDowngradeData() {
      if (
        this.userVipInfo.amount_info.valid_bet ==
        this.userVipInfo.downgrade_valid_bet
      ) {
        this.downgradeData = "已达条件";
      } else {
        this.downgradeData = `${this.userVipInfo.amount_info.valid_bet}/${this.userVipInfo.downgrade_valid_bet}`;
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
<style
  lang="scss"
  src="@/css/page/vip/sg1.vipUser.scss"
  module="$style_sg1"
></style>
