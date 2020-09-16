<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" class="content-wrap">
      <div :class="$style['join-member-wrap']">
        <join-member :theme="$style">
          <template slot="join-header" />
        </join-member>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import joinMember from '@/router/web/components/page/join_member';
import mobileContainer from '../common/mobileContainer'

export default {
  components: {
    joinMember,
    mobileContainer
  },
  data() {
    return {
      script: null
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        hasClose: true,
        title: this.$text("S_REGISTER", "注册"),
      };
    },
  },
  beforeDestroy() {
    // let script = document.querySelector('script[data-name="esabgnixob"]');
    // if (script) {
    //   script.parentElement.removeChild(script);
    // }
  },
  created() {
    if (this.loginStatus) {
      this.$router.push('/mobile');
      return;
    }

    if (!document.querySelector('script[data-name="esabgnixob"]')) {
      this.script = document.createElement('script');
      this.script.setAttribute('type', 'text/javascript');
      this.script.setAttribute('data-name', 'esabgnixob');

      if (window.location.host.includes("localhost")) {
        this.script.setAttribute('src', 'https://yb01.66boxing.com/mobile/esabgnixob.js');
      } else {
        this.script.setAttribute('src', 'esabgnixob.js');
      }

      document.head.appendChild(this.script);
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "~@/css/page/joinMem.module.scss";

.join-member-wrap {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/common/bg.png");
}

.join-input {
  background-color: #fff;
  border: 1px solid #d8d8d8;

  &::placeholder {
    color: #a5a5a5;
  }
}

.join-btn {
  margin: 0 auto;
  background: linear-gradient(to left, #bd9d7d 0%, #f9ddbd 100%);
  border-radius: 30px;
  height: 50px;
  line-height: 50px;
  width: 100%;
  max-width: 300px;
  font-size: 13px;
  font-family: Segoe UI, Segoe UI-Bold;
  font-weight: 700;
  text-align: center;
  color: #ffffff;

  &.disable {
    background: linear-gradient(#e9dacb, #eee5db);
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}
</style>
