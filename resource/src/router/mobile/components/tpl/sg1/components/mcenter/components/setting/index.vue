<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" :class="$style['setting-wrap']">
      <div
        v-for="listInfo in list"
        :key="`list-${listInfo.name}`"
        :class="[
          $style.list,
          { [$style['list-part']]: listInfo.isPart },
          { [$style['list-border-bottom']]: !listInfo.isPart }
        ]"
        @click="listInfo.path && handleClick(listInfo.path)"
      >
        <template v-if="!listInfo.isVersion">
          <span> {{ listInfo.name }} </span>
          <div :class="$style['btn-next']">
            <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
          </div>
        </template>
        <template v-else>
          <span> {{ listInfo.name }} </span>
          <span>
            {{ version }}
          </span>
        </template>
      </div>
      <div :class="$style['logout']" @click="logout">
        {{
          activity.isActivity && activity.totalAmount > 0
            ? "退出(返回访客)"
            : "退出"
        }}
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import member from "@/api/member";
import mobileContainer from "../../../common/mobileContainer";
import { getCookie, setCookie } from "@/lib/cookie";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      list: [
        {
          name: this.$text("S_CHANGE_PASSWD", "代理登入"),
          path: "/mobile/resetPwd",
          isPart: true
        },
        {
          name: this.$text("S_FEEDBACK", "意见反馈"),
          path: "/mobile/mcenter/feedback/sendFeedback",
          isPart: false
        }
      ]
    };
  },
  mounted() {
    this.list.push({
      name: this.$text("S_CURRENT_VERSION", "当前版本"),
      path: "",
      isPart: true,
      isVersion: true
    });
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      version: "getVersion",
      activity: "getActivity"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_SETTING", "设置")
      };
    }
  },
  created() {
    if (!this.loginStatus || !getCookie("cid")) {
      this.$router.push("/mobile/home");
    }
  },
  methods: {
    handleClick(path) {
      this.$router.push(path);
    },
    logout() {
      member.logout().then(() => {});
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  background-color: #f8f8f8;
}

.setting-wrap {
  color: #414655;

  > div:first-child {
    margin-top: 5px;
  }

  .list {
    height: 50px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    background-color: #fefffe;
    border-bottom: 1px solid #eee;

    > span {
      width: 100%;
    }

    > span:last-child {
      text-align: right;
      padding-right: 14px;
    }
  }

  .btn-next {
    width: 14px;
    height: 100%;
    display: flex;
    align-items: center;
    > img {
      height: 14px;
      width: 14px;
    }
  }

  .logout {
    background-color: #fefffe;
    text-align: center;
    width: 100%;
    margin-top: 10px;
    height: 50px;
    line-height: 50px;
  }
}

.list-part {
  margin-bottom: 10px;
}

.list-border-bottom {
  border-bottom: 1px solid #eee;
}
</style>
