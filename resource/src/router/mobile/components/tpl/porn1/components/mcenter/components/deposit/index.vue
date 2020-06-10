<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">
          {{ msg }}
        </div>
      </message>
      <depsoit ref="depsoit" />
    </div>
  </mobile-container>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';
import mobileContainer from '../../../common/new/mobileContainer';
import message from '../../../common/new/message'

export default {
  data() {
    return {
      msg: ''
    }
  },
  components: {
    depsoit,
    mobileContainer,
    message
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: '充值',
        hasDespositHelp: true,
        hasHelp: true,
        helpRouter: '/deposit',
        onClick: () => {
          let step = this.$refs.depsoit.resultHeaderSetting && this.$refs.depsoit.resultHeaderSetting.submitStatus
          if (step === "stepTwo") {
            window.location.reload();
            this.$router.push('/mobile/mcenter/deposit');
          } else {
            this.$router.back();
          }
        },
      };
    }
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  background-color: #f8f8f7;

  .content-wrap {
    border-top: 1px solid #eee;
  }
}

.pop-message {
  width: 140px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #fff;
  background: #5e626d;
  border-radius: 3px;
}
</style>
