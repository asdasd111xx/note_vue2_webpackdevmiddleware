<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']">
      <div :class="$style['section']">
        <div
          v-for="(item, index) in data"
          :class="[
            $style['cell'],
            { [$style['active']]: item.isOpen },
            `q-${index}`
          ]"
          :key="item.key"
        >
          <div :class="$style['title']">
            {{ item.title }}
          </div>

          <div
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
            v-html="item.content"
          ></div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
            @click="handleToggleContent(index)"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../../common/new/mobileContainer';
import info from './json/withdraw.json'
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
  created() {
    if (!info) this.$router.back();
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    isApp() {
      // APP Web view
      return false
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: '提现教程',
      };
    },
  },
  methods: {
    handleToggleContent(key) {
      this.data[key].isOpen = !this.data[key].isOpen;
    }
  },
};
</script>

<style src="./css/index.module.scss" lang="scss" module>
