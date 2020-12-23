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
import mcenter from "@/api/mcenter";
import member from "@/api/member";
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
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
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
    ...mapActions(["actionSetGlobalMessage"]),
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

<style lang="scss" src="../css/porn1.avater.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.avater.scss" module="$style_ey1"></style>
<style lang="scss" src="../css/sg1.avater.scss" module="$style_sg1"></style>
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
