<template>
  <mobile-container :class="$style.container">
    <div slot="content" class="content-wrap">
      <div :class="$style['service-header']">
        <div :class="$style.title">{{ this.$text("S_SERVIEC", "客服") }}</div>
        <div
          @click="$router.push('/mobile/mcenter/information/post')"
          :class="$style.feedback"
        >
          {{ this.$text("S_FEEDBACK", "意见反馈") }}
        </div>
      </div>
      <message v-if="msg" @close="msg = ''"
        ><div slot="msg">{{ msg }}</div>
      </message>
      <div :class="$style['bg']" />
      <div :class="$style['avatar-info-wrap']">
        <div :class="$style['avatar-wrap']">
          <img :src="avatarSrc" />
        </div>
        <div :class="$style['info-wrap']">
          <span
            >Hi,&nbsp;
            {{ name }}
          </span>
          <span>欢迎来到客服中心</span>
        </div>
      </div>

      <div :class="$style['info-card']" @click="clickService">
        <div>
          <div>
            <img :src="$getCdnPath(`/static/image/_new/service/24.png`)" />
            &nbsp;
            <span>在线客服1</span>
          </div>
          <div>Main Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
        </div>
      </div>

      <div :class="$style['info-card2']" @click="clickService">
        <div>
          <div>
            <img :src="$getCdnPath(`/static/image/_new/service/24.png`)" />
            &nbsp;
            <span>在线客服2</span>
          </div>
          <div>Main Customer Support</div>
          <div>7*24小时专线服务 贴心至上</div>
        </div>

        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../common/new/mobileContainer';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import message from '../../components/common/new/message'

export default {
  components: {
    mobileContainer,
    message
  },
  data() {
    return {
      msg: "",
      imgID: 0,
      imgIndex: 0,
      avatar: [
        { image: 'avatar_1', url: '/static/image/_new/mcenter/default/avatar_1.png' },
        { image: 'avatar_2', url: '/static/image/_new/mcenter/default/avatar_2.png' },
        { image: 'avatar_3', url: '/static/image/_new/mcenter/default/avatar_3.png' },
        { image: 'avatar_4', url: '/static/image/_new/mcenter/default/avatar_4.png' },
        { image: 'avatar_5', url: '/static/image/_new/mcenter/default/avatar_5.png' },
        { image: 'avatar_6', url: '/static/image/_new/mcenter/default/avatar_6.png' }
      ],
    };
  },
  created() {
    if (this.memInfo.user.image === 0) {
      this.imgIndex = 1;
      this.imgID = 1;
      return;
    }
    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
    }),
    avatarSrc() {
      return !this.loginStatus ?
        this.$getCdnPath(`/static/image/_new/mcenter/avatar_nologin.png`) :
        this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${this.imgIndex}.png`)

    },
    name() {
      if (this.loginStatus) {
        return this.memInfo.user.show_alias
          ? this.memInfo.user.alias
          : this.memInfo.user.username
      } else {
        return '尊敬的用户'
      }
    },
    headerConfig() {
      return {
        title: this.$text('S_SERVIEC', '客服'),
        // prev: true,
        // onClick: () => { this.$router.back(); }
      };
    },
  },
  methods: {
    clickService() {
      // to do
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: #fff;
  background-image: url("/static/image/_new/service/header_bg.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 0 -60px;
  background-repeat: no-repeat;
}

.avatar-info-wrap {
  height: 90px;
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: white;
  margin: 0 14px;
  margin-top: 25px;
  border-radius: 5px;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);

  .info-wrap {
    padding: 10px;
    height: 100%;

    span {
      height: 50%;
      display: flex;
      align-items: center;
    }

    > span:last-child {
      color: #a5a9b3;
    }
  }

  .avatar-wrap {
    height: 70px;
    width: 70px;

    > img {
      height: 100%;
      border-radius: 50%;
    }
  }
}

.service-header {
  text-align: center;
  height: 43px;
  color: white;
  font-size: 17px;

  .title {
    line-height: 43px;
  }
  .feedback {
    line-height: 43px;
    position: absolute;
    top: 0;
    right: 12px;
  }
}

.info-card,
.info-card2 {
  color: white;
  background-image: -webkit-linear-gradient(196deg, #f8d5c0, #ce8a70);
  background-image: linear-gradient(254deg, #f8d5c0, #ce8a70);
  margin: 15px;
  height: 100px;
  border-radius: 10px;
  position: relative;

  -webkit-box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.2);

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding: 14px;
    > div {
      height: 25px;
      line-height: 25px;
    }

    > div:first-child {
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    > div:nth-child(2) {
      color: hsla(0, 0%, 100%, 0.5);
    }

    > div > img {
      width: 24px;
      height: 24px;
    }
  }
}

.info-card2 {
  margin-top: 20px;
  background-image: -webkit-linear-gradient(16deg, #8ab3e2, #b5d0ef);
  background-image: linear-gradient(74deg, #8ab3e2, #b5d0ef);
}

.btn-next {
  position: absolute;
  height: 100%;
  top: calc(50% - 7px);
  right: 14px;

  > img {
    height: 14px;
    width: 14px;
  }
}
</style>
