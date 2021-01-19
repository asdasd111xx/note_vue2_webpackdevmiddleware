<template>
  <div class="error500">
    <div class="image">
      <img :src="$getCdnPath('/static/image/500error.png')" />
      <img :src="$getCdnPath('/static/image/oops.png')" class="oops" />
    </div>
    <div class="text">
      {{ $text("ROUTER_500_TEXT", { text: "内部伺服器错误" }) }}
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import member from "@/api/member";
import getLang from "@/lib/getLang";
import axios from "axios";
export default {
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get("lang") || "zh-cn"]: "" }).then(() => {
      let confStatus = false,
        playerStatus = false;
      const conf = axios({
        method: "get",
        url: "/conf/domain",
        timeout: 5000
      })
        .then(res => {
          let result = {
            domain: "",
            site: ""
          };

          const site = (res && res.data && String(res.data.site)) || "";
          const domain = (res && res.data && String(res.data.domain)) || "";
          if (!site || !domain) {
            next();
          } else {
            confStatus = true;
          }
        })
        .catch(res => {
          next();
        });

      const player = member.data({
        success: () => {
          playerStatus = true;
        },
        fail: () => {
          next();
        }
      });

      Promise.all([conf, player]).then(() => {
        if (confStatus && playerStatus) {
          next({ path: "/" });
        }
      });
    });
  }
};
</script>

<style lang="scss" src="@/css/router/500.scss"></style>
