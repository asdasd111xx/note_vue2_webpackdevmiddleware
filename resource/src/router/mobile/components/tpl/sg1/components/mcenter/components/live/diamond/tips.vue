<template>
  <div :class="$style['tips']">
    <div :class="$style['tips-title']">
      <div :class="$style['hr']"><div /></div>
      <div :class="$style['title-tips']">
        温馨提示
        <!-- ，如需帮助
        <span :class="$style['link']" @click="$router.push('/mobile/service')">
          请联系客服
        </span> -->
      </div>
      <div :class="$style['hr']"><div /></div>
    </div>
    <div v-if="data" :class="$style['tips-content']">
      <div v-for="(text, key) in data" :key="key">
        {{ `●${text}` }}
      </div>
      <!-- <template v-if="swagConfig && swagConfig.remind">
        <div v-html="swagConfig.remind.replace(/\n/g, '<br/>')" />
      </template> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    data: {
      type: Array || null,
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.tips {
  margin-top: 35px;
  color: #a6a9b2;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-size: 14px;
  font-weight: 400;
}

.hr {
  height: 24px;
  left: 0;
  top: 0;
  position: absolute;
  width: calc((100% - 240px) * 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 100%;
    height: 1px;
    background: #dddddd;
  }
}

.tips-title {
  align-items: center;
  display: flex;
  height: 24px;
  justify-content: center;
  line-height: 24px;
  text-align: center;
  position: relative;

  .hr:last-of-type {
    left: unset;
    right: 0;
  }

  > .title-tips {
    width: 205px;
  }
}

.tips-content {
  font-size: 12px;
  font-weight: 400;
  margin-top: 3px;
  padding: 0 20px;
  text-align: left;

  > div:not(:last-of-type) {
    margin-bottom: 2.5px;
  }
}

.link {
  color: #6aaaf5;
}
</style>
