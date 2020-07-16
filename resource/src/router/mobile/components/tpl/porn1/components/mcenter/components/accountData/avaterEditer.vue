<template>
  <div :class="sliderClass">
    <div :class="$style['avater-editer-header']">
      <div :class="$style['btn-prev']">
        <img
          :src="$getCdnPath('/static/image/_new/common/btn_back.png')"
          @click="onClose()"
        />
      </div>
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
      <div :class="$style['cropper']">
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
        ></vueCropper>
      </div>
    </div>

    <div :class="$style['avater-editer-func']">
      <div :class="$style['choose-btn']" @click="choose">选择文件</div>
      <div :class="[$style['func-btn']]">
        <div :class="[$style['cancel-btn']]" @click="cancel">
          取消
        </div>
        <div :class="[$style['submit-btn']]" @click="submit">
          上传头像
        </div>
      </div>
    </div>
      <page-loading
     :isShow="isShowLoading"
    />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import axios from 'axios';
export default {
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/tpl/porn1/components/common/new/pageLoading'),

  },
  props: {
    handleClose: {
      type: Function,
      default: () => { }
    },
  },
  data() {
    return {
      sliderClass: 'slider',
      cropperImg: '',
      cropper: '',
      imgName: '',
      isShowLoading: false,

      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 300, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      memCurrency: 'getMemCurrency',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_PERSON_INFO", "个人资料"),
      };
    },
  },
  mounted() {
    // this.initCropper()
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetGlobalMessage'
    ]),
    choose() {
      this.$refs['albumInput'].click();
    },
    submit() {
      if (this.isShowLoading) return;
      if (!this.option.img) {
        this.actionSetGlobalMessage({ msg: '上传文件不能为空' })
      }

      this.isShowLoading = true;
      this.$refs.cropper.getCropBlob((data) => {
        if (data) {
          let formData = new FormData();
          formData.append('custom_image', data);
          axios({
            method: 'post',
            url: '/api/v1/c/player/custom-image',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.actionSetGlobalMessage({ msg: "上传成功", cb: () => { this.onClose(); } })
            }
            this.isShowLoading = false;
            this.actionSetUserdata(true);
          }).catch(error => {
            this.isShowLoading = false;
            this.actionSetGlobalMessage({ msg: error.response.data.msg })
          })
        }

      })
    },
    cancel() {
      this.onClose();
    },
    uploadImgChange(event) {
      const img = event.target.files[0];
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(img);
        this.dialogVisible = true
      })
    },
    onClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.handleClose();
        }, 280)

      });
      this.sliderClass = 'slider-close slider'
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.avater-editer-header {
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: #fefffe;
  text-align: center;
  position: relative;

  .title {
    width: 100%;
    text-align: center;
    font-size: 17px;
    line-height: 43px;
  }
}

.btn-prev {
  position: absolute;
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 20px;
    height: 20px;
  }
}

.cropper {
  position: relative;
  height: 350px;
  margin: 5px;
  border: dashed #cacaca 1px;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.img-input {
  display: none;
  border: unset;
  outline: unset;
}

.avater-editer-func {
  margin-top: 50px;
  padding: 0 10px;
}

.choose-btn {
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  border-radius: 3px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  height: 45px;
  line-height: 45px;
  margin: 10px 0;
  text-align: center;
}

.func-btn {
  display: flex;
  margin: 10px 0;

  > div {
    width: 50%;
    display: inline-block;
    font-weight: 400;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
  }
}

.cancel-btn {
  background: #faf5f0;
  color: #be9e7f;
}

.submit-btn {
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  color: #ffffff;
}
</style>
<style>
.cropper-face {
  border-radius: 50% !important;
}
</style>
