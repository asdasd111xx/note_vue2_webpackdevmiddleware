import axios from "axios";
import { gameList } from "@/config/api";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isReceive: false,
      gameData: []
    };
  },
  computed: {
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

          this.gameData = ret;
        })
        .catch(error => {
          this.isReceive = false;
          this.actionSetGlobalMessage(error.response.data.msg);
        });
    }
  }
};
