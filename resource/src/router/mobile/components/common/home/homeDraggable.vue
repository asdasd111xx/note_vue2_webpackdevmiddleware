<template>
  <div
    v-if="showType"
    :class="$style['ys-float-btn']"
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
export default {
  name: "FloatImgBtn",
  data() {
    return {
      showType: true,
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      itemWidth: 70,
      itemHeight: 90,
      gapWidth: 10,
      coefficientHeight: 0.8,
      left: 0,
      top: 0
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
    }
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.left = this.clientWidth - this.itemWidth - this.gapWidth;
    this.top = this.clientHeight * this.coefficientHeight - 90 * this.listIndex;
    // console.log(this.floatData);
    // console.log(this.listIndex);
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
      console.log("link to somewhere");

      switch (this.floatData.linkType) {
        case "internal":
          this.mobileLinkOpen({
            linkType: this.floatData.linkType,
            linkTo: this.floatData.link
          });
          break;
        case "game":
          const openGameSuccessFunc = res => {};

          const openGameFailFunc = res => {
            if (res && res.data) {
              let data = res.data;
              this.actionSetGlobalMessage({
                msg: data.msg,
                code: data.code,
                origin: "home"
              });
            }
          };

          openGame(
            {
              kind: this.floatData.kind,
              vendor: this.floatData.vendor,
              code: this.floatData.code,
              getGames: true
            },
            openGameSuccessFunc,
            openGameFailFunc
          );
          break;
        case "promotion":
          this.mobileLinkOpen({
            linkType: "mi",
            linkTo: this.floatData.linkDetail
          });
        case "external":
          // let newWindow;
          // newWindow = window.open(`${this.floatData.linkDetail}`, "_blank");
          this.mobileLinkOpen({
            linkType: this.floatData.linkType,
            linkTo: this.floatData.linkDetail
          });
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
    }
  }
};
</script>

<style lang="scss" module>
.ys-float-btn {
  // background: rgb(255, 255, 255);
  // box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  // border-radius: 50%;
  // color: #666666;
  z-index: 20;
  // transition: all 0.3s;

  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;

  position: fixed;
  bottom: 20vw;

  .close-btn {
    width: 20px;
    height: 20px;
    right: 0;
    position: absolute;
  }

  .data-image {
    width: 70px;
    height: 70px;
    object-fit: contain;
    margin-top: 15px;
  }

  // p {
  //   font-size: 7px;
  // }
}
</style>
