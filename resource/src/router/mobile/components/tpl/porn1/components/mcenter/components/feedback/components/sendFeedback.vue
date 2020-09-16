<template>
  <div>
    <div :class="$style['question-category']">
      {{ $text("S_QUESTION_TYPE", "问题类别") }}
    </div>
    <div :class="$style['select-category']" @click="isShow = true">
      <img
        v-if="currentIndex !== '' && typeList && typeList.length > 0"
        :class="$style['select-icon']"
        :src="
          `/static/image/${theme}/mcenter/feedback/question_${
            typeList.find(i => i.id === String(paramsData.type_id)).imageId
          }.png`
        "
      />

      <span :class="{ [$style['select-active']]: paramsData.title }">
        {{
          paramsData.title ||
            $text("S_SELECT_QUESTION_CATEGORY", "请选择问题类型")
        }}
      </span>
      <img
        :class="$style['arrow-icon']"
        :src="`/static/image/${theme}/common/arrow_next.png`"
      />
    </div>
    <div :class="$style['question-description']">
      {{ $text("S_DESCRIBE_QUESTION", "问题描述") }}
      <span :class="$style['context-limit']">({{ contextLimit }})</span>
    </div>
    <div :class="$style['feedback-content']">
      <textarea
        :value="paramsData.content"
        :placeholder="$t('S_DESCRIBE_PROBLEM').replace('%s', 20)"
        minlength="20"
        @input="setValue($event.target.value)"
      />
      <span
        :class="[
          $style['text-count'],
          {
            [$style['red']]: contentLenght > 200
          }
        ]"
        >{{ contentLenght }}/200</span
      >
    </div>
    <div :class="$style['feedback-img']">
      <!-- <div :class="$style['img-count']">0/3</div> -->
      <div :class="$style['img-wrap']">
        <img
          :src="`/static/image/${theme}/mcenter/img_upload.png`"
          @click="goImageRelease"
        />
      </div>
      <div :class="$style['feedback-tip-wrap']">
        <div
          v-for="(text, index) in stepText"
          :key="`tip-${index}`"
          :class="$style['tip-text']"
        >
          {{ text }}
        </div>
      </div>
    </div>
    <div
      :class="[
        $style['submit'],
        {
          [$style['disabled']]:
            (contentLenght < 20 && !isSend) || contentLenght > 200
        }
      ]"
      @click="submitFeedback"
    >
      {{ $text("S_SUBMIT", "提交") }}
    </div>
    <div v-if="isShow" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-menu']">
        <div :class="$style['pop-title']">
          <span @click="isShow = false">{{ $text("S_CANCEL", "取消") }}</span>
          {{ $text("S_QUESTION_CATEGORY", "选择问题类型") }}
        </div>
        <ul :class="$style['pop-list']">
          <li
            v-for="(item, index) in typeList"
            :key="item.id"
            @click="getCategory(item, index)"
          >
            <img
              :src="
                `/static/image/${theme}/mcenter/feedback/question_${item.imageId}.png`
              "
            />
            {{ item.content }}
            <icon
              v-if="item.id === paramsData.type_id"
              :class="$style['select-check']"
              name="check"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import { API_FEEDBACK_CREATED } from '@/config/api';

export default {
  data() {
    return {
      isSend: '',
      paramsData: {
        type_id: '',
        title: '',
        content: ''
      },
      typeList: null,
      currentIndex: '',
      isShow: false,
      stepText: [
        `${this.$text('S_FEEDBACK_TIP01', '步骤一： 点击「上传图片」前往网址')} (https://imgbb.com/)。`,
        this.$text('S_FEEDBACK_TIP02', '步骤二： 将图片上传并获取图片网址链结。'),
        this.$text('S_FEEDBACK_TIP03', '步骤三： 将获取的网址链结贴至对话输入框内。'),
        this.$text('S_FEEDBACK_TIP04', '特别说明： 部分浏览器不支援拖曳上传图片，请使用上传按钮')
      ],
    };
  },
  created() {
    this.getTypeList();
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig'
    }),
    contentLenght() {
      return this.paramsData.content.trim().replace(' ', '').length;
    },
    theme() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style = this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    contextLimit() {
      return this.$text('S_CONTEXT_LIMIT', {
        replace: [
          { target: '%s', value: 20 },
          { target: '%S', value: 200 }
        ]
      });
    }
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    getTypeList() {
      ajax({
        method: 'get',
        url: '/api/v1/c/feedback_type/list',
        errorAlert: false
      }).then((res) => {
        this.typeList = res.ret.map((item, index) => {
          return {
            id: item.id,
            content: item.content,
            imageId: index + 1 < 8 ? index + 1 : 8
          }
        })
      });
    },
    setValue(value) {
      this.paramsData.content = value;
    },
    getCategory(info, index) {
      this.paramsData.type_id = info.id;
      this.paramsData.title = info.content;
      this.currentIndex = index;
      this.isShow = false;
    },
    submitFeedback() {
      if (this.isSend) {
        return;
      }

      if (!this.paramsData.title || this.isSend) {
        this.actionSetGlobalMessage({ msg: this.$text('S_SELECT_QUESTION_CATEGORY', '请选择问题类型') });
        return;
      }

      this.isSend = true;
      ajax({
        method: 'post',
        url: API_FEEDBACK_CREATED,
        params: {
          ...this.paramsData,
          //  content: this.paramsData.content.replace(/\n/g, '<br/>')
        },
        errorAlert: false,
        fail: (res) => {
          this.actionSetGlobalMessage({ msg: `${res.data.msg}` });
        },
      }).then((res) => {
        this.isSend = false;
        if (res && res.result === 'ok') {

          this.actionSetGlobalMessage({ msg: this.$text('S_FEEDBACK_SUCCESS', '您的意见反馈已送出') });
          Object.keys(this.paramsData).forEach((info) => {
            this.paramsData[info] = '';
          });

          this.currentIndex = '';
        }
      });
    },
    goImageRelease() {
      const url = 'https://imgbb.com/';
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || window.location.hostname === 'yaboxxxapp02.com') {
        this.$copyText(url);
        this.actionSetGlobalMessage({ msg: `「上传图片」链接已复制<br />请使用浏览器打开` });
        return;
      }

      window.open(url, 'imageWrap');
    }
  }
};
</script>

<style lang="scss" src="./css/sendFeedback.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.sendFeedback.scss" module="$style_ey1"></style>
