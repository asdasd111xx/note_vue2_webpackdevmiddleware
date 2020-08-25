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

    // if (!document.querySelector('script[data-name="esabgnixob"]')) {
    //   this.script = document.createElement('script');
    //   this.script.setAttribute('type', 'text/javascript');
    //   this.script.setAttribute('data-name', 'esabgnixob');

    //   if (window.location.host.includes("localhost")) {
    //     this.script.setAttribute('src', 'https://yb01.66boxing.com/mobile/esabgnixob.js');
    //   } else {
    //     this.script.setAttribute('src', 'esabgnixob.js');
    //   }

    //   document.head.appendChild(this.script);
    // }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "~@/css/page/joinMem.module.scss";

.err-msg {
  padding: 2px 0;
  color: $main_error_color1;
  min-height: 40px;
}

.join-member-wrap {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/common/bg.png");
}

.join-wrap {
  height: 100%;
  color: #5e626d;
}

.title {
  color: black;
  font-size: 16px;
}

.join-content {
  width: 90%;
}

.field-wrap {
  position: relative;
  margin-bottom: 15px;
}

.join-input-captcha {
  height: 40px;
}

.captcha-img {
  position: absolute;
  top: 9px;
  right: 8px;
  width: 62px;
  height: 21px;
  background: #000;
  cursor: pointer;
}

.join-star {
  visibility: hidden;
  position: absolute;
  left: 0;
  color: #d01c1c;
}

.join-input {
  background-color: #fff;
  border: 1px solid #d8d8d8;

  &::placeholder {
    color: #a5a5a5;
  }
}

.field-title {
  display: inline-block;
  padding-left: 10px;
  width: 90px;
  z-index: 1;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
  color: #5e626d;
}

.field-right {
  position: relative;
  display: inline-block;
  width: 65%;
  text-align: right;
  vertical-align: middle;

  :global(.vdp-datepicker) {
    width: 100%;

    :global(.vdp-datepicker__calendar) {
      top: 35px;
      right: 0;
      color: #000;
      text-align: left;
    }

    :global(.vdp-datepicker__clear-button) {
      position: absolute;
      top: 8px;
      right: 10px;
    }
  }
}

.btn-verify {
  color: #000;
  background-color: #fad859;
}

.icon-verify {
  color: #edbf6b;
}

.join-btn-wrap {
  width: 100%;
  max-width: 300px;
  padding: 0;
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
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}

:global {
  .v-select {
    .dropdown-toggle {
      border: 0;
    }

    &.open {
      .open-indicator {
        bottom: 16px;
      }
    }

    .open-indicator {
      right: 4px;
      bottom: 16px;
      width: 6px;
      height: 6px;

      &::before {
        height: 6px;
        width: 6px;
        border-width: 1px 1px 0 0;
      }
    }
  }
}

@media screen and (min-width: $phone) {
  .field-text {
    font-size: 15px;
  }
}

@media screen and (min-width: $pad) {
  .title {
    font-size: 18px;
  }

  .field-text {
    font-size: 16px;
  }
}
</style>
