<template>
  <mobile-container>
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['msg-icon']">
        <img
          :src="
            $getCdnPath('/static/image/mobile/tpl/porn1/home/message_icon.png')
          "
          @click="goMessage()"
        />
      </div>
      <vip-info />
      <mem-list />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import vipInfo from './components/vipInfo';
import memList from './components/memList';

export default {
  components: {
    mobileContainer,
    vipInfo,
    memList
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    })
  },
  created() {

  },
  methods: {
    goMessage() {
      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }
      this.$router.push('/mobile/mcenter/information/message');
    }
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  overflow-y: scroll;
}

.msg-icon {
  margin: 5px auto;
  width: 94%;
  height: 28px;

  img {
    float: right;
    width: 28px;
  }
}
</style>
