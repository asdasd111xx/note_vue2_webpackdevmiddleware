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
      <template v-if="loginStatus">
        <div>
          <span>
            {{
              memInfo.user.show_alias
                ? memInfo.user.alias
                : memInfo.user.username
            }}
          </span>
          <span :class="$style['vip-level']"> VIP{{ viplevel }} </span>
        </div>

        <div>
          {{ `加入亿元第${day}天` }}
        </div>
      </template>

      <template v-else>
        <p @click.stop="$router.push('/mobile/login')">
          点击{{ $text("S_LOG_IN_REGISTER", "登录/注册") }}
        </p>
      </template>
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
import Vue from "vue";
import EST from '@/lib/EST';

export default {
  data() {
    return {
      isShow: false,
      msg: "",
      viplevel: "",
      avatarSrc: `/static/image/_new/mcenter/avatar_nologin.png`,
      day: ""
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
    if (this.loginStatus) {
      const today = Vue.moment(new Date());
      this.day = Number(today.diff(Vue.moment(this.memInfo.user.created_at), 'days')) + 1;
    }
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
            this.actionSetGlobalMessage({ msg: error.data.msg });
            this.avatarSrc = this.$getCdnPath(
              `/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
      } else {
        this.avatarSrc = this.$getCdnPath(
          `/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`
        );
      }
    },
    getUserViplevel() {
      let cid = getCookie("cid");
      if (!cid) {
        return;
      }
      yaboRequest({
        method: "get",
        url: `${this.siteConfig.YABO_API_DOMAIN}/player/vipinfo/${cid}`,
        headers: { "x-domain": this.memInfo.user.domain }
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

.info-wrap {
  padding: 10px 9px;
  width: 100%;
  font-size: 15px;

  > div {
    display: flex;
    align-items: center;
    padding: 5px 0;
  }

  div:last-of-type {
    color: #9ca3bf;
    font-size: 12px;
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
  background: -webkit-linear-gradient(left, #ffd68a, #fe9154);
  background: -o-linear-gradient(right, #ffd68a, #fe9154);
  background: -moz-linear-gradient(right, #ffd68a, #fe9154);
  background: linear-gradient(to right, #ffd68a, #fe9154);
}
</style>
