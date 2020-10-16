<template>
  <!-- 提款前提示彈窗 -->
  <transition name="fade">
    <div :class="$style['wrap']">
      <div :class="$style['container']">
        <div :class="$style['header']">
          <div @click="close" :class="$style['prev']">
            {{ $text("S_CANCEL", "取消") }}
          </div>

          <div :class="$style['title']">
            {{ title }}
          </div>
        </div>

        <div :class="$style['content']">
          <div
            v-for="item in renderList"
            :class="$style['cell']"
            @click="handleClickItem(item)"
          >
            <template v-if="type === 'withdraw-currency'">
              <icon
                v-if="currentObj.method_id === item.method_id"
                :class="$style['select-icon']"
                name="check"
              />
            </template>
            {{ item[itemText] }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    renderList: {
      type: Array,
      default: []
    },
    currentObj: {
      type: Object,
      default: {}
    },
    itemFunc: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    },
    itemText() {
      switch (this.type) {
        case 'withdraw-currency':
          return 'currency_name';
          break;

        default:
          break;
      }
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    handleClickItem(item) {
      this.itemFunc(item);
      this.close();
    }
  }
};
</script>

<style
  lang="scss"
  src="./css/porn1.index.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="./css/ey1.index.scss"
  module="$style_ey1"
></style>
