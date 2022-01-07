<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']">
      <app-tip @close="showTip = false" />
      <avatar-info
        :paopao-user-info="paopaoUserInfo"
        @showMaintainInfo="showMaintainInfo"
      />
      <shortcut-info
        :paopao-user-info="paopaoUserInfo"
        @showMaintainInfo="showMaintainInfo"
      />
      <mem-list />
      <maintain-block
        v-if="isShowMaintainInfo"
        :content="maintainInfo"
        @close="handleCloseMaintainInfo"
      />
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
import maintainBlock from "@/router/mobile/components/common/maintainBlock";
import moment from "moment";

export default {
  components: {
    mobileContainer,
    shortcutInfo,
    avatarInfo,
    memList,
    appTip,
    maintainBlock
  },
  data() {
    return {
      isShowAppTip: true,
      paopaoUserInfo: {},
      isShowMaintainInfo: false,
      maintainInfo: {}
    };
  },
  watch: {
    liveMaintain(val) {
      if (val && val.start) {
        this.isMaintain = true;
      } else {
        this.isMaintain = false;
      }
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      liveMaintain: "getLiveMaintain"
    }),
    headerConfig() {
      return {
        isMCenter: true,
        title: this.$text("S_INFORMATION", "我的")
      };
    }
  },
  created() {
    this.isShowMaintainInfo = true;
    if (this.loginStatus) {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/front-page",
        method: "get"
      }).then(data => {
        if (data && data.result) {
          this.paopaoUserInfo = data.result;
        } else {
          if (data && data.error_text) {
            this.actionSetGlobalMessage({
              msg: data.error_text,
              code: data.error_code
            });
          }
        }
      });
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    handleCloseMaintainInfo() {
      this.isShowMaintainInfo = false;
      this.maintainInfo = null;
    },
    showMaintainInfo() {
      this.isShowMaintainInfo = true;

      const start = moment(this.liveMaintain.start * 1000)
        .add(-12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      const end = moment(this.liveMaintain.end * 1000)
        .add(-12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      this.maintainInfo = [
        {
          title: "-美东时间-",
          startAt: start,
          endAt: end
        },
        {
          title: "-北京时间-",
          startAt: moment(),
          endAt: moment()
        }
      ];
    },
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
