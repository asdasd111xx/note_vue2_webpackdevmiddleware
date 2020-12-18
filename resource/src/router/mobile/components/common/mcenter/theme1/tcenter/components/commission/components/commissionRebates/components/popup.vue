<template>
  <transition name="fade">
    <div :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div v-if="!computeState" :class="$style['close-img']" @click="close">
          <img
            :src="$getCdnPath('/static/image/common/btn_close_white.png')"
            alt="close"
          />
        </div>
        <div :class="$style['title']">
          实时返利
        </div>
        <div :class="$style['content-wrap']">
          <div :class="$style['content']">
            <h1>
              {{
                computeState
                  ? $t("S_DISTRIBUTION_COMPLETED")
                  : $t("S_SYSTEM_COMPUTE_WAGER")
              }}
            </h1>

            <template v-if="computeState">
              <div :class="$style['rebate-title']">
                结算返利金额
              </div>
              <div :class="$style['rebate-value']">
                {{ amount ? amount : "--" }}
              </div>
              <div :class="$style['rebate-entry-button-wrap']">
                <div :class="$style['button-entry-close']" @click="close">
                  {{ $t("S_CLOSE") }}
                </div>
                <div
                  :class="$style['button-entry-history']"
                  @click="
                    $router.push('/mobile/mcenter/tcenter/commission/record')
                  "
                >
                  {{ $t("S_COMMISSION_SEND_RECORD") }}
                </div>
              </div>
            </template>
            <template v-else>
              <p>如欲离开本画面, 请稍候至派发记录查看记录</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
import EST from "@/lib/EST";
import mcenter from "@/api/mcenter";

export default {
  props: {
    amount: {
      type: Number,
      require: true
    },
    isShowPopup: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      computeState: false,
      receiveEntryData: {}
    };
  },
  created() {
    setTimeout(() => {
      this.computeState = true;
    }, 3000);
  },
  methods: {
    close() {
      this.$emit("update:isShowPopup", false);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;

  .pop-mask {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
  }

  .pop-block {
    position: absolute;
    width: 85%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #f8f8f7;
    border-radius: 8px;
  }

  .close-img {
    position: absolute;
    top: 13px;
    right: 10px;
    width: 23px;
    height: 23px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    height: 48px;
    line-height: 48px;
    border-radius: 5px 5px 0 0;
    // background-color: #be9e7f;
    background-color: #00347d;
    color: #fff;
    font-size: 16px;
    text-align: center;
  }
  .content-wrap {
    padding: 13px;

    .content {
      text-align: center;
    }
    h1 {
      font-size: 16px;
      margin-bottom: 14px;
    }
  }
  .rebate-title,
  .rebate-value {
    line-height: 19px;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .rebate-value {
    color: #2693cf;
  }

  .rebate-entry-button-wrap {
    text-align: center;
    margin-top: 15px;
    display: inline-block;
    width: 100%;
    height: 42px;
    line-height: 42px;

    .button-entry-history {
      display: inline-block;
      width: 45%;
      // background: linear-gradient(to left, #bd9d7d, #f9ddbd);
      background: #00347d;
      color: #fff;
      border-radius: 4px;
      margin: 0 3px;
    }
    .button-entry-close {
      display: inline-block;
      width: 45%;
      background: black;
      // color: #be9e7f;
      color: #fff;
      border-radius: 4px;
      margin: 0 3px;
    }
  }
}
</style>
