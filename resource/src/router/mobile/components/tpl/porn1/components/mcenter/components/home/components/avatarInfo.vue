<template>
  <div
    :class="$style['mcenter-avatar-info-wrap']"
    @click="
      loginStatus
        ? $router.push('/mobile/mcenter/accountData')
        : $router.push('/mobile/login')
    "
  >
    <!-- 大頭照 -->
    <div :class="$style['avatar-wrap']">
      <img :src="avatarSrc" />
    </div>

    <!-- 姓名/註冊 -->
    <div :class="$style['info-wrap']">
      <div>
        <template v-if="loginStatus">
          <span>
            {{
              memInfo.user.show_alias
                ? memInfo.user.alias
                : memInfo.user.username
            }}
          </span>
          <span :class="$style['vip-level']"> VIP{{ viplevel }} </span>
        </template>
        <template v-else>
          <span @click.stop="$router.push('/mobile/login')">
            点击{{ $text("S_LOG_IN_REGISTER", "登录/注册") }}
          </span>
        </template>
      </div>
      <!-- <div v-if="!loginStatus">
        <span> 观影60秒计时奖励 </span>
        <span :class="$style['money-symbol']">¥</span>
        <span> 彩金分分送 </span>
      </div> -->
      <div>
        <span> 观影60秒计时奖励 </span>
        <span :class="$style['money-symbol']">¥</span>
        <span> 最高送999元 </span>
      </div>
    </div>
    <div :class="$style['btn-next']">
      <img :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import { getCookie, setCookie } from '@/lib/cookie';
import yaboRequest from '@/api/yaboRequest';
import axios from 'axios';

export default {
  components: {
  },
  data() {
    return {
      isShow: false,
      msg: "",
      imgID: 0,
      imgIndex: 0,
      viplevel: "",
      avatarSrc: `/static/image/_new/mcenter/avatar_nologin.png`,
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
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      memCurrency: 'getMemCurrency',
      memBalance: 'getMemBalance',
      siteConfig: "getSiteConfig",
    }),
  },
  created() {
    if (this.memInfo.user.image === 0 || !(this.memInfo.user.image)) {
      this.imgIndex = 1;
      this.imgID = 1;
      return;
    }

    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;
  },
  mounted() {
    this.getUserViplevel();
    this.getAvatarSrc();
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    getAvatarSrc() {
      if (!this.loginStatus) return;

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: 'get',
          url: this.memInfo.user.custom_image,
        }).then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.avatarSrc = res.data.ret;
          }
        }).catch(error => {
          this.actionSetGlobalMessage({ msg: error.data.msg });
          this.avatarSrc = this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`);
        })
      } else {
        this.avatarSrc = this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`);
      }
    },
    getUserViplevel() {
      let cid = getCookie("cid");
      if (!cid) { return }
      yaboRequest({
        method: "get",
        url: `${
          this.siteConfig.YABO_API_DOMAIN
          }/player/vipinfo/${cid}`,
        headers: { "x-domain": this.memInfo.user.domain }
      }).then(res => {
        this.viplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
      });
    },
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.mcenter-avatar-info-wrap {
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background-color: #fefffe;
}

.avatar-wrap {
  height: 70px;
  width: 70px;

  > img {
    height: 100%;
    border-radius: 50%;
    width: 70px;
  }
}

.money-symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 18px;
  border-radius: 50%;
  color: white;
  width: 18px;
  height: 18px;
  background: #ff8900;
  border: 2pt solid #fecf34;
  margin: 0 5px;
}

.info-wrap {
  height: 70px;
  padding: 10px 9px;
  width: 100%;

  > div {
    text-align: left;
    font-size: 15px;
    height: 50%;
    display: flex;
    align-items: center;
    line-height: 50%;
  }

  div:last-of-type {
    color: $main_text_color1;
    font-size: 12px;
    height: 50%;

    span:last-of-type {
      color: $main_vip_color1;
    }
  }
}
.btn-next {
  > img {
    height: 20px;
    width: 20px;
  }
}

.vip-level {
  margin-left: 5px;
  font-size: 11px;
  line-height: 17px;
  height: 17px;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
  width: 40px;
  border-radius: 4px;
  background: -webkit-linear-gradient(left, #eeddd0, #d5b69c);
  background: -o-linear-gradient(right, #eeddd0, #d5b69c);
  background: -moz-linear-gradient(right, #eeddd0, #d5b69c);
  background: linear-gradient(to right, #eeddd0, #d5b69c);
}
</style>
