<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']"></div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import member from "@/api/member";
import mobileContainer from '../../../../common/new/mobileContainer';

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      data: [
        {
          title: "体育赛事",
          list: [
            "体育投注结算的时间?",
            "体育投注危险球定义是什么?",
            "在以下的状况，会员所下注注单将会被取消，而会员所下注的金额将会全数退回?",
            "在以下这几种状况将会释放危险球，而会员在危险球下注的注单都会这当时下注的盘口、赔率和金额为准?",
            "体育赛事中断?",
            "体育投注金额?",
            "什么是让球盘?",
            "什么是1x2 (独赢盘) ?",
            "什么是波胆?",
            "什么是连串过关?",
            ""
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_GAME_INTR", "游戏介绍")
      };
    }
  }
};
</script>
<style src="../css/index.module.scss" lang="scss" module>
