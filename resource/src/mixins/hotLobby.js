import axios from "axios";
import { gameList } from "@/config/api";
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapActions, mapGetters } from "vuex";
import { getCookie, setCookie } from "@/lib/cookie";

export default {
  data() {
    return {
      isReceive: false,
      gameData: [],
      userViplevel: 0,
      needFilterGameData: []
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    lobbyInfo() {
      let info = {};
      const vendor = this.$route.params.vendor;

      switch (vendor) {
        case "lg_yb_casino":
          info = {
            alias: "casino",
            name: "热门电子",
            vendor,
            kind: "3"
          };
          break;

        case "lg_yb_card":
          info = {
            alias: "card",
            name: "热门棋牌",
            vendor,
            kind: "5"
          };
          break;
      }

      return info;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    getUserViplevel() {
      let cid = getCookie("cid");
      if (!cid && this.loginStatus) {
        return;
      }
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Player/vipinfo`,
        headers: {
          cid: cid
        }
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          let useVip = res.data.find(vip => {
            return vip.complex;
          });
          this.userViplevel = useVip ? useVip.now_level_id : 0;
        } else {
          this.userViplevel = 0;
        }

        this.getFilterList();
      });
    },
    getFilterList() {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Games/Vip/Filter`,
        params: {
          vipId: this.userViplevel
        }
      }).then(response => {
        this.needFilterGameData =
          response.status === "000" ? response.data : [];
        this.getGameList();
      });
    },
    getGameList(searchText = "") {
      if (this.isReceive) return;

      this.isReceive = true;

      let params = {
        vendor: this.lobbyInfo.vendor,
        kind: this.lobbyInfo.kind,
        first_result: 0,
        max_results: 36
      };

      return axios({
        method: "get",
        url: gameList,
        params: {
          ...params,
          name: searchText
        }
      })
        .then(res => {
          const { result, ret } = res.data;
          this.isReceive = false;
          if (result !== "ok") {
            return;
          }

          // console.log(
          //   `this.needFilterGameData.length is ${this.needFilterGameData.length}   ` +
          //     this.needFilterGameData
          // );
          // console.log(`ret.length is ${ret.length}   ` + ret);
          this.gameData = ret.filter(data => {
            return !this.needFilterGameData.find(filterData => {
              return (
                filterData.gameCode === data.code &&
                filterData.gameType === data.vendor
              );
            });
          });

          // console.log(
          //   `this.gameData.length is ${this.gameData.length}   ` + this.gameData
          // );
        })
        .catch(error => {
          this.isReceive = false;
          this.actionSetGlobalMessage(error.response.data.msg);
        });
    }
  }
};
