<template>
  <div :class="$style['share-container']">
    <div :class="$style['pic-wrap']">
      <img
        ref="shareAppImage"
        :src="$getCdnPath('/static/image/_new/mcenter/share/share_app.png')"
        alt="shareApp"
      />
    </div>

    <div :class="$style['func-wrap']">
      <div
        :class="$style['func-cell']"
        v-for="(item, index) in funcList"
        :key="index"
      >
        <div @click="item.callback">
          <img :src="$getCdnPath(item.imgSrc)" :alt="item.text" />
        </div>
        <p>{{ item.text }}</p>
      </div>

      <div :class="$style['cancle']" @click="closeShare">取消</div>

      <message v-if="msg" @close="msg = ''">
        <div slot="msg">{{ msg }}</div>
      </message>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import message from "../../../../common/new/message";

export default {
  components: {
    message
  },
  props: {
    isShowShare: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      msg: "",
      // showSaveOption: false,
      shareImageSrc: "",
      funcList: [
        {
          callback: () => {
            this.copyShareImage();
          },
          imgSrc: `/static/image/_new/mcenter/share/btn_copy.png`,
          text: "复制链接"
        },
        {
          callback: () => {
            axios({
              url: this.shareImageSrc,
              methods: "GET",
              responseType: "blob"
            }).then(res => {
              let fileURL = window.URL.createObjectURL(
                new Blob([res.data])
              );

              let fileLink = document.createElement("a");
              fileLink.href = fileURL;
              fileLink.setAttribute("download", "yabo.png");
              document.body.appendChild(fileLink);

              fileLink.click();
            });
          },
          imgSrc: `/static/image/_new/mcenter/share/btn_save.png`,
          text: "保存图片"
        }
      ]
    };
  },
  mounted() {
    this.shareImageSrc = this.$refs.shareAppImage.src;
  },
  methods: {
    closeShare() {
      this.$emit("update:isShowShare", false);
    },
    copyShareImage() {
      this.$copyText(this.shareImageSrc).then(e => {
        this.msg = "复制成功";
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

$radius: 10px;

@mixin fixed-container-style($opacity) {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    background: #000;
    opacity: $opacity;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}

.share-container {
  @include fixed-container-style(0.4);
}

.pic-wrap {
  position: absolute;
  width: 270px;
  height: 345px;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8px;
  overflow-y: hidden;

  img {
    width: 100%;
  }
}

.func-wrap {
  position: absolute;
  width: 100%;
  bottom: 0;
  font-weight: 600;
  background: #f5f5f9;

  .func-cell {
    display: inline-block;
    width: 60px;
    text-align: center;
    margin: 15px 0px 10px 17px;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border-radius: 10px;
      background: #fff;
    }

    > p {
      font-size: 12px;
      color: #898989;
      margin-top: 5px;
    }

    img {
      width: 32px;
      height: 32px;
    }
  }

  // cancle
  .cancle {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    height: 45px;
    font-size: 16px;
    color: $main_title_color1;
  }
}

.option-container {
  @include fixed-container-style(0.6);
}

.option-wrap {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 17px;

  .option-cell {
    width: 100%;
    background: #3a3a3a;
    color: #5f799e;
    text-align: center;
    padding: 15px 0px;
    margin: 0;
  }

  p:first-of-type {
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
  }

  p:last-of-type {
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
  }

  .cancle {
    margin: 5px 0;
    background: #2c2c2e;
    border-radius: $radius;
  }
}
</style>
