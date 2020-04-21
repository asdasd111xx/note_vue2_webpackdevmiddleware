<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['my-wallet-wrap']">
      <div :class="$style['wallet-info-wrap']">
        <div>总金额(元)</div>

        <div :class="$style['money-block']">
          <span :class="$style['money']">141.94</span>
          <div
            :class="$style['goDeposit']"
            @click="$router.push('/mobile/mcenter/deposit')"
          >
            去充值
          </div>
        </div>

        <div :class="$style['icon-block']">
          <div
            :class="$style['icon-cell']"
            v-for="(item, index) in walletIcons"
            :key="'icon-' + index"
            @click="item.onClick"
          >
            <div :class="$style['image']">
              <img :src="$getCdnPath(item.imgSrc)" alt="icon" />
            </div>
            {{ item.text }}
          </div>
        </div>

        <div :class="$style['wallet-desc-block']">
          <div>钱包明细</div>
          <div @click="toggleTrans">点击查看全部场馆余额</div>
        </div>
      </div>
      <!--
            <balance-tran v-if="isShowTrans" class="clearfix">
                <template scope="{ balanceTran , balanceBack}">
                    <div>
                        <div
                            :class="[$style['balance-wrap'], 'clearfix']"
                            @click="balanceBack()"
                        >
                            <div :class="$style['balance-total-item']">
                                <img
                                    :src="
                                        $getCdnPath(
                                            '/static/image/_new/mcenter/balanceTrans/ic_wallet_center.png'
                                        )
                                    "
                                />
                                {{ $text("S_MCENTER_WALLET", "中心钱包") }}
                                <div :class="$style['balance-item-money']">
                                    {{
                                        balanceTran.membalance.vendor.default
                                            .amount
                                    }}
                                </div>
                            </div>

                            <div
                                :class="[
                                    $style['recycle-btn'],
                                    balanceTran.balanceBackLock
                                        ? $style.disable
                                        : ''
                                ]"
                            >
                                {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
                            </div>
                        </div>

                        <div :class="[$style['balance-item-wrap'], 'clearfix']">
                            <div
                                v-for="(item,
                                key,
                                index) in balanceTran.balanceInfo"
                                :key="`balance-item-${key}`"
                                :class="[
                                    $style['balance-item'],
                                    {
                                        [$style['is-last-item']]:
                                            Object.keys(balanceTran.balanceInfo)
                                                .length -
                                                index <=
                                            (Object.keys(
                                                balanceTran.balanceInfo
                                            ).length % 4 || 4)
                                    }
                                ]"
                            >
                                <span :class="$style['balance-item-vendor']">{{
                                    item.text
                                }}</span>
                                <span
                                    v-if="item.maintain"
                                    :class="$style['balance-info-maintain']"
                                    @click="onClickMaintain(item.maintain)"
                                >
                                    {{ $t("S_MAINTAIN") }}
                                    <img
                                        :src="
                                            $getCdnPath(
                                                '/static/image/_new/mcenter/balanceTrans/icon_transfer_tips_info.png'
                                            )
                                        "
                                        :class="$style['balance-wrench']"
                                    />
                                </span>
                                <span
                                    v-else
                                    :class="$style['balance-item-money']"
                                    >{{ item.amount }}</span
                                >
                            </div>
                        </div>
                    </div>
                </template>
            </balance-tran> -->

      <div :class="$style['invite-wrap']">
        <div :class="$style['content']">
          <div>邀请好友获得现金奖励</div>
          <div>邀请人首存即可获得</div>
        </div>

        <div :class="$style['image']">
          <img
            :src="
              $getCdnPath('/static/image/_new/mcenter/wallet/img_wallter.png')
            "
            alt="wallter"
          />
        </div>
      </div>

      <message v-if="msg" @close="msg = ''">
        <div slot="msg">
          <div
            v-html="msg"
            style="background-color: transparent ; margin: 0 ; padding: 0"
          ></div>
        </div>
      </message>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import member from "@/api/member";
import balanceTran from "@/components/mcenter/components/balanceTran";
import mobileContainer from "../../../common/new/mobileContainer";
import message from "../../../common/new/message";

export default {
  components: {
    balanceTran,
    mobileContainer,
    message
  },
  data() {
    return {
      msg: "",
      isShowTrans: false,
      walletIcons: [
        {
          text: "转帐",
          imgSrc:
            "/static/image/_new/mcenter/wallet/ic_wallter_tranfer.png",
          onClick: () => {
            this.$router.push("/mobile/mcenter/balanceTrans");
          }
        },
        {
          text: "取款",
          imgSrc:
            "/static/image/_new/mcenter/wallet/ic_wallter_withdraw.png",
          onClick: () => {
            this.$router.push("/mobile/mcenter/withdraw");
          }
        },
        {
          text: "卡片管理",
          imgSrc:
            "/static/image/_new/mcenter/wallet/ic_wallter_manage.png",
          onClick: () => {
            this.$router.push("/mobile/mcenter/bankCard");
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_WALLET2", "钱包")
      };
    }
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/home");
    }
  },
  methods: {
    handleClick(path) {
      this.$router.push(path);
    },
    toggleTrans() {
      this.isShowTrans = !this.isShowTrans;
    },
    onClickMaintain(value) {
      this.msg = `美东时间：
          <br>
          ${value.etc_start_at}
          <p style="text-align: center">|</p>
          ${value.etc_end_at}
        `;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  background-color: $main_background_white1;
}

.my-wallet-wrap {
  padding: 0 17px;
  padding-bottom: 45px;
}

.wallet-info-wrap {
  background: $main_white_color1;
  color: $main_text_color3;
  font-size: 12px;
  margin-top: 12px;
  padding: 12px 17px 0;
  font-weight: 400;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

  .money-block {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .money {
      margin-left: 2px;
      font-size: 22px;
      font-weight: 700;

      &::before {
        content: "¥";
        position: relative;
        margin-right: 2px;
        font-size: 14px;
        font-weight: 400;
        vertical-align: top;
      }
    }

    .goDeposit {
      width: 72px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: linear-gradient(to right, #99a3c1, #636f93);
      color: $main_white_color1;
      border-radius: 15px;
      box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3);
    }
  }

  .icon-block {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 40px;

    .icon-cell {
      text-align: center;

      .image {
        width: 35px;
        height: 35px;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .wallet-desc-block {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 23px 0 11px;
    color: #414655;

    div:last-of-type {
      position: relative;
      font-size: 10px;
      color: $main_text_color2;
      padding-right: 24px;
      height: 15px;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
        background: url("/static/image/_new/mcenter/wallet/ic_wallter_details_expand.png")
          center center / 100% 100%;
      }
    }
  }
}

.balance-total-item {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: $main_text_color3;

  img {
    width: 13px;
    height: 13px;
    vertical-align: text-bottom;
  }

  .balance-item-money {
    font-size: 16px;
    color: #be9e7f;
  }
}

.balance-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 3%;
  height: 65px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);

  // 自動免轉區塊
  &:nth-child(2) {
    height: 48px;
  }

  .balance-total-item {
    flex: 1;
    font-size: 12px;
    font-weight: 700;
    color: $main_text_color3;

    img {
      width: 13px;
      height: 13px;
      vertical-align: text-bottom;
    }

    .balance-item-money {
      font-size: 16px;
      color: #be9e7f;
    }
  }

  .recycle-btn {
    position: relative;
    flex: 1;
    font-size: 16px;
    color: #be9e7f;
    font-weight: 700;

    &::before {
      content: "";
      position: absolute;
      width: 1px;
      height: 20px;
      background: #eee;
      left: 0;
      top: 0;
    }

    &.disable {
      opacity: 0.5;
    }
  }

  .balance-total-icon {
    width: 30px;
    height: 30px;

    img {
      max-width: 100%;
    }
  }
}

.balance-item-wrap {
  font-size: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);

  .balance-item {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 25%;
    height: 65px;
    padding: 10px 4px 15px;
    text-align: center;
    font-size: 14px;
    color: $main_text_color3;
    border-bottom: 1px solid #dad6d6;

    &:not(:nth-child(4n + 1)):before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 23px;
      background: #eee;
    }

    &.is-last-item {
      border-bottom: none;
    }

    &.collapse {
      float: right;
      color: $main_text_color2;
      border-bottom: none;

      .icon {
        width: 15px;
        height: 15px;
        margin: 2px auto;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .balance-item-vendor {
    display: block;
  }

  .balance-info-maintain {
    font-size: 12px;
    color: $main_error_color1;
  }

  .balance-wrench {
    height: 12px;
    width: 12px;
    vertical-align: middle;
  }

  .balance-item-money {
    display: block;
    color: $main_text_color2;
  }
}

.invite-wrap {
  position: relative;
  width: 100%;
  height: 68px;
  margin-top: 12px;
  background: #f2e2d1;
  border-radius: 34px;

  .content {
    width: 60%;
    display: flex;
    flex-direction: column;
    color: #be9e7f;
    padding: 16px 0 16px 39px;
    font-size: 14px;
    font-weight: 700;

    div:last-of-type {
      font-size: 10px;
      font-weight: 400;
      padding-top: 3px;
    }
  }

  .image {
    position: absolute;
    top: 0;
    right: 28px;
    width: 100px;
    height: 68px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
