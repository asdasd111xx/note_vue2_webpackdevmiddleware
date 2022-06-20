<template>
  <div>
    <!-- 推廣信息 -->
    <template v-if="getAgentLink && makeFriendPage">
      <div :class="[$style['promote-wrap'], 'clearfix']">
        <span :class="$style['sub-title']">我的邀请方式</span>
        <div :class="$style['qrcode-wrap']">
          <qrcode
            :value="getAgentLink"
            :options="{ width: 129, margin: 2 }"
            tag="img"
          />
        </div>
        <div :class="$style['button-wrap']">
          <div @click="onQrcodeOpen">
            <span :class="$style['button-text']">{{
              $text("S_DOWNLOAD_QRCODE", "下载二维码")
            }}</span>
          </div>
          <div @click="onCopy('LINK')">
            <span :class="$style['button-text']">{{
              $text("S_COPY_PROMOTION_LINK", "复制推广连结")
            }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="isBindFriend && friendCode !== ''"
        :class="[$style['bind-code-wrap'], 'clearfix']"
      >
        <span :class="$style['sub-title']">我的绑定码</span>
        <div :class="$style['bind-code-item']">
          <span>{{ friendCode }}</span>
          <div :class="$style['copyImg']" @click="onCopy('FRIEND')">
            <img :src="'/static/image/common/ic_copy.png'" />
          </div>
        </div>
        <div :class="$style['bind-code-tip']">
          提供绑定码给上级，成为他的一级好友
        </div>
      </div>
    </template>

    <!-- 一級好友 -->
    <div v-if="!makeFriendPage" :class="$style['friend-and-register-wrap']">
      <div :class="$style['friend-tab-wrap']">
        <span
          v-for="(item, index) in friendTab"
          :key="`q-${index}`"
          @click="changeFrinendTab(index)"
          :class="[
            $style['tab-item'],
            { [$style['is-current']]: currentTab === index }
          ]"
          >{{ item.name }}</span
        >
        <div
          :class="[$style['active-slider'], { [$style['click']]: clickTab }]"
          :style="{ left: leftTab }"
        />
      </div>

      <div
        v-if="friendTab[currentTab].key === 'add'"
        :class="$style['register-wrap']"
      >
        <div v-for="key in allInput" :key="key" :class="$style['input-group']">
          <!-- 欄位名稱 -->
          <div :class="$style['input-title']">
            {{ allTip[key].title }}
          </div>
          <!-- 輸入框 -->
          <div
            :class="[
              $style[key],
              $style.placeholder,
              {
                [$style.error]: allTip[key].error
              }
            ]"
          >
            <input
              v-if="key !== 'password' && key !== 'confirm_password'"
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: allValue[key],
                  [$style['show-placeholder']]: !allValue[key]
                }
              ]"
              :placeholder="allTip[key].placeholder"
              :maxlength="allTip[key].maxLength"
              v-model="allValue[key]"
              data-vv-scope="form-page"
              @blur="onInput($event.target.value, key)"
              @input="onInput($event.target.value, key)"
              @keydown.13="onSubmit"
            />
            <input
              v-else-if="key === 'password' || key === 'confirm_password'"
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: allValue[key],
                  [$style['show-placeholder']]: !allValue[key]
                }
              ]"
              :placeholder="allTip[key].placeholder"
              :data-key="key"
              :maxlength="allTip[key].maxLength"
              v-model="allValue[key]"
              type="password"
              data-vv-scope="form-page"
              @blur="onInput($event.target.value, key)"
              @input="onInput($event.target.value, key)"
              @keydown.13="onSubmit"
            />
            <div
              v-if="['password', 'confirm_password'].includes(key)"
              :class="[
                $style['btn-show-password'],
                { [$style.active]: isShowEyes }
              ]"
              @click="onShowPassword"
            />
          </div>
          <!-- 錯誤訊息 -->
          <div v-if="allTip[key].error" :class="$style['error-message']">
            {{ allTip[key].error }}
          </div>
        </div>
        <!-- 驗證碼 -->
        <div v-if="memInfo.config.friend_captcha_type === 1">
          <div :class="$style['input-title']">
            验证码
          </div>
          <div
            :class="[
              $style['captcha-unit'],
              $style['captcha-unit-captcha'],
              $style['clearfix']
            ]"
          >
            <input
              ref="captcha_text"
              v-model="allValue['captcha_text']"
              placeholder="请输入验证码"
              :class="$style['captcha-input']"
              maxlength="4"
              data-vv-scope="form-page"
              @input="onInput($event.target.value, 'captcha_text')"
              @keydown.13="onSubmit"
            />
            <div class="input-icon"></div>
            <img
              :class="$style['captchaImg']"
              v-if="captchaImg"
              :src="captchaImg"
              height="25"
            />
            <div :class="$style['captchaText-refresh']" @click="getCaptcha">
              <img :src="'/static/image/common/ic_verification_reform.png'" />
            </div>
          </div>
        </div>
        <!-- 錯誤訊息 -->
        <div
          v-if="memInfo.config.friend_captcha_type === 1 && captchaErrorMsg"
          :class="$style['captcha-error']"
        >
          {{ captchaErrorMsg }}
        </div>
        <popup-verification
          v-if="isShowCaptcha"
          @show-captcha="showCaptcha"
          @set-captcha="setCaptcha"
          :page-type="'friends'"
        />
      </div>

      <div
        v-if="friendTab[currentTab].key === 'bind'"
        :class="$style['register-wrap']"
      >
        <div
          v-for="key in bindFriendInput"
          :key="key"
          :class="$style['input-group']"
        >
          <!-- 欄位名稱 -->
          <div :class="$style['input-title']">
            {{ bindFriendTip[key].title }}
          </div>
          <!-- 輸入框 -->
          <div
            :class="[
              $style[key],
              $style.placeholder,
              {
                [$style.error]: errorLine
              }
            ]"
          >
            <input
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: bindFriendValue[key],
                  [$style['show-placeholder']]: !bindFriendValue[key]
                }
              ]"
              :placeholder="bindFriendTip[key].placeholder"
              :data-key="key"
              :maxlength="bindFriendTip[key].maxLength"
              v-model="bindFriendValue[key]"
              type="text"
              data-vv-scope="friend"
              @blur="onInput($event.target.value, key)"
              @input="onInput($event.target.value, key)"
              @keydown.13="FriendSubmit"
            />
          </div>
          <!-- 錯誤訊息 -->
          <div v-if="bindFriendTip[key].error" :class="$style['error-message']">
            {{ bindFriendTip[key].error }}
          </div>
        </div>
      </div>

      <div :class="$style['content-footer']">
        <button v-if="friendTab[currentTab].key === 'add'" @click="checkInput">
          {{ $text("S_ADD") }}
        </button>
        <template v-if="friendTab[currentTab].key === 'bind'">
          <button @click="FriendcheckInput">
            {{ $text("S_CONFIRM_2") }}
          </button>
          <div :class="$style['tips-content']">
            (1)通过此功能可以找回未成功绑定的一级好友 <br />
            (2)绑定码位置：我的推广>团队管理>团队概况>推广信息>我的绑定码
          </div>
        </template>
        <div :class="$style.tips">
          如需帮助，请
          <span @click="$router.push('/mobile/service')">联系客服</span>
        </div>
      </div>

      <!-- 連結複製提示與 QR Code -->
      <popup
        v-if="isPopup"
        :type="popupType"
        :link="getAgentLink"
        @close="onPopupClose"
      />
    </div>
  </div>
</template>

<script>
import friendsRecommend from "@/mixins/mcenter/management/friendsRecommend";
import promoteFunction from "@/mixins/mcenter/management/promoteFunction";
import { mapGetters, mapActions } from "vuex";
import popupVerification from "@/components/popupVerification";
import { nextTick } from "vue";

export default {
  components: {
    popup: () =>
      import(
        /* webpackChunkName: 'popup' */ "../../management/components/popup/index"
      ),
    popupVerification
  },
  mixins: [friendsRecommend, promoteFunction],
  data() {
    return {
      makeFriendPage: true,
      puzzleData: null,
      isGetCaptcha: false, // 重新取得驗證碼
      captchaImg: "",
      thirdyCaptchaObj: null,
      isShowCaptcha: false,
      clickTab: false,
      currentTab: parseInt(this.$route.query.bindFriend) || 0
    };
  },
  watch: {
    thirdyCaptchaObj(val) {
      if (this.memInfo.config.friend_captcha_type != 1 && val) {
        this.allValue["captcha_text"] = val;
        this.onSubmit();
      }
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      isBackEnd: "getIsBackEnd",
      domainConfig: "getDomainConfig"
    }),
    puzzleObj: {
      get() {
        return this.puzzleData;
      },
      set(value) {
        this.puzzleData = value;
      }
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    isAddFriend() {
      return this.memInfo.config.infinity_register;
    },
    isBindFriend() {
      return this.bindFriend.enable;
    },
    friendTab() {
      return [
        { key: "add", name: "新增", show: this.isAddFriend },
        { key: "bind", name: "绑定", show: this.isBindFriend }
      ].filter(item => item.show);
    },
    leftTab() {
      return `calc(calc(50% / ${this.friendTab.length}) - 22.5px + 50% * ${this.currentTab})`;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  created() {
    this.pageStatus();
    this.getCaptcha();
    // console.log(this.$route.query);
    this.makeFriendPage = this.$route.query.makeFriend === "true";

    if (String(this.friendTab[this.currentTab]) === "undefined") {
      this.currentTab = 0;
    }
  },
  methods: {
    showCaptchaPopup() {
      // 無認證直接呼叫
      if (this.memInfo.config.friend_captcha_type === 0) {
        this.handleSend();
        return;
      }
      // 四碼驗證
      if (this.memInfo.config.friend_captcha_type === 1) {
        this.onSubmit();
        return;
      }

      if ([2, 3, 4, 5].includes(this.memInfo.config.friend_captcha_type)) {
        this.showCaptcha();
      }
    },
    handleSend() {
      this.onSubmit();
    },
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    showCaptcha() {
      this.isShowCaptcha = !this.isShowCaptcha;
    },
    changeFrinendTab(index) {
      this.clickTab = false;
      this.currentTab = index;
      this.$nextTick(() => {
        this.clickTab = true;
      });
    },
    pageStatus() {
      if (!this.isAddFriend && !this.isBindFriend) {
        this.$router.replace("/mobile/mcenter/tcenterLobby");
        return;
      }

      if (!this.memInfo.user.show_promotion) {
        this.$router.replace("/mobile/mcenter/home");
        return;
      }
    }
  }
};
</script>
/*
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
*/
