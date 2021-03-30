<template>
  <div :class="$style['all-view']">
    <div :class="$style['envelope-box']">
      <div
        :class="[
          $style['envelope-top'],
          { [$style['envelope-open']]: envelopeOpenType }
        ]"
      ></div>
      <div :class="$style['envelope-middle']">
        <div :class="$style['envelope-message']" v-html="encelopeMessage" />
        <div :class="$style['envelope-button']" @click="clickEvent">
          {{ buttonText }}
        </div>
      </div>
      <div :class="$style['envelope-ground']"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    redEnvelopeData: {
      default: {},
      type: Object
    }
  },
  data() {
    return {
      envelopeOpenType: false,
      encelopeMessage: "",
      buttonText: "开"
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  mounted() {
    this.encelopeMessage = this.redEnvelopeData.bonusMessage.replaceAll(
      "<br>",
      "<br/>"
    );
  },
  methods: {
    closeEvelope() {
      this.$emit("closeEvelope", !!this.sitePostList);
    },
    clickEvent() {
      // console.log("click");
      if (!this.envelopeOpenType) {
        this.envelopeOpenType = true;
        this.encelopeMessage = this.redEnvelopeData.resultMessage;
        switch (this.redEnvelopeData.status) {
          case 0:
            this.buttonText = "去充值";
            break;
          case 1:
            this.buttonText = "领取";
            break;
          default:
            break;
        }
        return;
      } else {
        if (this.redEnvelopeData.status === 0) {
          this.$router.push(`/mobile/mcenter/deposit`);
        } else {
          this.closeEvelope();
        }
      }
    }
  }
};
</script>

<style lang="scss" module>
.all-view {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.envelope-box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding: 0px 0px;
}
.envelope-top {
  height: 178px;
  width: 300px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("/static/image/common/RedEnvelope/envelope_bg_normal_top.png");

  &.envelope-open {
    background-image: url("/static/image/common/RedEnvelope/envelope_bg_open_top.png");
  }
}
.envelope-middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  background-repeat: repeat-y;
  background-size: contain;
  background-image: url("/static/image/common/RedEnvelope/envelope_bg_y.png");
  margin: -2px 0;
}
.envelope-button {
  height: 40px;
  width: 170px;
  margin: 20px 0px;
  text-align: center;
  line-height: 40px;
  color: #8a1808;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("/static/image/common/RedEnvelope/btn_envelope.png");
}
.envelope-message {
  align-items: center;
  display: flex;
  flex-direction: column;
  color: #fbf0bb;
  text-align: center;
}

.envelope-ground {
  height: 21px;
  width: 300px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("/static/image/common/RedEnvelope/envelope_bg_bottom.png");
}
</style>
