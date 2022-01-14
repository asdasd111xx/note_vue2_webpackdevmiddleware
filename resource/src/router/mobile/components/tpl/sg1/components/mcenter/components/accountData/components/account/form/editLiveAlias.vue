<template>
  <div slot="content" :class="$style['content-wrap']">
    <!-- 暱稱變更阻擋提示 -->
    <!-- <transition name="fade">
      <div v-show="cantEditAlias" :class="$style['alert-dialog-masker']">
        <div :class="$style['alert-dialog-wrap']">
          <h3>提示</h3>
          <p>修改次数不足，请购买更名卡后 再重新操作</p>
          <div :class="$style['btn-wrap']">
            <span @click="cantEditAlias = false">取消</span>
            <span
              @click="$router.push('/mobile/live/iframe/mall?hasFooter=false')"
              >去购买</span
            >
          </div>
        </div>
      </div>
    </transition> -->

    <account-header :header-config="headerConfig" />
    <div :class="[$style.wrap, 'clearfix']">
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>
      <div :class="$style.block">
        <div :class="$style.title">{{ $text("S_LIVE_NICKNAME") }}</div>
        <div :class="$style['input-wrap']">
          <input
            ref="input"
            v-model="value"
            :placeholder="`请输入${$text('S_LIVE_NICKNAME')}`"
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
    <!-- <service-tips :edit="edit" :type="'alias'" /> -->
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
      cantEditAlias: false,
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
        title: this.$text("S_LIVE_NICKNAME", "直播昵称"),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text("S_COMPLETE", "完成"),
        funcBtnActive: !!this.value && !this.tipMsg
      };
    },
    checkSameName() {
      if (this.paopaoMemberCardInfo.alias == this.value) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.actionGetExtRedirect({
      api_uri: "/api/platform/v1/user/personal-info",
      method: "get"
    }).then(data => {
      this.paopaoMemberCardInfo = data.result;
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
        target: "alias",
        value: e.target.value
      }).then(val => {
        this.value = val;
        if (val) {
          this.tipMsg = "";
        }
      });
    },
    handleSubmit() {
      // 驗證失敗d
      //   if (!/^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/.test(this.value)) {
      //     this.$emit('msg', this.$text('S_NO_SYMBOL', '请勿输入特殊符号(允许空白)'));
      //     return Promise.resolve(result);
      //   }
      if (this.checkSameName) {
        this.tipMsg = "资料已存在，无法重复建立";
        return;
      } else {
        const setNickname = this.actionGetExtRedirect({
          api_uri: "/api/platform/v1/user/update-alias",
          method: "put",
          data: { alias: this.value.substring(0, 20) }
        });

        return Promise.all([setNickname]).then(response => {
          if (response.every(res => res.result === "success")) {
            localStorage.setItem("set-account-success", true);
            this.$router.push("/mobile/mcenter/accountData");
          }
        });
      }
    }
  }
};
</script>

<style src="../../../css/index.module.scss" lang="scss" module />
