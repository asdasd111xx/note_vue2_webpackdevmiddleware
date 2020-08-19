<template>
  <div slot="content">
    <div :class="$style['section']" style="margin-top: 10px">
      <div
        v-for="(item, index) in data"
        :id="`q-${item.key}`"
        :class="$style['cell']"
        :key="item.key"
        @click="handleToggleContent(item.key)"
      >
        <div :class="$style['cell-header']">
          <div :class="$style['title-icon']">
            <img
              :src="$getCdnPath('/static/image/_new/mcenter/ic_help.png')"
              alt="help"
            />
          </div>

          <div :class="$style['title']">
            {{ item.title }}
          </div>
        </div>

        <div
          :class="[$style['content'], { [$style['active']]: item.isOpen }]"
          :style="{ 'max-height': item.isOpen ? `150vh` : 0 }"
        >
          <div
            v-for="(item, index) in item.list"
            :class="$style['text-block']"
            v-html="item"
          />
        </div>

        <div
          :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
        >
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import info from "../../json/support.json";

export default {
  components: {
  },
  data() {
    return {
      data: info.data.map(el => {
        let _o = Object.assign({}, el);
        _o.isOpen = false;
        return _o;
      })
    };
  },
  mounted() {
    if (!info) this.$router.back();
  },
  computed: {
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      if (isApp) document.title = "技术支持";

      return isApp;
    },
    headerConfig() {
      if (!this.isApp)
        return {
          prev: true,
          onClick: () => {
            this.$router.back();
          },
          title: this.$text("S_TECH_SUP", "技术支持")
        };
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
<style src="../../css/index.module.scss" lang="scss" module>
