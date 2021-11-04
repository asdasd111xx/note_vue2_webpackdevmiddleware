<template>
  <div
    v-if="showType"
    :class="$style['ys-float-btn']"
    @touchmove.prevent=""
    :style="{
      width: itemWidth + 'px',
      height: itemHeight + 'px',
      left: left + 'px',
      top: top + 'px'
    }"
    ref="div"
  >
    <img
      v-bind:src="floatData.filePath"
      :class="$style['data-image']"
      @click="linkTo"
    />
    <img
      src="/static/image/common/ic_close.png"
      :class="$style['close-btn']"
      @click="closeDragItem"
    />
  </div>
</template>

<script>
import mobileLinkOpen from "@/lib/mobile_link_open";
import openGame from "@/lib/open_game";
import { mapActions, mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
export default {
  name: "FloatImgBtn",
  data() {
    return {
      showType: true,
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      itemWidth: 90,
      itemHeight: 110,
      gapWidth: 10,
      coefficientHeight: 0.75,
      left: 0,
      top: 0,
      trialList: [],
      promotionId: 0
    };
  },
  props: {
    floatData: {
      type: Object,
      default: {}
    },
    listIndex: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.left = this.clientWidth - this.itemWidth - this.gapWidth;
    this.top =
      this.clientHeight * this.coefficientHeight -
      this.itemHeight * (this.totalCount - this.listIndex - 1);
    // console.log(this.floatData);
    // console.log(this.listIndex);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  mounted() {
    window.addEventListener("scroll", this.handleScrollStart);
    this.$nextTick(() => {
      const div = this.$refs.div;
      div.addEventListener("touchstart", () => {
        div.style.transition = "none";
      });
      div.addEventListener("touchmove", e => {
        if (e.targetTouches.length === 1) {
          let touch = event.targetTouches[0];
          this.left = touch.clientX - this.itemWidth / 2;
          this.top = touch.clientY - this.itemHeight / 2;
        }
      });
      div.addEventListener("touchend", () => {
        // div.style.transition = "all 0.3s";
        // if (this.left > this.clientWidth / 2) {
        //   this.left = this.clientWidth - this.itemWidth - this.gapWidth;
        // } else {
        //   this.left = this.gapWidth;
        // }
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScrollStart);
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    mobileLinkOpen,
    closeDragItem() {
      this.showType = false;
      let notShowList = JSON.parse(
        localStorage.getItem("do-not-show-float-list")
      );
      notShowList.push(this.floatData.id);
      // console.log(notShowList);
      localStorage.setItem(
        "do-not-show-float-list",
        JSON.stringify(notShowList)
      );
    },
    linkTo() {
      /*
      linkType:
      internal->內部連結(link欄位會有值)
      game->遊戲連結(vendor、kind、vendorAbridge會有值)
      promotion->優小秘(linkDetail會有值)
      external->外部連結(linkDetail會有值)
      */

      switch (this.floatData.linkType) {
        case "internal":
          this.mobileLinkOpen({
            linkType: this.floatData.linkType,
            linkTo: this.floatData.link
          });
          break;
        case "game":
          let gameLinkType = 0;
          switch (this.floatData.kind) {
            case 1:
              gameLinkType = "sport";
              break;

            case 2:
              gameLinkType = "live";
              break;

            case 3:
              gameLinkType = "casino";
              break;

            case 4:
              gameLinkType = "lottery";
              break;

            case 5:
              gameLinkType = "card";
              break;

            case 6:
              gameLinkType = "mahjong";
              break;

            default:
              break;
          }
          this.mobileLinkOpen({
            linkType: gameLinkType,
            linkTo: this.floatData.vendor,
            linkItem: { "zh-cn": this.floatData.code }
          });
          break;
        case "promotion":
          this.getPromotionList(this.floatData.linkDetail);
          break;
        case "external":
          // let newWindow;
          // newWindow = window.open(`${this.floatData.linkDetail}`, "_blank");
          // this.mobileLinkOpen({
          //   linkType: this.floatData.linkType,
          //   linkTo: this.floatData.linkDetail
          // });
          localStorage.setItem("iframe-third-url", this.floatData.linkDetail);
          this.$router.push(`/mobile/iframe/home`);
          break;
        default:
          break;
      }
    },
    handleScrollStart() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleScrollEnd();
      }, 300);
      this.currentTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth / 2;
      } else {
        this.left = -this.itemWidth / 2;
      }
    },
    handleScrollEnd() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop === this.currentTop) {
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth;
        } else {
          this.left = this.gapWidth;
        }
        clearTimeout(this.timer);
      }
    },
    getPromotionList(id) {
      this.promotionId = +id;
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
        params: {
          tabId: 0
        }
      }).then(res => {
        if (res && res.data) {
          let linkData = res.data.ret.find(data => {
            return data.id === this.promotionId;
          });
          if (linkData) {
            this.mobileLinkOpen({
              linkType: "mi",
              linkTitle: linkData.name,
              linkTo: linkData.link
            });
          } else {
            this.actionSetGlobalMessage({
              msg: "抱歉，此活动不存在"
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
.ys-float-btn {
  z-index: 20;
  position: fixed;
  bottom: 20vw;

  .close-btn {
    width: 20px;
    height: 20px;
    right: 0;
    position: absolute;
  }

  .data-image {
    width: 90px;
    height: 90px;
    // object-fit: contain;
    margin-top: 20px;
    position: absolute;
  }
}
</style>
