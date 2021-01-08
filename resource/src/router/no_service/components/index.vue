<template>
  <div
    v-if="themeTPL && (themeTPL === 'porn1' || themeTPL === 'sg1')"
    :class="[$style['content'], $style[themeTPL]]"
  >
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath(`/static/image/${themeTPL}/common/logo_b.png`)" />
    </div>
    <div :class="[$style['title'], $style[themeTPL]]">
      {{ $t("ROUTER_NO_SERVICE_TITLE") }}
    </div>
    <div :class="$style['text']">
      IP所在区域不在我们服务范围内，造成您的困扰，很抱歉！若有任何疑惑，请与我们客户服务联络，谢谢。
    </div>
    <div :class="$style['text']">IP：{{ ip }}({{ code }})</div>
    <div :class="$style['main-img']">
      <img :src="$getCdnPath(`/static/image/${themeTPL}/status/pic_403.png`)" />
    </div>

    <div :class="$style['desc']">
      <template v-if="themeTPL === 'porn1'">
        {{ $t("ROUTER_NO_SERVICE_TEXT1") }}
      </template>

      <template v-if="themeTPL === 'sg1'">
        {{ $t("ROUTER_NO_SERVICE_TEXTSG") }}
      </template>

      <a
        :class="[
          $style['mail-link'],
          {
            [$style['sg1']]: themeTPL === 'sg1'
          }
        ]"
        @click="mailTo()"
      >
        <span>{{ mailURL }}</span>
      </a>

      {{ $t("ROUTER_NO_SERVICE_TEXT2") }}
    </div>

    <div :class="$style.tips">
      如需帮助，请
      <span
        :class="{
          [$style['sg1']]: themeTPL === 'sg1'
        }"
        @click="linkToService"
        >&nbsp;联系客服</span
      >
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">{{ msg }}</div>
    </message>
  </div>

  <div
    v-else-if="themeTPL && themeTPL === 'ey1'"
    :class="[$style['content'], $style['ey1']]"
  >
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath(`/static/image/${themeTPL}/common/logo_b.png`)" />
    </div>
    <div :class="$style['title']">{{ $t("ROUTER_NO_SERVICE_TITLE") }}</div>
    <div :class="$style['text']">
      IP所在区域不在我们服务范围内，造成您的困扰，很抱歉！若有任何疑惑，请与我们客户服务联络，谢谢。
    </div>
    <div :class="$style['text']">IP：{{ ip }}({{ code }})</div>
    <div :class="$style['main-img']">
      <img :src="$getCdnPath(`/static/image/${themeTPL}/status/pic_403.png`)" />
    </div>
    <div :class="$style['desc']">
      尊敬的用户，由于相关法规限制，您所在的地区无法使用亿元产品，如有任何疑问，请通过在线客服，或发邮件至
      <br />
      <a :class="$style['mail-link']" @click="mailTo('ey888@ur188.net')">
        <span>ey888@ur188.net</span>
      </a>
      <br />
      我们将第一时间给您回复，对您造成的不便，我们深表歉意，感谢您的理解与支持！
    </div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="linkToService">&nbsp;联系客服</span>
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">{{ msg }}</div>
    </message>
  </div>
</template>

<script>
import Vue from "vue";
import member from "@/api/member";
import getLang from "@/lib/getLang";
import { getCookie } from "@/lib/cookie";
import message from "@/router/mobile/components/common/message";
import store from "@/store";
import mixin from "@/mixins/status";

export default {
  mixins: [mixin],
  components: {
    message
  },
  data() {
    return {
      ip: "",
      code: "",
      status: false,
      msg: "",
      username: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get("lang") || "zh-cn"]: "" }).then(() => {
      next();
    });
  },
  computed: {
    mailURL() {
      if (this.themeTPL === "porn1") {
        return "cs2@yaboxxx.net";
      }

      if (this.themeTPL === "sg1") {
        return "cs1@siguacs.net";
      }
    }
  },
  created() {
    member.data({
      success: () => {
        if (this.$route.params.mode && this.$route.params.mode === "test") {
          this.status = true;
        } else {
          if (this.$route.params.mode && this.$route.params.mode === "test") {
            return;
          }
          this.$router.push({ path: "/" });
        }
      },
      fail: response => {
        this.ip = response.data.ip;
        this.code = response.data.code;
        this.status = true;
      }
    });
    console.log("[version]");
    this.version.forEach(element => {
      console.log(element.site, element.version);
    });
  },
  methods: {
    mailTo() {
      const isWebView = getCookie("platform") === "H";
      const url = `mailto:${this.mailURL}`;
      if (isWebView) {
        this.$copyText(mail);
        this.msg = "复制成功";
      } else {
        window.open(url);
      }
    }
  }
};
</script>

<style lang="scss" src="@/css/router/status.scss" module></style>
