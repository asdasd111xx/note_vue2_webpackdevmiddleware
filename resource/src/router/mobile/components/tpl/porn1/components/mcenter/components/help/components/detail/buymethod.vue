<template>
  <div slot="content">
    <div
      v-for="(item, index) in categorys.list"
      :id="`q-${index}`"
      :class="$style['cell2']"
      :key="`q-${index}`"
    >
      <div :class="$style['title']">
        <span v-html="item.text"> </span>
      </div>

      <div :class="$style['cell2-step']">
        <img
          :src="
            $getCdnPath(
              `/static/image/porn1/mcenter/help/swag/tutorial_deposit_swag_0${
                index + 1
              }.png`
            )
          "
        />
      </div>
    </div>

    <div :class="$style['gotop']" @click="toTop" v-if="showgo">
      <img
        :src="
          $getCdnPath(`/static/image/porn1/mcenter/help/deposit/btn_gotop.png`)
        "
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import member from "@/api/member";
import { getCookie } from "@/lib/cookie";

export default {
  components: {},
  data() {
    return {
      showgo: false,
      category_isShowPop: false,

      categorys:
      {
        list: [
          { text: "进入购买钻石页面后，选择您想要的钻石兑换数量，点击立即兑换即可成功购买钻石！" },
          { text: "购买SWAG钻石，您需要使用鸭博娱乐点数进行兑换您可以从以下三个地方进入购买页面查看并兑换<br>1.SWAG<br>路径：点击右上角钻石" },
          { text: "2.转帐页<br>路径：首页→转帐 OR 我的钱包→转帐" },
          { text: "3.我的钱包" },
        ],
      },
    };
  },

  mounted() {

    let vm = this;
    $("#mobile-wrap").scroll(function () {
      if ($(this).scrollTop() > 1) {
        vm.showgo = true;
      } else {
        vm.showgo = false;
      }
    });
  },
  methods: {
    toTop() {
      if ($("#mobile-wrap").scrollTop() < 30) {
        $("#mobile-wrap").animate({ scrollTop: 0 }, 200);
      } else {
        $("#mobile-wrap").animate({ scrollTop: 0 }, 1000);
      }
    },
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
    }),
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_HELP_CENTER", "帮助中心"),
      };
    },
  },
};
</script>
<style lang="scss" module>
@import "../../css/index.module.scss";
.title {
  padding-top: 20px;
  color: #414655;
}
</style>
