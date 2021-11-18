<template>
  <div
    :class="$style['mcenter-avatar-info-wrap']"
    :style="{
      background: `url(${
        !loginStatus || paopaoUserInfo.background == ''
          ? '/static/image/sg1/mcenter/avatar_bg.png'
          : paopaoUserInfo.background
      })50% 0 / 86%
      no-repeat,
    #fff`
    }"
  >
    <!-- 大頭照 -->
    <div
      :class="$style['avatar-wrap']"
      @click="onListClick('memberCard', false)"
    >
      <img :class="$style['avatar-pic']" :src="avatarSrc" />
      <img
        v-if="loginStatus"
        :class="$style['avatar-circle']"
        :src="paopaoUserInfo.head_frame"
        alt=""
      />
    </div>

    <!-- 姓名/註冊 -->
    <div :class="$style['info-wrap']">
      <div @click.stop="onListClick('my_style')">
        <template v-if="loginStatus">
          <span v-for="(item, index) in badgesList" :key="index">
            <img :class="$style['badge']" :src="item" />
          </span>
          <span :class="$style['info-name']">
            {{ paopaoUserInfo.alias }}
          </span>
        </template>
        <template v-else>
          <span @click.stop="$router.push('/mobile/login')">
            点击{{ $text("S_LOG_IN_REGISTER", "登录/注册") }}
          </span>
        </template>
      </div>
    </div>
    <div :class="$style['level-wrap']" @click="onListClick('my_vip')">
      <span :class="$style['vip-level']">
        <img :src="$getCdnPath(`/static/image/sg1/mcenter/ic_crown.png`)" />
        LEVEL {{ viplevel }}
        <span style="marginLeft:2px; fontSize:7px ;color:#FFBC24;"> > </span>
      </span>
    </div>

    <div :class="$style['data-content']">
      <div :class="$style['follower']" @click="onListClick('my_track')">
        <span>{{ unloginString || paopaoUserInfo.track_total }}</span>
        追踪人数
      </div>
      <div :class="$style['favorite']" @click="onListClick('my_favorite')">
        <span>{{ unloginString || paopaoUserInfo.favorite_total }}</span>
        我的最爱
      </div>
      <div :class="$style['bubbles']" @click="onListClick('my_sent_paopao')">
        <span>{{ unloginString || paopaoUserInfo.paopao_total }}</span>
        送出泡泡
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getCookie, setCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";
import axios from "axios";

export default {
  components: {},
  props: {
    paopaoUserInfo: {
      type: Object,
      default: {
        alias: "",
        background: "",
        badges: [],
        diamond_total: "",
        favorite_total: "",
        head_frame: "",
        level: "",
        paopao_total: "",
        track_total: ""
      }
    }
  },
  data() {
    return {
      isShow: false,
      msg: "",
      viplevel: "",
      avatarSrc: `/static/image/common/default/avatar_nologin.png`
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      memCurrency: "getMemCurrency",
      memBalance: "getMemBalance",
      siteConfig: "getSiteConfig"
    }),
    badgesList() {
      if (this.paopaoUserInfo.badges && this.paopaoUserInfo.badges.length > 0) {
        return this.paopaoUserInfo.badges;
      }
      return [];
    },
    unloginString() {
      if (!this.loginStatus) {
        return "--";
      } else {
        return;
      }
    }
  },
  watch: {
    paopaoUserInfo() {
      console.log(this.paopaoUserInfo);
    }
  },
  mounted() {
    this.getUserViplevel();
    this.getAvatarSrc();
  },
  methods: {
    ...mapActions(["actionSetUserdata"]),
    onListClick(target, isLive = true) {
      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }

      if (isLive) {
        this.$router.push(`/mobile/live/iframe/${target}`);
      } else {
        this.$router.push(`/mobile/mcenter/${target}`);
      }
    },
    getAvatarSrc() {
      if (!this.loginStatus) return;

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: "get",
          url: this.memInfo.user.custom_image
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.avatarSrc = res.data.ret;
            }
          })
          .catch(error => {
            this.actionSetGlobalMessage({ msg: error.response.data.msg });
            this.avatarSrc = this.$getCdnPath(
              `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
      } else {
        this.avatarSrc = this.$getCdnPath(
          `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
        );
      }
    },
    getUserViplevel() {
      let cid = getCookie("cid");
      if (!cid) {
        return;
      }
      // yaboRequest({
      //   method: "get",
      //   url: `${
      //     this.siteConfig.YABO_API_DOMAIN
      //     }/player/vipinfo/${cid}`,
      //   headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //   this.viplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
      // });
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Player/vipinfo`,
        headers: {
          cid: cid
        }
      }).then(res => {
        this.viplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.mcenter-avatar-info-wrap {
  width: 100%;
  height: 310px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 0px 0px 10px 10px;
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.08);
  margin: 0 0 10px 0;
  padding: 10px;
  // background: url("/static/image/sg1/mcenter/avatar_bg.png") 50% 0 / 86%
  //     no-repeat,
  //   #fff;

  @media screen and (min-width: 800px) {
    background-size: 95% 45%;
  }
}

.badge {
  width: 20px;
  height: 20px;
}

.avatar-wrap {
  margin: 65px 0 20px 0;
  height: 82px;
  width: 82px;
  position: relative;
  .avatar-pic {
    height: 100%;
    border-radius: 50%;
    width: 82px;
  }

  .avatar-circle {
    position: absolute;
    width: 140px;
    left: -28px;
    top: -28px;
  }
}

.info-wrap {
  width: 100%;
  margin-bottom: 10px;
  .info-name {
    font-size: 22px;
  }
}

.vip-level {
  font-size: 14px;
  color: #ffbc24;
  text-align: center;
  height: 30px;
  border-radius: 25px;
  background: #000;
  padding: 10px;
  display: flex;
  align-items: center;

  img:first-child {
    width: 20px;
    height: 20px;
  }
  img {
    width: 10px;
    height: 10px;
  }
}

.data-content {
  margin-top: 15px;
  border-top: 1px solid #eeeeee;
  width: 100%;
  display: flex;
  justify-content: space-around;
  color: #939393;
  padding: 10px 0;
  font-size: 12px;
  span {
    display: block;
    font-size: 16px;
  }
}
</style>
