<template>
  <div :class="sliderClass">
    <div :class="$style['container']">
      <div :class="$style['avater-editer-header']">
        <div @click="onClose()" :class="$style['btn-prev']"><div /></div>
        <span :class="$style['title']">
          {{ $text("S_SET_AVATER", "设置头像") }}</span
        >
      </div>
      <input
        @change="uploadImgChange"
        :class="$style['img-input']"
        ref="albumInput"
        type="file"
        accept="image/*"
      />

      <!-- 裁剪區塊 -->
      <div :class="$style['avater-editer-conatainer']">
        <div
          :class="[
            $style['cropper'],
            {
              [$style['active']]: option.img
            }
          ]"
        >
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :maxImgSize="option.maxImgSize"
          ></vueCropper>
        </div>
      </div>

      <div :class="$style['avater-editer-func']">
        <div :class="$style['choose-btn']" @click="chooseFile">选择文件</div>
        <div :class="[$style['func-btn']]">
          <div :class="[$style['cancel-btn']]" @click="cancel">
            取消
          </div>
          <div :class="[$style['submit-btn']]" @click="submit">
            上传头像
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  props: {
    handleClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      sliderClass: "slider",
      cropperImg: "",
      cropper: "",
      imgName: "",
      isSend: false,

      option: {
        maxImgSize: "1500",
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.1, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      memCurrency: "getMemCurrency",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_PERSON_INFO", "个人资料")
      };
    }
  },
  mounted() {},
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    chooseFile() {
      // 檢查相機權限 web clip似乎沒用
      //   try {
      //     let handleSuccess = function (stream) {
      //       console.log(stream)
      //     };

      //     navigator.mediaDevices.getUserMedia({ video: true })
      //       .then(handleSuccess);
      //   } catch (e) {
      //     console.log(object)
      //   }

      this.$refs["albumInput"].click();
    },
    submit() {
      if (this.isSend) return;
      if (!this.option.img) {
        this.actionSetGlobalMessage({ msg: "上传文件不能为空" });
        return;
      }
      this.isSend = true;
      this.$emit("setPageLoading", true);

      try {
        this.$refs.cropper.getCropBlob(data => {
          if (data) {
            let formData = new FormData();
            formData.append("custom_image", data);
            axios({
              method: "post",
              url: "/api/v1/c/player/custom-image",
              data: formData,
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
              .then(res => {
                this.isSend = false;
                if (res && res.data && res.data.result === "ok") {
                  let reader = new FileReader();
                  reader.readAsDataURL(data);
                  reader.onloadend = function() {
                    let base64data = reader.result;
                    localStorage.setItem("tmp-avatar-img", base64data);
                  };

                  this.actionGetExtRedirect({
                    api_uri: "/api/platform/v1/user/head-photo",
                    method: "put",
                    data: {
                      head_photo_id: 0,
                      custom_image_route: res.data.ret.custom_image.split(
                        "/"
                      )[4]
                    }
                  }).then(res => {});

                  this.actionSetGlobalMessage({
                    msg: "上传成功",
                    cb: () => {
                      this.onClose(true);
                    }
                  });
                  setTimeout(() => {
                    this.$emit("setPageLoading", false);
                  }, 800);
                } else {
                  this.$emit("setPageLoading", false);
                  this.actionSetGlobalMessage({ msg: res.data.msg });
                }
              })
              .catch(error => {
                this.isSend = false;
                this.$emit("setPageLoading", false);
                this.actionSetGlobalMessage({ msg: error.response.data.msg });
              });
          } else {
            this.$emit("setPageLoading", false);
            this.actionSetGlobalMessage({ msg: "图片超出档案限制大小" });
          }
        });
      } catch (e) {
        this.$emit("setPageLoading", false);
        this.actionSetGlobalMessage({ msg: e });
      }
    },
    cancel() {
      this.onClose();
    },
    uploadImgChange(event) {
      const img = event.target.files[0];
      this.$nextTick(() => {
        if (img && img.size && img.size / 1024 / 1024 > 20) {
          this.actionSetGlobalMessage({ msg: "图片超出档案限制大小" });
        } else {
          this.option.img = URL.createObjectURL(img);
          this.dialogVisible = true;
        }
      });
    },
    onClose(isDone) {
      this.sliderClass = "slider-close slider";

      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("close", isDone);
        }, 280);
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

// editer
.container {
  background-color: #ffffff;
}

.avater-editer-header {
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: #ffffff;
  text-align: center;
  position: relative;
  color: #ffffff;

  .title {
    width: 100%;
    text-align: center;
    font-size: 17px;
    line-height: 43px;
    font-weight: 700;
    color: #000000;
  }
}

.btn-prev {
  position: absolute;
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    width: 20px;
    height: 20px;
    background-image: url("/static/image/common/btn_back_black.png");
    background-size: cover;
    background-position: center;
  }
}

.cropper {
  height: 294px;
  margin: 5px auto;
  max-width: 100%;
  width: 375px;
  background-image: url("/static/image/common/default/avatar_nologin.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 250px 250px;
  border: dashed #cacaca 1px;
  position: relative;
  text-align: center;

  &.active {
    background-image: unset;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.avater-editer-func {
  margin-top: 50px;
  padding: 0 10px;
}

.choose-btn {
  background: #000;
  color: #ffffff;
  border-radius: 23px;
  font-size: 14px;
  font-weight: 400;
  height: 45px;
  line-height: 45px;
  margin: 10px 0;
  text-align: center;
}

.func-btn {
  margin: 15px 0;

  > div {
    width: 48%;
    display: inline-block;
    font-weight: 400;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
    border-radius: 23px;
  }
}

.cancel-btn {
  background: #ededed;
  color: #000;
  border: 1px solid #000;
}

.submit-btn {
  background: #000;
  color: #ffffff;
  float: right;
}

.account-header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid #eee;
  background: #fefffe;

  &::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;
  z-index: 2;

  > img {
    display: block;
    width: 100%;
  }
}

.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.title {
  height: 43px;
  line-height: 43px;
  color: #000000;
  font-size: 17px;
  font-weight: 500;
  margin: 0 auto;
}

.img-input {
  display: none;
  border: unset;
  outline: unset;
}
</style>

<style>
/* 複寫套件 */
.vue-cropper {
  background-image: unset !important;
  background-color: rgba(0, 0, 0, 0.5);
}
.cropper-face {
  border-radius: 50% !important;
  opacity: 0.2 !important;
}
</style>
