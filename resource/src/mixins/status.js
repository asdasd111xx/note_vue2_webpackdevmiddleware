import { getDoamin } from "@/lib/getCurrentDoamin";
import { rest } from "lodash";
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
      if (res && res.site) {
        this.domain = res;

        if (["sg1", "aobo1", "sp1"].includes(res.site)) {
          this.themeTPL = res.site;
        } else {
          this.themeTPL = "porn1";
        }
      } else {
        window.location.href = "/500";
      }
    });

    if (versionFile) {
      this.version = versionFile;
    }
  },
  methods: {
    linkToService() {
      window.location.href = "/custom/service";
    }
  }
};
