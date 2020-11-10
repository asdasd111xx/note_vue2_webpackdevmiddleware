<template>
  <div :class="$style['vip-container']">
    <div :class="$style['vip-top-info']">
      <!-- Header -->
      <div :class="$style['header-block']">
        <div :class="$style['btn-back']" @click="$router.back()">
          <img
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/common/btn_back_b.png`
              )
            "
            alt="btn_back"
          />
        </div>

        <div :class="$style['header-title']">
          <span
            :class="{
              [$style['active']]: item.config_id === currentConfigID
            }"
            v-for="(item, index) in userVipInfo"
            :key="item.config_id"
            @click="
              loginStatus
                ? handleConfigId(item.config_id)
                : $router.push('/mobile/login')
            "
            >{{ item.config_name }}</span
          >
        </div>
      </div>

      <!-- user info -->
      <template v-if="userVipInfo">
        <vip-user
          :vipLevelList="vipLevelList"
          :userVipInfo="
            userVipInfo.find(item => item.config_id === this.currentConfigID)
          "
        />
      </template>
    </div>

    <!-- level card -->
    <template v-if="vipLevelList && userVipInfo">
      <vip-level-card
        :currentLevelData.sync="setCurrentLevel"
        :vipLevelList="vipLevelList"
        :userVipInfo="
          userVipInfo.find(item => item.config_id === this.currentConfigID)
        "
      />
    </template>

    <!-- desc -->
    <template v-if="setCurrentLevel">
      <vip-info :currentLevelData="setCurrentLevel" />
    </template>
    <!-- <live-info /> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { getCookie } from "@/lib/cookie";
import vipUser from "./vipUser";
import vipLevelCard from "./vipLevelCard";
import vipInfo from "./vipInfo";
import mcenter from "@/api/mcenter";
import yaboRequest from '@/api/yaboRequest';
import goLangApiRequest from '@/api/goLangApiRequest';

export default {
  components: {
    Swiper,
    SwiperSlide,
    vipUser,
    vipLevelCard,
    vipInfo
  },
  data() {
    return {
      currentConfigID: 0,
      userVipInfo: null,
      vipLevelList: [],
      currentLevelData: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus"
    }),
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    setCurrentLevel: {
      get() {
        return this.currentLevelData;
      },
      set(value) {
        this.currentLevelData = value;
      }
    }
  },
  created() {
    this.getUserDetail();

    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }
  },
  methods: {
    getUserDetail() {
      // yaboRequest({
      //   method: "get",
      //   url: `${
      //     this.siteConfig.YABO_API_DOMAIN
      //     }/player/vipinfo/${getCookie("cid")}`,
      //   headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //   this.userVipInfo = res.data;

      //   // 起始預設 config_id 為分類中的第一筆
      //   this.currentConfigID = this.userVipInfo[0].config_id;
      // });
      goLangApiRequest({
        method: "get",
        url: `${
          this.siteConfig.YABO_GOLANG_API_DOMAIN
          }/Player/vipinfo`,
        headers: {
          "x-domain": this.memInfo.user.domain,
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
      //   url: `${
      //     this.siteConfig.YABO_API_DOMAIN
      //     }/player/viplevel/${getCookie("cid")}?configId=${
      //     this.currentConfigID
      //     }`,
      //   headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //   this.vipLevelList = res.data;
      // });
      goLangApiRequest({
        method: "get",
        url: `${
          this.siteConfig.YABO_GOLANG_API_DOMAIN
          }/Player/viplevel/${this.currentConfigID}`,
        headers: {
          "x-domain": this.memInfo.user.domain,
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
};
</script>

<style lang="scss" src="@/css/page/vip/porn1.vip.scss" module="$style_porn1"></style>
<style lang="scss" src="@/css/page/vip/ey1.vip.scss" module="$style_ey1"></style>
