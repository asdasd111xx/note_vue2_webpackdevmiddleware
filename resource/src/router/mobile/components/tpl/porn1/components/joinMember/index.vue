<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
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
import mobileContainer from '../common/new/mobileContainer'

export default {
  components: {
    joinMember,
    mobileContainer
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_REGISTER", "注册"),
      };
    },
  },
  created() {
    if (this.loginStatus) {
      this.$router.push('/mobile');
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "~@/css/page/joinMem.module.scss";

.container {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/common/bg.png");
}

.join-member-wrap {
  min-height: 100%;
}

.join-wrap {
  height: 100%;
  padding-top: 30px;
  color: #000;
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
  margin-bottom: 20px;
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
  position: absolute;
  left: 0;
  color: #d01c1c;
}

.join-input {
  background-color: #fff;
  border: 1px solid #d8d8d8;
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
  vertical-align: middle;
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

.join-btn {
  color: #000;
  background: #fad859;
  border-radius: 30px;
}

.join-line {
  background: #fff;
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
