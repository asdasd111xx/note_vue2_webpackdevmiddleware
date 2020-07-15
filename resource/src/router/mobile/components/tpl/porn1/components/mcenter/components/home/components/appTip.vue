<template >
  <div
    v-if="isShow && isIos && platform !== 'H'"
    :class="$style['app-tips']"
    :style="{ opacity: opacity }"
  >
    <span>收藏我们随时下载APP </span>
    <div>
      <span :class="$style['go-btn']" @click="handleClick">立即收藏</span>
      <img
        :src="$getCdnPath('/static/image/_new/common/btn_close.png')"
        @click="handleClose"
      />
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

export default {
  data() {
    return {
      isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      platform: '',
      isShow: true,
      opacity: 1
    };
  },
  computed: {
    ...mapGetters({

    }),
  },
  created() {
    let platform = getCookie('platform');
    this.platform = platform;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    handleClose() {
      this.opacity = 0;

      this.timer = setTimeout(() => {
        this.isShow = false;
        this.$emit("close");
      }, 300);
    },
    handleClick() {
      this.show = false;
      window.open('/mobile/install', "_blank")
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.app-tips {
  width: 100%;
  height: 34px;
  transition: opacity 0.25 linear;
  -webkit-transition: opacity 0.25s linear;
  -moz-transition: opacity 0.25s linear;
  -ms-transition: opacity 0.25s linear;
  -o-transition: opacity 0.25s linear;
  transition: opacity 0.25s linear;
  opacity: 1;
  background-color: #ececf2;
  padding: 0 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;

  > span:first-child {
    color: $main_text_color2;
  }

  img {
    height: 14px;
    width: 14px;
  }

  > div:last-child {
    display: flex;
    align-items: center;
    position: absolute;
    right: 14px;
  }
}

.go-btn {
  height: 23px;
  border: 1pt solid #be9e7f;
  border-radius: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #be9e7f;
  margin-right: 10px;
}
</style>
