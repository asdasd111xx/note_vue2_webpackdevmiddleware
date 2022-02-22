<template>
  <launch />
</template>

<script>
import launch from "@/router/mobile/components/common/launch";
export default {
  components: {
    launch
  },
  created() {
    // 泡泡直播首頁
    localStorage.removeItem("live-iframe-launch-home");
  }
};
</script>
<style lang="scss" module></style>
