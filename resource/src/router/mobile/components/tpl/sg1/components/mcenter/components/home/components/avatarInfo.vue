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
      <img :class="$style['avatar-pic']" :src="avatarSrc" />
      <img
        v-if="loginStatus"
        :class="$style['avatar-circle']"
        :src="$getCdnPath(`/static/image/sg1/mcenter/avatar_frame.png`)"
        alt=""
      />
    </div>

    <!-- 姓名/註冊 -->
    <div :class="$style['info-wrap']">
      <div>
        <template v-if="loginStatus">
          <span :class="$style['info-name']">
            {{
              memInfo.user.show_alias
                ? memInfo.user.alias
                : memInfo.user.username
            }}
          </span>
        </template>
        <template v-else>
          <span @click.stop="$router.push('/mobile/login')">
            点击{{ $text("S_LOG_IN_REGISTER", "登录/注册") }}
          </span>
        </template>
      </div>
    </div>
    <div :class="$style['level-wrap']">
      <span :class="$style['vip-level']">
        <img :src="$getCdnPath(`/static/image/sg1/mcenter/ic_crown.png`)" />
        LEVEL {{ viplevel }}
        <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
      </span>
    </div>

    <div :class="$style['data-content']">
      <div :class="$style['follower']"><span>3423566</span>追踪人数</div>
      <div :class="$style['favorite']"><span>56</span>我的最爱</div>
      <div :class="$style['bubbles']"><span>342654375</span>送出泡泡</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import mcenter from "@/api/mcenter";
import member from "@/api/member";
import { getCookie, setCookie } from "@/lib/cookie";
import yaboRequest from "@/api/yaboRequest";
import goLangApiRequest from "@/api/goLangApiRequest";
import axios from "axios";

export default {
  components: {},
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
    })
  },
  mounted() {
    this.getUserViplevel();
    this.getAvatarSrc();
  },
  methods: {
    ...mapActions(["actionSetUserdata"]),
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
  margin: 0 0 5px 0;
  padding: 10px;
  background: url("/static/image/sg1/mcenter/avatar_bg.png") 50% 0 / 86%
      no-repeat,
    #fff;

  @media screen and (min-width: 800px) {
    background-size: 95% 45%;
  }
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
