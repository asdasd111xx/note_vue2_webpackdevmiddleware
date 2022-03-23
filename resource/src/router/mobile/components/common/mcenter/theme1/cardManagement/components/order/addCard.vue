<template>
  <div>
    <input type="text" v-model="bank" placeholder="bank" />
    <input type="text" v-model="account" placeholder="account" />
    <div @click="addOrderCard">submit</div>
  </div>
</template>

<script>
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      bank: "",
      account: ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    addOrderCard() {
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Transfer/Account`,
        params: {
          bank: this.bank,
          account: this.account
        }
      }).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style></style>
