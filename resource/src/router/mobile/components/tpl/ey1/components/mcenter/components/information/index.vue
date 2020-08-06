<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <information />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import information from '@/router/mobile/components/tpl/porn1/components/mcenter/components/information/components/index';
export default {
  components: {
    mobileContainer,
    information
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {

  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      const trans = { message: '通知', news: '活动', post: '公告' };

      return {
        prev: true,
        title: this.$route.query.pid ? trans[this.currentTemplate] : '消息中心',
        onClick: () => {
          this.$router.back();
        }
      };
    },
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  background-color: #f8f8f7;
}
</style>
