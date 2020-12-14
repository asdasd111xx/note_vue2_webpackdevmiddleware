<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <!-- <div v-if="this.type === 'wechat'" @click="wechatClick"> -->
      <div @click="wechatClick">
        <img
          :class="$style['wechat-image']"
          :src="$getCdnPath(`/static/image/ey1/gift/${this.img}.jpg`)"
        />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../common/mobileContainer";
import { mapGetters, mapActions } from "vuex";
import jwt from "jwt-simple";
import { getCookie } from "@/lib/cookie";

export default {
  data() {
    return {
      type: "",
      title: "",
      img: "",
      url: "https://ey.italking.asia:5569/guest.php?gid=eyag",
      MenuList: [
        {
          type: "wifi",
          title: "wifi技术",
          src: "wifi_technology"
        },
        {
          type: "football",
          title: "第一足球",
          src: "first_football"
        },
        {
          type: "bird",
          title: "蜂鸟论坛",
          src: "bird_forum"
        },
        {
          type: "wechat",
          title: "微信推广",
          src: "wechat_promote"
        },
        {
          type: "plane",
          title: "飞机炸群",
          src: "plane_bombing"
        },
        {
          type: "apple",
          title: "苹果推信",
          src: "apple_twitter"
        },
        {
          type: "dial",
          title: "网红口拨",
          src: "internet_celebrity_dial"
        },
        {
          type: "listPurchase",
          title: "名单购买",
          src: "list_purchase"
        },
        {
          type: "smsCard",
          title: "短信卡发",
          src: "sms_card_sending"
        },
        {
          type: "mail",
          title: "邮件群发",
          src: "mass_mailing"
        }
      ]
    };
  },
  components: {
    mobileContainer
  },
  created() {
    //  this.getContactusUrl();
  },
  mounted() {
    if (this.loginStatus && this.onlineService) {
      const tokenExpiresTime = 60 * 60 * 24 * 60; // 60天秒數
      const memberData = {
        name: this.memInfo.user.name || "",
        mobile: this.memInfo.user.phone || "",
        account: this.memInfo.user.username,
        exp: Date.now() + tokenExpiresTime
      };
      const rsaData = jwt.encode(memberData, "T9AuSgQfh2");
      this.url = `${this.onlineService.url}&jwtToken=${rsaData}`;
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus",
      onlineService: "getOnlineService",
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      const index = this.MenuList.findIndex(
        MenuList => MenuList.type === this.$route.params.key
      );
      this.type = this.MenuList[index].type;
      this.title = this.MenuList[index].title;
      this.img = this.MenuList[index].src;
      // if (this.$route.params.key === "wifi") {
      //   this.type = "wifi";
      //   this.title = "wifi技术";
      // }
      return {
        prev: true,
        title: this.title,
        customLinkTitle: "点我报价",
        customLinkAction: () => {
          window.open(this.url);
        },
        onClick: () => {
          // this.$router.back("/mobile/gift?q=通讯软体");
          this.$router.back(`/mobile/gift?q=${this.title}`);
        }
      };
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    wechatClick() {
      window.open(this.url);
    },
    getContactusUrl() {
      let cid = getCookie("cid");
      if (!cid && this.loginStatus) {
        return;
      }
      axios({
        method: "get",
        url: `${YABO_GOLANG_API_DOMAIN}/cxbb/System/contactus`,
        headers: {
          cid: cid
        }
      })
        .then(res => {
          console.log("ok" + res);
          this.url = res.data.data[2].itemData[1].value;
          // return this.url;
        })
        .catch(res => {
          console.log("error" + res);
        });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.wechat-image {
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding-bottom: 15px;
  padding-top: 1px;

  > img {
    width: 100%;
  }
}
</style>
