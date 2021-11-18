<template>
  <div
    :class="$style['mcenter-avatar-info-wrap']"
    :style="{
      background: `url(${
        cardInfoTop.background == ''
          ? '/static/image/sg1/mcenter/avatar_bg.png'
          : cardInfoTop.background
      })50% 0 / 86%
      no-repeat,
    #fff`
    }"
  >
    <!-- 大頭照 -->
    <div :class="$style['avatar-wrap']">
      <img :class="$style['avatar-pic']" :src="avatarSrc" />
      <!-- <img
        v-if="loginStatus"
        :class="$style['avatar-circle']"
        :src="$getCdnPath(`/static/image/sg1/mcenter/avatar_frame.png`)"
        alt=""
      /> -->
    </div>

    <!-- 姓名/註冊 -->
    <div :class="$style['info-wrap']">
      <div>
        <template v-if="loginStatus">
          <span v-for="(item, index) in badgesList" :key="index">
            <img :class="$style['badge']" :src="item" />
          </span>
          <span :class="$style['info-name']">
            {{ cardInfo.alias }}
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
        LEVEL {{ cardInfoTop.level }}
        <span style="marginLeft:2px; fontSize:7px ;color:#FFBC24;"> > </span>
      </span>
    </div>

    <div :class="$style['data-content']">
      <div :class="$style['follower']" @click="onListClick('my_track')">
        <span>{{ cardInfoTop.track_toatl || 0 }}</span>
        追踪人数
      </div>
      <div :class="$style['tool']" @click="onListClick('my_props')">
        <span>{{ cardInfoTop.prop_num || 0 }}</span>
        道具
      </div>
    </div>
    <div :class="$style['data-content']">
      <p :class="$style['motto']">
        {{ cardInfo.intro == "" ? "TA好像忘记签名了" : cardInfo.intro }}
      </p>
    </div>
    <div :class="$style['about']">
      <h3>个人信息</h3>

      <li>
        <i
          ><img
            src="/static/image/sg1/mcenter/memberCard/ic_member.png"
            alt=""/></i
        >会员帐号 <span style="margin-left: 35px;">{{ cardInfo.alias }}</span>
      </li>
      <li>
        <i
          ><img
            src="/static/image/sg1/mcenter/memberCard/ic_birthday.png"
            alt=""/></i
        >生日<span>{{
          memInfo.user.birthday == "" ? "尚未設定" : memInfo.user.birthday
        }}</span>
      </li>
      <li>
        <i
          ><img
            src="/static/image/sg1/mcenter/memberCard/ic_location.png"
            alt=""/></i
        >地区
        <span>{{
          cardInfo.hometown == "" ? "尚未設定" : cardInfo.hometown
        }}</span>
      </li>
      <li>
        <i
          ><img
            src="/static/image/sg1/mcenter/memberCard/ic_love.png"
            alt=""/></i
        >感情
        <span>{{
          cardInfo.relationship == "" ? "尚未設定" : cardInfo.relationship
        }}</span>
      </li>
    </div>
    <div :class="$style['recommand-wrap']">
      <div v-if="getAgentLink" :class="$style['qrcode-wrap']">
        <qrcode
          :value="getAgentLink"
          :options="{ width: 105, margin: 1 }"
          tag="img"
        />
      </div>
      <div v-else :class="$style['empty-qrcode-wrap']"></div>
      <div :class="$style['button-wrap']">
        <div @click="onQrcodeOpen">
          <span :class="$style['button-text-1']">{{
            $text("S_DOWNLOAD_QRCODE", "下载二维码")
          }}</span>
        </div>
        <div @click="onCopy('LINK')">
          <span :class="$style['button-text-2']">{{
            $text("S_COPY_PROMOTION_LINK", "复制推广连结")
          }}</span>
        </div>
      </div>
    </div>

    <!-- 連結複製提示與 QR Code -->
    <popup
      v-if="isPopup"
      :type="popupType"
      :link="getAgentLink"
      @close="onPopupClose"
    />

    <div :class="$style['go-edit']" @click="onListClick('accountData', false)">
      编辑资料
    </div>
  </div>
</template>

<script>
import friendsRecommend from "@/mixins/mcenter/management/friendsRecommend";
import promoteFunction from "@/mixins/mcenter/management/promoteFunction";
import { mapGetters, mapActions } from "vuex";
import { getCookie, setCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";
import axios from "axios";

export default {
  components: {
    popup: () => import(/* webpackChunkName: 'popup' */ "./popup/index")
  },
  mixins: [friendsRecommend, promoteFunction],
  props: {
    //名片上方追蹤人數
    cardInfoTop: {
      type: Object,
      default: {}
    },
    //個人信息
    cardInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isShow: false,
      msg: "",
      viplevel: "",
      avatarSrc: `/static/image/common/default/avatar_nologin.png`,
      landingLink: ""
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      memCurrency: "getMemCurrency",
      memBalance: "getMemBalance",
      agentLink: "getAgentLink",
      siteConfig: "getSiteConfig",
      promotionLink: "getPromotionLink"
    }),
    getAgentLink() {
      if (this.promotionLink) {
        return this.promotionLink;
      }

      if (!this.agentLink.domain || !this.agentLink.agentCode) {
        return "";
      }

      return `https://${this.agentLink.domain}/a/${this.agentLink.agentCode}`;
    },
    badgesList() {
      return this.cardInfoTop.badges;
    }
  },
  mounted() {
    this.getUserViplevel();
    this.getAvatarSrc();
    if (this.loginStatus) {
      // 已登入：註冊頁
      this.actionSetAgentLink();
    }
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetAgentLink"]),
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
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  // background: url("/static/image/sg1/mcenter/avatar_bg.png") 50% 0 / 86%
  //     no-repeat,
  //   #fff;

  @media screen and (min-width: 800px) {
    background-size: 95% 15%;
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
  margin-top: 8px;
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

  .motto {
    margin: 5px 0;
    background-color: #ededed;
    color: #939393;
    padding: 5px 10px;
    border-radius: 15px;
  }
}

.about {
  text-align: left;
  margin-right: auto;
  padding: 0px 15px;
  h3 {
    font-size: 14px;
  }

  li {
    list-style: none;
    color: #939393;
    font-size: 12px;
    i {
      margin-right: 5px;
    }
    span {
      margin-left: 60px;
    }
  }
}

.empty-qrcode-wrap {
  width: 105px;
  height: 105px;
  background-color: #ededed;
  opacity: 0.3;
}
.recommand-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  .button-wrap {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-left: 15px;

    .button-text-1 {
      padding: 5px 25px;
      border-radius: 15px;
      border: 1px solid #000;
      background-color: #eee;
      color: #000;
    }

    .button-text-2 {
      padding: 5px 20px;
      border-radius: 15px;
      border: 1px solid #000;
      background-color: #eee;
      color: #000;
    }
  }
}

.go-edit {
  background-color: #000;
  color: #fff;
  font-size: 14px;
  border-radius: 23px;
  width: 90%;
  margin: 0px auto;
  text-align: center;
  padding: 10px 0;
}
</style>
