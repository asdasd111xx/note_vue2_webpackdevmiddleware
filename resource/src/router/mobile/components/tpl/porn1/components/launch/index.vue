<template>
  <div :class="$style['container']">
    <img src="/static/image/_new/common/loading.png" />
    <div :class="$style['timer']" @click="click">
      <span>{{ sec }}</span>
      <span>|</span>
      <span>跳过</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.sec === 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.$router.push('/mobile/');
      }
      this.sec -= 1;
    }, 1000)
  },
  methods: {
    click() {
      this.$router.push('/mobile/');
    }
  },
};
</script>

<style lang="scss" module>
.container {
  position: relative;

  > img {
    width: 100%;
    height: 100%;
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
