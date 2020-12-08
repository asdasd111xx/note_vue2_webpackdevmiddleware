import { getCookie } from "@/lib/cookie";
import goLangApiRequest from '@/api/goLangApiRequest';
import { mapGetters } from "vuex";
import yaboRequest from "@/api/yaboRequest";

export default {
  data() {
    return {
      currentConfigID: 0,
      userVipInfo: null,
      vipLevelList: [],
      currentLevelData: {}
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus"
    }),
    setCurrentLevel: {
      get() {
        return this.currentLevelData;
      },
      set(value) {
        this.currentLevelData = value;
      }
    }
  },
  methods: {
    getUserDetail() {
      // yaboRequest({
      //   method: "get",
      //   url: `${this.siteConfig.YABO_API_DOMAIN}/player/vipinfo/${getCookie(
      //     "cid"
      //   )}`,
      //   headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //   console.log(res);
      //   this.userVipInfo = res.data;

      //   // 起始預設 config_id 為分類中的第一筆
      //   this.currentConfigID = this.userVipInfo[0].config_id;
      // });
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/Player/vipinfo`,
        headers: {
          "cid": getCookie("cid")
        }
      }).then(res => {
        this.userVipInfo = res.data;

        // 起始預設 config_id 為分類中的第一筆
        this.currentConfigID = this.userVipInfo[0].config_id;
      });
    },
    getVipLevel() {
      if (!this.loginStatus || !getCookie("cid")) {
        this.$router.push("/mobile/login");
      }

      // 依vip分類回傳所有等級清單(不分⾴)
      // yaboRequest({
      //   method: "get",
      //   url: `${this.siteConfig.YABO_API_DOMAIN}/player/viplevel/${getCookie(
      //     "cid"
      //   )}?configId=${this.currentConfigID}`,
      //   headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //   this.vipLevelList = res.data;
      // });

      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/Player/viplevel/${this.currentConfigID}`,
        headers: {
          "cid": getCookie("cid")
        }
      }).then(res => {
        this.vipLevelList = res.data;
      });
    },
    handleConfigId(value) {
      this.currentConfigID = value;
    }
  },
  watch: {
    currentConfigID() {
      this.getVipLevel();
    }
  }
}
