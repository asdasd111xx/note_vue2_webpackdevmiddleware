<template>
  <div :class="$style['mcenter-avatar-info-wrap']">
    <img
      :class="$style['avatar']"
      :src="$getCdnPath(`/static/image/_new/mcenter/avatar_nologin.png`)"
    />
    <div :class="$style['info-wrap']">
      <div>
        <template v-if="loginStatus">
          <span>NAME </span>
        </template>
        <template v-else>
          <span> 点击{{ $text("S_LOG_IN_REGISTER", "登录/注册") }} </span>
        </template>
      </div>
      <div>
        <span>观影60秒计时奖励</span>
        <!-- <img
            :src="$getCdnPath(`/static/image/_new/theme3/${info.key}.png`)"
          /> -->
        <span>¥</span>
        <span>
          最高送6元
        </span>
      </div>
    </div>
    <div :class="$style['btn-next']" @click="handleClickLogin">
      <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
    </div>
  </div>
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
      return this.$getCdnPath(`/static/image/_new/mcenter/avatar_nologin.png`)
    }
  },
  created() {

  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    handleClickLogin() {
      $router.push('/mobile/joinmember')
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.mcenter-avatar-info-wrap {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 14px;
}

.avatar {
  height: 70px;
  width: 70px;
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
  }

  div:last-of-type {
    text-align: left;
    color: $main_text_color1;
    font-size: 12px;
    height: 50%;
    display: flex;
    align-items: center;

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
</style>
