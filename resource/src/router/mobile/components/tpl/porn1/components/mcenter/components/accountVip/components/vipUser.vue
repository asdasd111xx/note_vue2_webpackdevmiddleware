<template>
  <div :class="$style['user-info-wrap']">
    <!-- 個人資訊 -->
    <div :class="[$style['user-info-block']]">
      <div ref="user-info" :class="$style['user-info']">
        <div :class="$style['avatar']">
          <img :src="avatarSrc" alt="avatar" />
        </div>

        <div
          ref="name"
          :class="[$style['name'], $style[siteConfig.ROUTER_TPL]]"
        >
          <span>{{ memInfo.user.username }}</span>
          <span :style="`display: ${setVipTextDisplay}`">
            {{ userVipInfo.now_level_alias }}
          </span>
        </div>
      </div>

      <div
        :class="$style['user-vip-desc']"
        @click="openPromotion('promotion_vip')"
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
          <span :class="{ [$style['full']]: userVipInfo.percent > 90 }"
            >{{ userVipInfo.percent }}%</span
          >
        </div>
      </div>

      <div
        v-if="userVipInfo.now_level_seq < vipLevelList.length"
        :class="[$style['run-level-alias'], $style['next']]"
      >
        <p>{{ userVipInfo.next_level_alias }}</p>
      </div>
    </div>

    <!-- //說明資訊 -->
    <!-- base_type	有效投注計算方式(1.廳開始日, 2.自訂時間, 3.區間統計) -->
    <div :class="$style['user-desc-block']">
      <div v-if="vipConfig.base_type != 3" :class="$style['desc-text']">
        ●累计充值(元)：
        <span :class="$style['money']">{{
          formatThousandsCurrency(userVipInfo.amount_info.deposit_total)
        }}</span>
        ({{ formatThousandsCurrency(userVipInfo.amount_info.deposit_total) }}/{{
          formatThousandsCurrency(nextLevelDepositTotalData)
        }})
      </div>
      <div v-else :class="$style['desc-text']">
        ●当前充值(元)
        <span :class="$style['money']">{{
          formatThousandsCurrency(userVipInfo.amount_info.deposit_amount)
        }}</span>
        ({{
          formatThousandsCurrency(userVipInfo.amount_info.deposit_amount)
        }}/{{ formatThousandsCurrency(nextLevelDepositLimitData) }})
      </div>
      <div :class="$style['desc-text']">
        {{ vipConfig.base_type != 3 ? "●累计流水(元)：" : "●当前流水(元)：" }}
        <span :class="$style['money']">{{
          formatThousandsCurrency(userVipInfo.amount_info.valid_bet)
        }}</span>
        ({{ formatThousandsCurrency(userVipInfo.amount_info.valid_bet) }}/{{
          formatThousandsCurrency(nextLevelValidBetData)
        }})
      </div>
      <div v-if="vipConfig.base_type != 3" :class="$style['desc-text']">
        ●当前充值(元)：
        <span :class="$style['money']">{{
          formatThousandsCurrency(userVipInfo.amount_info.deposit_amount)
        }}</span>
        ({{
          formatThousandsCurrency(userVipInfo.amount_info.deposit_amount)
        }}/{{ formatThousandsCurrency(nextLevelDepositLimitData) }})
      </div>
      <div :class="$style['desc-text']">
        ●充值次数
        <span :class="$style['money']">{{
          userVipInfo.amount_info.deposit_count
        }}</span>
        ({{ userVipInfo.amount_info.deposit_count }}/{{
          nextLevelDepositTimeData
        }})
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import goLangApiRequest from "@/api/goLangApiRequest";
export default {
  props: {
    vipLevelList: {
      type: Array | null,
      required: true
    },
    userVipInfo: {
      type: Object | null,
      required: true
    },
    vipConfig: {
      type: Array | null,
      required: true
    }
  },
  data() {
    return {
      avatarSrc: "",
      levelIcon: "00",
      setVipTextDisplay: "inline",
      url: ""
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
    routerTPL() {
      //先用ROUTER_TPL判斷aobo
      return this.siteConfig.ROUTER_TPL;
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
              ? this.vipLevelList[this.userVipInfo.now_level_seq]
                  .downgrade_valid_bet
              : ""
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
          ? this.vipLevelList[this.userVipInfo.now_level_seq - 1].deposit_total
          : "";
      }
    },
    nextLevelDepositLimitData() {
      if (this.vipLevelList.length <= 0 || !this.userVipInfo) {
        return;
      }
      if (this.userVipInfo.now_level_seq < this.vipLevelList.length) {
        return this.userVipInfo.next_level_deposit_amount;
      } else {
        return this.vipLevelList[this.userVipInfo.now_level_seq - 1]
          ? this.vipLevelList[this.userVipInfo.now_level_seq - 1].deposit_limit
          : "";
      }
    },
    nextLevelDepositTimeData() {
      if (this.vipLevelList.length <= 0 || !this.userVipInfo) {
        return;
      }
      if (this.userVipInfo.now_level_seq < this.vipLevelList.length) {
        return this.userVipInfo.next_level_deposit_times;
      } else {
        return this.vipLevelList[this.userVipInfo.now_level_seq - 1]
          ? this.vipLevelList[this.userVipInfo.now_level_seq - 1].deposit_time
          : "";
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
          ? this.vipConfig.base_type === 3
            ? this.vipLevelList[this.userVipInfo.now_level_seq - 1]
                .valid_bet_range
            : this.vipLevelList[this.userVipInfo.now_level_seq - 1]
                .valid_bet_limit
          : "";
      }
    },
    vipTitle() {
      return localStorage.getItem("iframe-third-url-title") || "";
    }
  },
  created() {
    this.getTitle();
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
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    },
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
    },
    openPromotion(position) {
      if (position === "promotion_vip") {
        this.openPromotionEmbedded(position);
      }
    },
    openPromotionEmbedded(position) {
      //優小祕內嵌連結
      this.$router.push(`/mobile/iframe/vipInfo?func=false&alias=${position}`);
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
