<template>
  <mobile-container v-if="info" :class="[$style.container, $style[source]]">
    <div slot="content" :class="$style['content-wrap']">
      <div :class="$style['header']" id="header">
        <div :class="$style['btn-prev']" @click="$router.back()">
          <img :src="$getCdnPath(`/static/image/common/btn_back_white.png`)" />
        </div>
      </div>
      <video-player
        v-if="info"
        :video-info="info"
        :source="this.source"
        :key="info.id"
        ref="player"
        id="videoPlayer"
      />
      <div
        :class="$style['info-wrap']"
        :style="{ height: `calc(100vh - ${videoHeight}px)` }"
      >
        <video-info v-if="info" :video-info="info" />
        <video-tag
          v-if="!['smallPig', 'gay', 'les'].includes(source)"
          :tag="info.tag"
          :padding="true"
        />
        <video-guess @leave="handleLeavePage" />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import querystring from "querystring";
import videoPlayer from "@/router/mobile/components/tpl/porn1/components/videoPlay/components/videoPlayer";
import videoInfo from "@/router/mobile/components/tpl/porn1/components/videoPlay/components/videoInfo";
import videoGuess from "@/router/mobile/components/tpl/porn1/components/videoPlay/components/videoGuess";
import videoTag from "@/router/mobile/components/tpl/porn1/components/videoPlay/components/videoTag";
import mobileContainer from "../common/mobileContainer";
import pornRequest from "@/api/pornRequest";
import { setCookie } from "@/lib/cookie";

export default {
  components: {
    mobileContainer,
    videoPlayer,
    videoInfo,
    videoGuess,
    videoTag
  },
  data() {
    return {
      source: this.$route.query.source,
      info: null,
      videoHeight: 220
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    siteId() {
      switch (this.source) {
        case "yabo":
          setCookie("s_id", "9");
          return 1;

        case "smallPig":
          setCookie("s_id", "");
          return 2;

        case "gay":
          setCookie("s_id", "9");
          return 3;

        case "les":
          setCookie("s_id", "9");
          return 4;

        default:
          break;
      }
    }
  },
  watch: {
    info() {
      this.$nextTick(() => {
        this.videoHeight = this.$refs["player"].$el.offsetHeight + 65;
      });
    }
  },
  methods: {
    handleLeavePage(cb) {
      if (this.$refs["player"]) {
        this.$refs["player"].handleLeavePage(cb);
      }
    }
  },
  mounted() {
    pornRequest({
      method: "post",
      url: `/video/videoinfo`,
      data: { videoId: this.$route.params.id, siteId: this.siteId }
    }).then(res => {
      if (res.status !== 200) {
        return;
      }
      this.info = { ...res.result };
    });
  },
  created() {
    // axios({
    //   method: "get",
    //   url: "http://104.155.239.78/api/v1/video/tag",
    //   params: {
    //     jwt:
    //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMTAyIn0.VAYlewJ5OgLAsPNPEaMkwaMg2J6z74HBATk7Q7U2uW8",
    //     videoSpaceId: 7
    //   }
    // })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    if (localStorage.getItem("content_rating")) {
      if (localStorage.getItem("content_rating") !== "1") {
        this.$router.push("/mobile");
      }
    } else if (
      !this.memInfo.config.content_rating ||
      !this.memInfo.user.content_rating
    ) {
      this.$router.push("/mobile");
    }

    if (this.$route.query.source === "smallPig") {
      axios({
        method: "post",
        url: "https://api.pv123.app/v1/device/verify",
        data: {
          type: "ios",
          token: "111123333",
          info: "brrrr"
        },
        withCredentials: true
      }).then(res => {});
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  overflow-x: hidden;
  overflow-y: hidden;
}

div.container {
  // Yabo & gay & les
  background-color: $main_white_color1;
  overflow-x: hidden;
  &.smallPig {
    background-color: #333;
  }
}

.header {
  position: fixed;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 14px;
  text-align: center;

  .btn-prev {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    width: 24px;
    height: 24px;
    margin: auto;

    > img {
      display: block;
      width: 100%;
    }
  }
}

.info-wrap {
  height: 400px;
  overflow-y: auto;
}
</style>
