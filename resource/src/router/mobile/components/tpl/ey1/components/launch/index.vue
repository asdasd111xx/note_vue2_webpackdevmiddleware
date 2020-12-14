<template>
  <div :class="$style['container']">
    <img src="/static/image/ey1/common/loading.png" />
    <div :class="$style['timer']" @click="click">
      <span>{{ sec }}</span>
      <span>|</span>
      <span>跳过</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCookie, setCookie } from '@/lib/cookie';

export default {
  data() {
    return {
      timer: 0,
      sec: 3
    }
  },
  computed: {
    // ...mapGetters({
    //   memInfo: "getMemInfo"
    // }),
  },
  created() {
    //   初始化
    localStorage.removeItem('type');
    localStorage.removeItem('is-open-game');
    localStorage.removeItem('do-not-show-home-post');
    localStorage.removeItem('is-show-popup-announcement');
    localStorage.removeItem('mobile-slider');
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.sec === 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.$router.push('/mobile');
      }
      this.sec -= 1;
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    click() {
      clearInterval(this.timer);
      this.timer = null;
      this.$nextTick(() => {
        this.$router.push('/mobile');
      });
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.container {
  position: relative;
  height: 100vh;

  > img {
    width: 100%;
    height: 100%;
  }
}

@media (orientation: landscape) {
  .container > img {
    height: unset;
  }
}

.timer {
  position: absolute;
  top: 45px;
  right: 14px;
  background-color: #b3b3b3;
  width: 80px;
  border-radius: 10px;
  color: white;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  text-align: center;
}
</style>
