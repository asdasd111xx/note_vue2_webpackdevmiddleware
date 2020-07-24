<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" :class="$style['help-wrap']">
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">
          {{ msg }}
        </div>
      </message>
      <div
        v-for="listInfo in list"
        v-if="listInfo.needLogin ? loginStatus : true"
        :key="`list-${listInfo.name}`"
        :class="$style.list"
        @click="handleClick(listInfo.path)"
      >
        <div :class="$style['list-icon']">
          <img
            :src="
              $getCdnPath(`/static/image/_new/mcenter/help/${listInfo.img}.png`)
            "
          />
        </div>

        <div v-if="listInfo.info" :class="$style['list-info']">
          {{ listInfo.info }}
        </div>

        <span> {{ listInfo.name }} </span>
        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/_new/common/arrow_next.png`)" />
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../../common/new/mobileContainer';
import message from "../../../common/new/message"

export default {
  components: {
    mobileContainer,
    message
  },
  data() {
    return {
      msg: '',
      list: [
        {
          name: '充值教程',
          path: '/mobile/mcenter/help/deposit',
          img: 'deposit',
          info: '充值极速到账',
          needLogin: true
        },
        {
          name: '提现教程',
          path: '/mobile/mcenter/help/withdraw',
          img: 'withdraw',
          info: '极速提现仅需30秒',
          needLogin: false
        },
        {
          name: this.$text('S_GAME_INTR', '游戏介绍'),
          path: '/mobile/mcenter/help/gameintro',
          img: 'gameintro',
          info: '主流体育彩票玩法',
          needLogin: false
        },
        {
          name: this.$text('S_TECH_SUP', '技术支持'),
          path: '/mobile/mcenter/help/support',
          img: 'support',
          info: '提供全面技术支持',
          needLogin: false
        },
        {
          name: this.$text('S_CONTACT_US', '联系我们'),
          path: '/mobile/mcenter/help/contact',
          img: 'contact',
          info: '为您提供全天候服务',
          needLogin: false
        },
      ],
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
        title: this.$text('S_HELP_CENTER', '帮助中心'),
      };
    },
  },
  created() {
    // if (!this.loginStatus) {
    //   this.$router.push("/mobile/login")
    // }

    // 針對遊戲介紹
    localStorage.removeItem("help_gameIntro");
  },
  methods: {
    handleClick(path) {
      // if (path.includes('gameintro') || path.includes('support') || path.includes('deposit')) {
      if (path.includes('deposit')) {
        this.msg = '正在上线 敬请期待'
      } else {
        this.$router.push(path)
      }
    },
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  background-color: $main_background_white1;
}

.help-wrap {
  overflow-x: hidden;
  color: $main_text_color3;
  position: relative;

  .list {
    height: 60px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    background-color: $main_white_color1;

    > span {
      width: 100%;
    }

    .list-icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      margin-right: 5px;

      > img {
        height: 100%;
      }
    }

    .list-info {
      color: #cbced8;
      font-size: 12px;
      position: absolute;
      right: 38px;
    }
  }

  .btn-next {
    width: 14px;
    height: 100%;
    display: flex;
    align-items: center;
    > img {
      height: 14px;
      width: 14px;
    }
  }
}
</style>
