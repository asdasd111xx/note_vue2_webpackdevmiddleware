<template>
  <div :class="$style['mcenter-info-wrap']"></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import mcenter from '@/api/mcenter';
import member from '@/api/member';

export default {
  data() {
    return {
      list: [
        { path: '', pageName: 'deposit' }, // 存款
        { path: '/mobile/mcenter/balanceTrans', pageName: 'bankBalanceTran' }, // 額度轉換
        { path: '/mobile/mcenter/withdraw', pageName: 'withdraw' }, // 取款
        { path: '/mobile/mcenter/accountVip', pageName: 'accountVip' } // VIP
      ],
      vipData: {},
      createdTime: '',
      isShow: false,
      avatar: [
        { image: 'avatar_1', url: '/static/image/mobile/tpl/porn1/home/avatar_1.png' },
        { image: 'avatar_2', url: '/static/image/mobile/tpl/porn1/home/avatar_2.png' },
        { image: 'avatar_3', url: '/static/image/mobile/tpl/porn1/home/avatar_3.png' },
        { image: 'avatar_4', url: '/static/image/mobile/tpl/porn1/home/avatar_4.png' },
        { image: 'avatar_5', url: '/static/image/mobile/tpl/porn1/home/avatar_5.png' },
        { image: 'avatar_6', url: '/static/image/mobile/tpl/porn1/home/avatar_6.png' }
      ],
      imgID: 0,
      imgIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      memCurrency: 'getMemCurrency',
      memBalance: 'getMemBalance'
    })
  },
  created() {
    mcenter.accountVIP({
      success: (res) => {
        this.vipData = {
          ...res.ret
        };
      }
    });
    member.data({
      success: (res) => {
        this.countDays(res.ret.user.created_at);
      }
    });

    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    onListClick(listIndex) {
      const item = this.list[listIndex];

      if (!this.loginStatus) {
        this.goLogin();
        return;
      }
      if (item.pageName === 'deposit') {
        this.$depositLink(true);
        return;
      }

      mcenterPageAuthControl(item.pageName).then((response) => {
        if (response && response.status) {
          this.$router.push(item.path);
        }
      });
    },
    goLogin() {
      this.$router.push('/mobile/login');
    },
    goAccountData() {
      if (!this.loginStatus) {
        this.goLogin();
        return;
      }
      this.$router.push('/mobile/mcenter/accountData');
    },
    countDays(ceatedTime) {
      const startTime = moment(ceatedTime);
      const now = moment(new Date());

      this.createdTime = now.diff(startTime, 'days') + 1;
    },
    dialogShow() {
      this.isShow = !this.isShow;
    },
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

.mcenter-info-wrap {
  margin: 0 auto;
  border-radius: 9px;
  background: #f8f1eb;
  width: 94%;
  height: 103px;
  font-size: 12px;
  .mcenter-info-header {
    padding: 5px 0;
    background: url("/static/image/mobile/tpl/porn1/home/vip_header_bg.png") 0 0
      no-repeat;
    background-size: 100%;
    .avatar {
      float: left;
      margin: 3px 0 0 2%;
      width: 28px;
      position: relative;
      img {
        border-radius: 50%;
        width: 100%;
      }

      .avata-icon {
        position: absolute;
        right: -5px;
        bottom: 4px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
      }

      svg {
        width: 10px;
        height: 10px;
        position: absolute;
        top: 1px;
        left: 1px;
      }
    }
  }
  .mcenter-info-tips {
    float: left;
    margin: 1px 0 0 2%;
    line-height: 16px;
    .member-name,
    .vip-level {
      float: left;
      color: #5c4030;
    }
    .vip-level {
      padding: 0 5px;
      margin-left: 4px;
      background: url("/static/image/mobile/tpl/porn1/home/vip_level_bg.png") 0
        0 no-repeat;
      background-size: 100%;
      color: #f8f1eb;
    }
    .join-days {
      margin-top: 2px;
      color: #9c6e54;
    }
  }
}
.login-view {
  position: relative;
  float: left;
  padding: 0 3px;
  margin: 8px 0 0 1%;
  width: 30%;
  line-height: 18px;
  color: #77674d;
  img,
  span {
    display: block;
  }
  img {
    margin: 0 auto;
    width: 28px;
    height: 28px;
  }
  span {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .money {
    line-height: 28px;
  }
}
.login-view::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -1px;
  background: #efdfd1;
  width: 1px;
  height: 120px;
}
.info-btn-wrap {
  float: left;
  margin-top: 8px;
  width: 67%;
  min-height: 42px;
  &.is-full {
    div {
      width: 25%;
    }
  }
  div {
    float: left;
    height: 43px;
    width: 33%;
    padding: 0 7px;
    color: #77674d;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 5px;
    img {
      margin: 0 auto;
      width: 28px;
      height: 28px;
      display: block;
    }
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      color: #2d477e;
      display: block;
    }
  }
}

// avatar dialog
.dialog-mask,
.dialog-wrap {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  background: #000;
  z-index: 999;
}
.dialog-mask {
  width: 100%;
  height: 100%;
  opacity: 0.5;
}
.dialog-wrap {
  top: 40%;
  left: 50%;
  border-radius: 10px;
  padding: 10px;
  background: #f8f1eb;
  width: 90%;
  color: #999;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  .avatar-wrap {
    position: relative;
    float: left;
    margin: 6px 1%;
    background: url("/static/image/mobile/tpl/porn1/home/avatar_bg.png") 0 0
      no-repeat;
    background-size: 100%;
    width: 31%;
    text-align: center;
    img {
      border-radius: 50%;
      margin-top: 5%;
      width: 90%;
    }
    .check {
      position: absolute;
      bottom: -6%;
      left: 50%;
      background: url("/static/image/mobile/tpl/porn1/home/check_icon.png") 0 0
        no-repeat;
      background-size: 100%;
      width: 30%;
      height: 29%;
      -webkit-transform: translate(-50%, 0);
      transform: translate(-50%, 0);
    }
  }
}

@media screen and (min-width: $pad) {
  .mcenter-info-wrap {
    font-size: 14px;
  }

  .info-btn-wrap {
    div {
      height: 48px;
    }
  }
}
</style>
