import { getDoamin } from "@/lib/getCurrentDoamin";
import store from "@/store";
import versionFile from "@/config/version.json";

// 404 500 upup no_service domain判斷
export default {
  data() {
    return {
      themeTPL: "",
      domain: {
        domain: "",
        site: "porn1"
      },
      version: ""
    };
  },
  created() {
    getDoamin().then(res => {
      this.domain = res || "";
      this.themeTPL = res && res.site ? res.site : "porn1";
    });

    if (versionFile) {
      this.version = versionFile;
    }
  },
  methods: {
    linkToService() {
      let on_service_url =
        store &&
        store.state &&
        store.state.webInfo &&
        store.state.webInfo.on_service_url;
      localStorage.setItem(
        "serviceUrl",
        on_service_url ||
          "https://yaboxxxcs.net/chat/text/chat_1A09E4.html?skill=8ae482827375169c017375f1528b2446"
      );

      if (this.domain.site === "ey1") {
        window.location.href = `/static/upup/ey1/index.html?username=${this.username}`;
      } else if (this.domain.site === "porn1") {
        window.location.href = `/static/upup/index.html?username=${this.username}`;
      } else if (this.domain.site === "sg1") {
        window.location.href = `/static/upup/sg1/index.html?username=${this.username}`;
      }

      window.location.title = "在线客服";
    }
  }
};
