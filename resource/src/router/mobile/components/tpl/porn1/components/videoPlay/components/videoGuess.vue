<template>
  <div :class="$style['video-guess-wrap']">
    <div
      :class="[
        [$style.like],
        { [$style['custom']]: ['les', 'gay'].includes(source) }
      ]"
    >
      <img
        :src="
          $getCdnPath(
            `/static/image/_new/video/icon_like${
              ['les', 'gay'].includes(source)
                ? '_red'
                : ['porn1', 'aobo1', 'sp1'].includes(routerTPL)
                ? '_gray'
                : ''
            }.png`
          )
        "
      />
      {{ $text("S_YOU_MAY_LIKE", "猜你喜欢") }}
    </div>
    <div
      v-for="video in videoList"
      :key="video.id"
      :class="[$style['video-wrap'], 'clearfix']"
      @click="onClick(video.id)"
    >
      <div :class="[$style['image-wrap'], $style[siteConfig.ROUTER_TPL]]">
        <img :src="img" :img-id="video.id" />
      </div>
      <div :class="$style['info-wrap']">
        <div
          :class="[
            $style['video-title'],
            { [$style['custom']]: ['smallPig'].includes(source) }
          ]"
        >
          {{ video.title }}
        </div>
        <video-tag :tag="video.tag" />
        <div :class="$style['views']">
          <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
          <div>{{ video.views }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoTag from "./videoTag";
import pornRequest from "@/api/pornRequest";
import { getEncryptImage } from "@/lib/crypto";
import { mapActions, mapGetters } from "vuex";
import { setCookie } from "@/lib/cookie";

export default {
  components: {
    videoTag
  },
  props: {
    tags: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      source: this.$route.query.source,
      videoList: []
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    img() {
      // return this.$getCdnPath(
      //   `/static/image/${this.themeTPL}/default/${
      //     this.source === "yabo" || this.source === "av"
      //       ? "bg_video03_d"
      //       : "bg_video03_1_d@3x"
      //   }.png`
      // );
      return "";
    },
    siteId() {
      switch (this.source) {
        case "av":
        case "yabo":
          setCookie(
            "s_id",
            this.siteConfig.PORN_CONFIG.ID[this.source === "yabo" ? "YB" : "AV"]
          );
          return 1;

        case "smallPig":
          setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["SP"]);
          return 2;

        case "gay":
          setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["GAY"]);
          return 3;

        case "les":
          setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["LES"]);
          return 4;

        default:
          break;
      }
    }
  },
  created() {
    this.getGuessVideo();
  },
  methods: {
    getGuessVideo() {
      const obj = {
        url: `/video/guess`,
        params: {
          siteId: this.siteId,
          tags: this.tags
        }
      };
      // if (this.$route.query.source === 'smallPig') { obj['smallPig'] = true }
      pornRequest(obj).then(response => {
        if (response.status !== 200) {
          return;
        }

        if (response.result && response.result.data) {
          this.videoList = [...response.result.data];
        } else {
          this.videoList = [];
        }

        setTimeout(() => {
          this.videoList.forEach(item => {
            getEncryptImage(item);
          });
        }, 300);
      });
    },
    onClick(id) {
      if (String(id) === String(this.$route.params.id)) {
        return;
      }
      let source = this.$route.query.source;
      this.$emit("leave", () => {
        this.$router.push(`/mobile/videoPlay/${id}?source=${source}`);
        this.getGuessVideo();
        // window.location.href = `/mobile/videoPlay/${id}?source=${source}`;
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.video-guess-wrap {
  padding: 10px 15px 34px;
  overflow-x: hidden;
  height: 100%;
  overflow-y: scroll;
}

.like {
  line-height: 20px;
  margin-bottom: 15px;
  // color: var(--video_guess_like_color);
  color: #5e626d;
  font-weight: 500;

  &.custom {
    color: #333;
  }

  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: middle;
  }
}

.video-wrap {
  margin-bottom: 10px;

  > div {
    float: left;
    height: 80px;
  }
}

.image-wrap {
  position: relative;
  overflow: hidden;
  width: 40%;

  background: linear-gradient(180deg, #fdfeff, #e2e8fe);
  &::after {
    content: "";
    z-index: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 72px;
    height: 72px;
    transform: translate(-50%, -50%);
    background-image: url("/static/image/porn1/default/default_logo.png");
  }
  &.aobo1 {
    background: linear-gradient(180deg, #fdfeff, #fdf2f2);
    &::after {
      content: "";
      z-index: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 72px;
      height: 72px;
      transform: translate(-50%, -50%);
      background-image: url("/static/image/aobo1/default/default_logo.png");
    }
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    position: relative;
  }
}

.info-wrap {
  width: 60%;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  > div {
    height: 33%;
  }
}

.video-title {
  padding-top: 1px;
  overflow: hidden;
  line-height: 14px;
  color: #5e626d;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.custom {
    color: #bfbfbf;
  }
}

.views {
  height: 12px;
  line-height: 12px;
  color: #ffffff;
  font-size: 9px;
  display: flex;
  align-items: center;

  > img {
    margin-right: 3px;
    width: 13px;
    height: 13px;
  }
}

@media screen and (min-width: $pad) {
  .video-wrap {
    > div {
      height: 115px;
    }
  }

  .video-title {
    font-size: 14px;
  }

  .views {
    font-size: 12px;
  }
}
</style>
