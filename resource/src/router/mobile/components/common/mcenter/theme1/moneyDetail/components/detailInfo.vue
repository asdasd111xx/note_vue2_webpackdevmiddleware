<template>
  <div :class="$style['detail-info-wrap']">
    <div :class="$style.amount">
      <span :class="$style.symbol">¥</span>
      <span :class="$style.number">{{ detailInfo.amount }}</span>
    </div>
    <div :class="$style.wrap">
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">交易类型</div>
        <div :class="$style.text">{{ currentCategory.text }}</div>
      </div>
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">交易方式</div>
        <div :class="$style.text">{{ opcodeList[detailInfo.opcode] }}</div>
      </div>
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">交易时间</div>
        <div :class="$style.text">{{ detailInfo.created_at | dateFormat }}</div>
      </div>
      <div
        v-if="detailInfo.ref_id || detailInfo.trans_id"
        :class="[$style.detail, 'clearfix']"
      >
        <div :class="$style.title">订单号码</div>
        <div :class="$style.text">
          <span>{{
            detailInfo.ref_id ? detailInfo.ref_id : detailInfo.trans_id
          }}</span>
          <div :class="$style.copyImg" @click="oncopy">
            <img
              :src="$getCdnPath(`/static/image/common/ic_copy.png`)"
              alt="copy"
            />
          </div>
        </div>
      </div>
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">备注</div>
        <div :class="$style.text2">
          {{ detailInfo.memo ? detailInfo.memo : "--" }}
        </div>
      </div>
    </div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="linkToService">联系客服</span>
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent; margin: 0; padding: 0"
          v-html="msg"
        />
      </div>
    </message>
  </div>
</template>

<script>
import Vue from "vue";
import message from "@/router/mobile/components/common/message";
import { mapGetters } from "vuex";

export default {
  components: {
    message
  },
  data() {
    return {
      msg: ""
    };
  },
  filters: {
    dateFormat(date) {
      return Vue.moment(date)
        .utcOffset(-4)
        .format("YYYY-MM-DD HH:mm:ss");
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  props: {
    currentCategory: {
      type: Object,
      required: true
    },
    opcodeList: {
      type: Object,
      required: true
    },
    detailInfo: {
      type: Object,
      default: null
    }
  },
  methods: {
    linkToService() {
      localStorage.setItem("money-detail-params-service", true);
      let currentUrl = window.location.pathname + window.location.search;

      //  明細後聯繫客服上一頁
      if (
        this.$route.name === "mcenter-swag" &&
        currentUrl !== "/mobile/mcenter/swag?tab=1"
      ) {
        this.$router.replace("/mobile/mcenter/swag?tab=1");
      }

      if (
        this.$route.name === "mcenter-creditTrans" &&
        currentUrl !== "/mobile/mcenter/creditTrans?tab=2"
      ) {
        this.$router.replace("/mobile/mcenter/creditTrans?tab=2");
      }

      this.$router.push("/mobile/service");
    },
    oncopy() {
      this.$copyText(this.detailInfo.ref_id);
      this.msg = "已复制到剪贴板";
    }
  },
  beforeDestroy() {
    this.$emit("update:detailInfo", null);
  }
};
</script>

<style lang="scss" src="../css/porn1.info.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.info.scss" module="$style_ey1"></style>
<style lang="scss" src="../css/sg1.info.scss" module="$style_sg1"></style>
