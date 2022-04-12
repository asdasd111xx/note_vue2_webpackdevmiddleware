<script>
//內嵌的iframe，透過common/iframe <iframe src=localhost:8787/game/lg_sport/1> 調用他
//進到這頁後(本身是iframe  jdb電子會getlocalstorage('open-game-link') 去做iframe內的畫面跳轉
//進到這樣拿到open-game-link，就會直接location.replace
//如果沒拿到就轉loading圈圈（ kent: this.$route.params 在這裡應該都用不到，都是舊專案的東西）
</script>
<template>
  <!-- pc版 mg遊戲嵌iframe -->
  <div>
    <message v-if="msg" :callback="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
    <div v-if="!isMobile && vendor === 'mg'" class="game-window">
      <iframe :src="urlData.url" class="game-iframe" />
      <div class="bet-record-btn" @click="onClick" />
    </div>
    <!-- pc版 sp -->
    <div v-else-if="!isMobile && vendor === 'sp'" class="game-window sunplus">
      <div class="rule-wrap">
        <span class="rule-link" @click="onClick">
          <icon name="question-circle" />{{
            rulesTitle[curLang] || rulesTitle["zh-cn"]
          }}
        </span>
      </div>
      <iframe :src="urlData.url" class="game-iframe" />
    </div>

    <div v-if="isLoading" class="loading-wrap">
      <div class="loading-item">
        <ele-loading />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import game from "@/api/game";
import isMobileFuc from "@/lib/is_mobile";
import message from "@/router/mobile/components/common/message";
import { getCookie } from "@/lib/cookie";
import openGame from "@/lib/open_game";

export default {
  components: {
    message,
    eleLoading: () =>
      import(
        /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/circle"
      )
  },
  data() {
    const isMobile = isMobileFuc();

    return {
      isLoading: true,
      isMobile,
      vendor: "",
      urlData: {},
      rulesTitle: this.$i18n.t("S_RULES"),
      msg: ""
    };
  },
  computed: {
    ...mapGetters({
      curLang: "getCurLang"
    })
  },
  created() {
    const { vendor, kind, code } = this.$route.params;
    if (vendor === "loading" && kind === "true") {
      return;
    }
    console.log("open-game-link", localStorage.getItem("open-game-link"));
    const temp = { kind };
    this.vendor = vendor;

    if (code) {
      temp.code = code;
    }

    if (localStorage.getItem("open-game-link")) {
      let openGameLink = localStorage.getItem("open-game-link");
      // localStorage.removeItem("open-game-link");
      this.isLoading = false;
      location.replace(openGameLink);
      localStorage.removeItem("iframe-third-url");
      return;
    } else {
      console.log("open-game-link 遺失");
    }
  },
  methods: {
    onClick() {
      // MG => 另開投注明細, SP => 另開規則說明
      window.open(this.urlData.url2, "bet record", "width=900, height=900");
    },
    clearMsg() {
      this.msg = "";
    }
  }
};
</script>

<style lang="scss" src="@/css/router/game.scss"></style>
<style lang="scss" scoped>
.loading-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  justify-content: center;
}

.loading-item {
  position: fixed;
  margin: 0 auto;
  top: 40%;
}
</style>
