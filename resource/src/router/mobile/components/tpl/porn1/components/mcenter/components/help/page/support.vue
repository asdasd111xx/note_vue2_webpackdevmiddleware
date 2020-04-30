<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content">
      <div
        v-for="(item, index) in data"
        :id="`q-${index}`"
        :class="[
          $style['cell'],
          $style['support-cell'],
          { [$style['active']]: item.isOpen }
        ]"
        :key="item.key"
        @click="item.list && handleToggleContent(index)"
      >
        <div :class="$style['title']">
          {{ item.title }}
        </div>
        <div
          :class="[$style['content'], { [$style['active']]: item.isOpen }]"
          :style="{ 'max-height': item.isOpen ? `100vh` : 0 }"
          v-html="item.content"
        ></div>
        <!-- <div
          :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
        >
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div> -->
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../../../common/new/mobileContainer';
import info from '../json/support.json'

export default {
  components: {
    mobileContainer,
  },
  data() {
    return {
      data: info.data.map(function (el) {
        let _o = Object.assign({}, el);
        _o.isOpen = false;
        return _o;
      })
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_TECH_SUP', '技术支持'),
      };
    },
  },
  methods: {
    handleToggleContent(key) {
      let target = document.getElementById(`q-${key}`);
      if (!target) return;
      this.data[key].isOpen = !this.data[key].isOpen;
    }
  },
};
</script>

<style src="../css/index.module.scss" lang="scss" module>
