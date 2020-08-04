<template>
  <!-- <div class="text">{{ $t("ROUTER_NO_SERVICE_TITLE") }}</div>
    <div class="text">IP：{{ ip }}({{ code }})</div> -->
  <div
    v-if="imgSite"
    :class="[
      $style['content'],
      {
        [$style['ey1']]: imgSite === 'ey1'
      }
    ]"
  >
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath(`/static/image/${imgSite}/common/logo_b.png`)" />
    </div>
    <div :class="$style['title']">{{ $t("ROUTER_NO_SERVICE_TITLE") }}</div>
    <div :class="$style['text']">
      IP所在区域不在我们服务范围内，造成您的困扰，很抱歉！若有任何疑惑，请与我们客户服务联络，谢谢。
    </div>
    <div :class="$style['text']">IP：{{ ip }}({{ code }})</div>
    <div :class="$style['main-img']">
      <img :src="$getCdnPath(`/static/image/${imgSite}/status/pic_403.png`)" />
    </div>
    <div :class="$style['desc']">
      {{ $t("ROUTER_NO_SERVICE_TEXT1") }}
      <a :class="$style['mail-link']" @click="mailTo">
        <span>cs2@yaboxxx.net</span>
      </a>
      {{ $t("ROUTER_NO_SERVICE_TEXT2") }}
    </div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="handleClick">&nbsp;联系客服</span>
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">{{ msg }}</div>
    </message>
  </div>
</template>

<script>
import Vue from 'vue';
import member from '@/api/member';
import getLang from '@/lib/getLang';
import { getCookie } from '@/lib/cookie';
<<<<<<< HEAD
import message from '@/router/mobile/components/tpl/porn1/components/common/new/message';
import store from '@/store';
=======
import message from '@/router/mobile/components/common/message';
import store from '@/store';
import mixin from '@/mixins/status';
>>>>>>> develop

export default {
  mixins: [mixin],
  components: {
    message
  },
  data() {
    return {
      ip: '',
      code: '',
      status: false,
      msg: '',
<<<<<<< HEAD
      username: ''
=======
      username: '',
>>>>>>> develop
    };
  },
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
      next();
    });
  },
  created() {
    member.data({
      success: () => {
        if (this.$route.params.mode && this.$route.params.mode === 'test') {
          this.status = true;
        } else {
          if (this.$route.params.mode && this.$route.params.mode === 'test') {
            return;
          }
          this.$router.push({ path: '/' });
        }
      },
      fail: (response) => {
        this.ip = response.data.ip;
        this.code = response.data.code;
        this.status = true;
      }
    });
  },
  methods: {
    handleClick() {
      let on_service_url = store && store.state && store.state.webInfo && store.state.webInfo.on_service_url;
      localStorage.setItem('serviceUrl', on_service_url || ' https://31zfyq.italking.asia:8866/guest.php?gid=yb01&dmsrc=&lang=zh-cn');

      window.location.href = `/static/upup/index.html?username=${this.username}`;
      window.location.title = "在线客服";
    },
    mailTo() {
      const mail = 'cs2@yaboxxx.net';
      const isWebView = getCookie('platform') === "H" || window.location.host === "yaboxxxapp02.com";
      const url = `mailto:${mail}`;
      if (isWebView) {
        this.$copyText(mail);
        this.msg = '复制成功';
      } else {
        window.open(url);
      }
    }
  },
};
</script>

<style lang="scss" src="@/css/router/status.scss" module></style>
