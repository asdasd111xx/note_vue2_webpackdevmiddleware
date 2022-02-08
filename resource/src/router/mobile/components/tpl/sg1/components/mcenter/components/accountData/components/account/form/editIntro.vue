<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <div :class="[$style.wrap, 'clearfix']">
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>
      <div :class="$style.block">
        <div :class="$style.title">签名</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            v-model="value"
            :placeholder="`请输入签名`"
            :class="$style.input"
            @input="onInput"
            :maxlength="20"
            type="text"
          />
          <div :class="$style['clear-input']" v-if="value">
            <img
              :src="$getCdnPath(`/static/image/common/ic_clear.png`)"
              @click="value = ''"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- <service-tips :edit="edit" :type="'intro'" /> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import accountHeader from "../../accountHeader";
import serviceTips from "../../serviceTips";

export default {
  components: {
    accountHeader,
    serviceTips
  },
  data() {
    return {
      value: "",
      tipMsg: "",
      edit: true
    };
  },
  mounted() {
    this.$refs.input.focus();
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: "签名",
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text("S_COMPLETE", "完成"),
        funcBtnActive: !!this.value && !this.tipMsg
      };
    }
  },
  created() {
    this.actionGetExtRedirect({
      api_uri: "/api/platform/v1/user/personal-info",
      method: "get"
    }).then(data => {
      this.paopaoMemberCardInfo = data.result;
      this.value = this.paopaoMemberCardInfo.intro;
    });
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "actionGetExtRedirect"
    ]),
    onInput(e) {
      this.actionVerificationFormData({
        target: "intro",
        value: e.target.value
      }).then(val => {
        this.value = val;
      });
    },

    handleSubmit() {
      const setIntro = this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/update-intro",
        method: "put",
        data: { intro: this.value.substring(0, 20) }
      });

      return Promise.all([setIntro]).then(response => {
        if (response.every(res => res.result === "success")) {
          localStorage.setItem("set-account-success", true);
          this.$router.push("/mobile/mcenter/accountData");
        }
      });
    }
  }
};
</script>

<style src="../../../css/index.module.scss" lang="scss" module />
