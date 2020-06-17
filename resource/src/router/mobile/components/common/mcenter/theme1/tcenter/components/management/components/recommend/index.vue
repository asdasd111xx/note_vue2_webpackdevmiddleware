<template>
  <div :class="mainClass">
    <div :class="[$style['code-wrap'], 'clearfix']">
      <div :class="$style.title">
        {{ $text("S_PROMOTION_CODE", "推广代码") }}
      </div>
      <div :class="$style.code">{{ agentCode }}</div>
    </div>
    <div v-if="agentLink" :class="[$style['promote-wrap'], 'clearfix']">
      <div :class="$style['qrcode-wrap']">
        <qrcode
          :value="agentLink"
          :options="{ width: 129, margin: 2 }"
          tag="img"
        />
      </div>
      <div :class="$style['button-wrap']">
        <div class="download-qrcode" @click="onQrcodeOpen">
          <span :class="[$style.icon, $style['icon-qrcode']]" />
          <span :class="$style['button-text']">{{
            $text("S_DOWNLOAD_QRCODE", "下载二维码")
          }}</span>
        </div>
        <div class="copy-link" @click="onCopy('link')">
          <span :class="[$style.icon, $style['icon-copy']]" />
          <span :class="$style['button-text']">{{
            $text("S_COPY_PROMOTION_LINK", "复制推广连结")
          }}</span>
        </div>
        <div class="copy-code" @click="onCopy('code')">
          <span :class="[$style.icon, $style['icon-copy']]" />
          <span :class="$style['button-text']">{{
            $text("S_COPY_PROMOTION_CODE", "复制推广代码")
          }}</span>
        </div>
      </div>
      <div
        v-if="memInfo.config.infinity_register"
        :class="$style['button-create']"
        @click="isShow = !isShow"
      >
        <span :class="[$style['icon-arrow'], { [$style.active]: isShow }]" />
        <span>新增一级好友</span>
      </div>
    </div>
    <transition name="slide-down">
      <div v-if="isShow" :class="$style['register-wrap']">
        <div :class="$style.line" />
        <div v-for="key in allInput" :key="key" :class="$style['input-group']">
          <!-- 欄位名稱 -->
          <div :class="$style['input-title']">
            {{ $text(allText[key].placeholder) }}
          </div>
          <!-- 輸入框 -->
          <div
            :class="[
              $style[key],
              $style.placeholder,
              { [$style.error]: allText[key].error }
            ]"
          >
            <template v-if="!allValue[key]">
              {{ $text(texts[key].placeholder) }}
            </template>
            <input
              v-if="key === 'password' || key === 'confirm_password'"
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: allValue[key],
                  [$style.error]: allText[key].error,
                  [$style['show-placeholder']]: !allValue[key]
                }
              ]"
              :maxlength="allText[key].maxLength"
              type="password"
              v-model="allValue[key]"
              data-vv-scope="form-page"
              @input="onInput($event.target.value, key)"
              @keydown.13="onSubmit"
            />
            <input
              v-else
              v-validate="'required'"
              :class="[
                {
                  [$style.active]: allValue[key],
                  [$style.error]: allText[key].error,
                  [$style['show-placeholder']]: !allValue[key]
                }
              ]"
              :maxlength="allText[key].maxLength"
              type="text"
              v-model="allValue[key]"
              data-vv-scope="form-page"
              @input="onInput($event.target.value, key)"
              @keydown.13="onSubmit"
            />
            <div
              v-if="['password', 'confirm_password'].includes(key)"
              :class="[
                $style['btn-show-password'],
                { [$style.active]: allText[key].type === 'text' }
              ]"
              @click="onShowPassword(allText[key].type)"
            />
          </div>
          <!-- 錯誤訊息 -->
          <div
            v-if="allText[key].error && texts[key].error"
            :class="$style['error-message']"
          >
            {{ $text(texts[key].error) }}
          </div>
        </div>
        <button @click="onSubmit">{{ $text("S_ADD") }}</button>
      </div>
    </transition>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
    <!-- 連結複製提示與 QR Code -->
    <popup
      v-if="isPopup"
      :type="popupType"
      :link="agentLink"
      @close="onPopupClose"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import friendsRecommend from '@/mixins/mcenter/management/friendsRecommend';
import promoteFunction from '@/mixins/mcenter/management/promoteFunction';
import message from '@/router/mobile/components/tpl/porn1/components/common/new/message';

export default {
  components: {
    popup: () => import(/* webpackChunkName: 'popup' */'../popup/index'),
    message
  },
  mixins: [friendsRecommend, promoteFunction],
  data() {
    return {
      texts: {
        username: {
          placeholder: 'S_USERNAME_ERROR',
          error: 'S_USERNAME_ERROR'
        },
        // 密碼
        password: {
          placeholder: 'S_PASSWORD_ERROR',
          error: 'S_PASSWORD_ERROR'
        },
        // 確認密碼
        confirm_password: {
          placeholder: 'S_PWD_CONFIRM',
          error: 'S_JM_PASSWD_CONFIRM_ERROR'
        },
        // 會員姓名
        name: {
          placeholder: 'S_REGISTER_TIPS',
          error: 'S_NO_SYMBOL_DIGIT_CHEN'
        },
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    mainClass() {
      const site = `site-${this.memInfo.user.domain}`;

      return {
        'recommend-wrap': true,
        'main-class': true,
        [this.$style[site]]: this.$style[site],
        [this.$style['preset-color']]: !this.$style[site]
      };
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
