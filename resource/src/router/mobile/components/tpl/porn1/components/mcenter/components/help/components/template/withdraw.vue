<template>
  <div slot="content">
    <div :class="$style['section']">
      <div
        v-if="hasCid"
        :class="[$style['cell']]"
        :style="{ 'margin-bottom': '10px' }"
        @click="
          $router.push(
            `/mobile/mcenter/help/detail?type=withdraw${
              isApp ? '&app=true' : ''
            }`
          )
        "
      >
        <div :class="$style['title']">
          {{ $text("S_RECENTLY_WITHDRAW", "近10笔提现记录") }}
        </div>
        <div :class="[$style['arrow-btn']]">
          <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
        </div>
      </div>

      <div
        v-for="item in data"
        :id="`q-${item.key}`"
        :class="[$style['cell'], { [$style['active']]: item.isOpen }]"
        :key="item.key"
      >
        <template v-if="item.title && item.content">
          <div
            :class="$style['title']"
            @click="item.content && handleToggleContent(item.key)"
          >
            {{ item.title }}
          </div>

          <div
            v-if="item.key == 99"
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
            :style="{ 'max-height': item.isOpen ? `100vh` : 0 }"
          >
            <div :class="[$style['content-text']]" v-html="item.content"></div>
            <div :class="[$style['content-img']]">
              <img
                :src="
                  $getCdnPath(
                    `/static/image/porn1/mcenter/help/withdraw/sample_01.png`
                  )
                "
              />
            </div>
          </div>

          <div
            v-else
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
            :style="{ 'max-height': item.isOpen ? `100vh` : 0 }"
            v-html="item.content"
          ></div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
            @click="item.content && handleToggleContent(item.key)"
          >
            <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCookie } from "@/lib/cookie";

export default {
  components: {},
  data() {
    return {
      isShowRecoard: false,
      hasCid: false,
      data: null
    };
  },
  watch: {
    data() {
      this.$nextTick(() => {
        const query = this.$route.query;
        if (query.key) {
          this.handleToggleContent(query.key);
        }
      });
    }
  },
  mounted() {
    fetch(`/i18n/json/${this.routerTPL}/withdraw.json`)
      .then(res => res.json())
      .then(data => {
        this.source = data;
        this.data = this.source.data.map(function(el) {
          let _o = Object.assign({}, el);
          _o.isOpen = false;
          return _o;
        });
      })
      .then(final => {
        if (!this.source) this.$router.back();
      });

    this.hasCid = getCookie("cid") || false;
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus"
    }),
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
    headerConfig() {
      if (!this.isApp)
        return {
          prev: true,
          onClick: () => {
            this.$route.query.key === "0"
              ? this.$router.push("/mobile/mcenter")
              : this.$router.back();
          },
          title: this.$text("S_HELP_CENTER", "帮助中心")
        };
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  methods: {
    handleToggleContent(key) {
      let target = document.getElementById(`q-${key}`);
      if (!target) return;

      this.data.forEach((element, index) => {
        if (Number(element.key) === Number(key)) {
          element.isOpen = !element.isOpen;
        }
      });
    }
  }
};
</script>
<style src="../../css/withdraw.module.scss" lang="scss" module />
