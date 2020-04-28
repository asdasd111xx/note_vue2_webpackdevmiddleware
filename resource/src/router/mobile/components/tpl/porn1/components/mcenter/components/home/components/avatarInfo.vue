<template>
  <div
    :class="$style['mcenter-avatar-info-wrap']"
    @click="
      loginStatus
        ? $router.push('/mobile/mcenter/accountData')
        : $router.push('/mobile/login')
    "
  >
    <message v-if="msg" @close="msg = ''"
      ><div slot="msg">{{ msg }}</div>
    </message>

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
          <span :class="$style['vip-level']">
            {{ viplevel }}
          </span>
        </template>
        <template v-else>
          <span @click="$router.push('/mobile/joinmember')">
            点击{{ $text("S_LOG_IN_REGISTER", "登录/注册") }}
          </span>
        </template>
      </div>
      <div>
        <span>观影60秒计时奖励</span>
        <!-- <img
            :src="$getCdnPath(`/static/image/_new/theme3/${info.key}.png`)"
          /> -->
        <span :class="$style['money-symbol']">¥</span>
        <span>
          最高送6元
        </span>
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
import message from '../../../../common/new/message'
export default {
  components: {
    message
  },
  data() {
    return {
      isShow: false,
      msg: "",
      imgID: 0,
      imgIndex: 0,
      viplevel: "",
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
      memBalance: 'getMemBalance'
    }),
    avatarSrc() {
      return !this.loginStatus ?
        this.$getCdnPath(`/static/image/_new/mcenter/avatar_nologin.png`) :
        this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${this.imgIndex}.png`)
    }
  },
  created() {
    this.getVipInfo();
    if (this.memInfo.user.image === 0 || !(this.memInfo.user.image)) {
      this.imgIndex = 0;
      this.imgID = 0;
      return;
    }
    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    getVipInfo() {
      mcenter.vipUserDetail({
        success: (res) => {
          if (res && res.ret && res.ret[0]) {
            this.viplevel = "VIP" + res.ret[0].now_level_id;
          }
        }
      });
    },
    // 大頭貼
    selectAvatar() {
      if (this.memInfo.user.image === this.imgID) {
        this.dialogShow();
        return;
      }

      mcenter.accountDataSet({
        params: { image: this.imgID },
        success: () => {
          this.actionSetUserdata();
          this.dialogShow();
          this.imgIndex = this.imgID;
        }
      });
    },
    selectImg(index) {
      this.imgID = index + 1;
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
  margin: 0 8px 0 11px;
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
