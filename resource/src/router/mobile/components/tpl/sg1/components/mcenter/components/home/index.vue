<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']">
      <app-tip @close="showTip = false" />
      <avatar-info />
      <shortcut-info />
      <mem-list />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import shortcutInfo from "./components/shortcutInfo";
import memList from "./components/memList";
import avatarInfo from "./components/avatarInfo";
import appTip from "./components/appTip";
import { sendUmeng } from "@/lib/sendUmeng";
export default {
  components: {
    mobileContainer,
    shortcutInfo,
    avatarInfo,
    memList,
    appTip
  },
  data() {
    return {
      isShowAppTip: true
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus"
    }),
    headerConfig() {
      return {
        isMCenter: true,
        title: this.$text("S_INFORMATION", "我的")
      };
    }
  },
  created() {
    sendUmeng(24);
  },
  methods: {
    goMessage() {
      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
        return;
      }
      this.$router.push("/mobile/mcenter/information/message");
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: #f8f8f8;
}

.content-wrap {
  overflow-y: scroll;
}

.msg-icon {
  margin: 5px auto;
  width: 94%;
  height: 28px;

  img {
    float: right;
    width: 28px;
  }
}
</style>
