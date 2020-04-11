<template>
  <mobile-container class="theme-basic">
    <div slot="content" class="content-main">
      <mcenter-header :header-setting="headerSetting" />
      <feedback :select-type-id.sync="currentSelectId">
        <template
          scope="{ currentTab, fieldList, paramsData, goImageRelease, stepText, submitData, errorField, setInputValue }"
        >
          <div v-if="!selectType" class="feedback-wrap">
            <div class="feedback-title-wrap">
              {{ $text("S_ASK_QUESTION_TYPE", "请选择您要咨询的问题类别") }}
            </div>
            <div v-if="!selectType" class="feedback-tab-wrap">
              <div
                v-for="(tabInfo, keyValue) in fieldList.type_id.data"
                :key="`${keyValue}-tab-index`"
                class="feedback-tab-btn"
                @click="changeType(tabInfo)"
              >
                <img v-lazy="getImg(tabInfo.id)" class="type-icon" />
                <span>{{ tabInfo.content }}</span>
              </div>
            </div>
          </div>
          <div v-else class="feedback-ask-wrap">
            <div class="ask-type-wrap">
              <div class="ask-title">
                {{ $text("S_QUESTION_TYPE", "问题类型") }}
              </div>
              <div class="select-wrap">
                <img v-lazy="getImg(selectType.id)" class="select-type-icon" />
                <span>{{ selectType.content }}</span>
                <div class="change-text-wrap">
                  <span class="change-text-btn">{{
                    $text("S_CHANGE_QUESTION", "换个问题")
                  }}</span>
                  <select v-model="selectType" class="field-select">
                    <option
                      v-for="typeInfo in fieldList.type_id.data"
                      :key="`type-info-${typeInfo.id}`"
                      :value="typeInfo"
                    >
                      {{ typeInfo.content }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="ask-type-wrap">
              <div class="ask-title">{{ $text("S_TITLE", "標題") }}</div>
              <input
                :value="paramsData.title"
                :class="['field-input', { 'is-error': errorField.title }]"
                :placeholder="$text('S_WRITE_QUESTION', '请描述您的问题')"
                maxlength="100"
                @input="setInputValue($event.target.value, 'title')"
              />
            </div>
            <div class="ask-content-wrap">
              <div class="ask-title">
                {{ $text("S_DESCRIBE_QUESTION", "问题描述") }}
                <span class="sub-text"
                  >（{{ $text("S_WORD_COUNT", "字数上限1000字") }}）</span
                >
              </div>
              <textarea
                :value="paramsData.content"
                :placeholder="
                  $text(
                    'S_DESCRIBE_QUESTION_TIP',
                    '请详细描述您遇到的问题，字数上限1000字'
                  )
                "
                maxlength="1000"
                class="field-textarea"
                @input="setInputValue($event.target.value, 'content')"
              />
            </div>
            <div class="image-release-btn" @click="goImageRelease">
              {{ $text("S_IMAGE_RELEASE", "上传图片") }}
            </div>
            <div class="feedback-tip-wrap">
              <div
                v-for="(text, index) in stepText"
                :key="`tip-${index}`"
                class="tip-text"
              >
                {{ text }}
              </div>
            </div>
            <div class="feedback-btn" @click="submitData">
              {{ $text("S_SUBMIT", "提交") }}
            </div>
          </div>
        </template>
      </feedback>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    feedback: () => import(/* webpackChunkName: 'feedback' */'@/components/common/mcenter/feedback'),
    mcenterHeader: () => import(/* webpackChunkName: 'mcenterHeader' */ '@/router/mobile/components/common/mcenter/theme1/header')
  },
  data() {
    return {
      headerSetting: {
        title: this.$text('S_FEEDBACK', '意见反馈'),
        leftBtns: {
          icon: 'arrow'
        }
      },
      selectType: ''
    };
  },
  computed: {
    currentSelectId: {
      get() {
        return this.selectType.id || '';
      },
      set(value) {
        this.selectType = value;

        if (!value) {
          this.headerSetting = {
            title: this.$text('S_ONLINE_DEPOSIT', '线上存款'),
            leftBtns: {
              icon: 'arrow'
            }
          };
        }
      }
    },
    $style() {
      return {};
    }
  },
  methods: {
    changeType(typeInfo) {
      this.selectType = typeInfo;
      this.headerSetting = {
        title: this.$text('S_ONLINE_DEPOSIT', '线上存款'),
        leftBtns: {
          icon: 'arrow',
          onClick: () => { this.currentSelectId = ''; }
        }
      };
    },
    getImg(typeId) {
      return {
        src: this.$getCdnPath(`/static/image/mobile/mcenter/feedback/${typeId}.png`),
        error: this.$getCdnPath('/static/image/mobile/mcenter/feedback/1.png'),
        loading: this.$getCdnPath('/static/image/game_loading_s.gif')
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.theme-basic {
  background: #eee;
}

.content-main {
  position: relative;
  min-height: calc(100vh);
  padding: 65px 0 50px;
}

.feedback-wrap {
  margin-top: 10px;
  min-height: 683px;
  background: #eee;
}

.feedback-title-wrap {
  padding-top: 17px;
  text-align: center;
  font-size: 13px;
  color: #999;
}

.feedback-tab-btn {
  position: relative;
  width: 79%;
  margin: 3% auto;
  padding: 4% 0;
  text-align: center;
  cursor: pointer;
  border-radius: 26px;
  background-color: #f4f4f4;
}

.type-icon {
  position: absolute;
  width: 34px;
  height: 34px;
  margin-top: -17px;
  top: 50%;
  left: 20px;
}

.feedback-ask-wrap {
  height: 100%;
}

.ask-title {
  margin: 17px 0 8px 10px;
  font-size: 12px;
}

.sub-text {
  color: #999;
}

.select-wrap {
  position: relative;
  height: 42px;
  line-height: 42px;
  padding: 0 64px 0 46px;
  background: #fff;
}

.select-type-icon {
  position: absolute;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  top: 50%;
  left: 10px;
}

.field-select {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 42px;
  line-height: 42px;
  top: 0;
  right: 0;
  outline: none;
  border: none;
  background: transparent;
}

.change-text-wrap {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
  color: #00aeff;
}

.change-text-btn {
  position: relative;
  display: block;
  height: 42px;
  line-height: 42px;
  font-size: 12px;
  color: #00aeff;
}

.field-input {
  width: 100%;
  height: 42px;
  padding: 0 10px;
  font-size: 12px;
  outline: none;
  border: none;
  border-radius: 0;

  &.is-error {
    border: 1px solid #f00;
  }
}

.field-textarea {
  resize: none;
  width: 100%;
  height: 170px;
  padding: 8px 10px;
  font-size: 12px;
  outline: none;
  border: none;
  border-radius: 0;
}

.image-release-btn {
  margin: 10px 0 10px 8px;
  text-decoration: underline;
  cursor: pointer;
  color: #c39e51;
}

.feedback-tip-wrap {
  margin: 0 0 18px 8px;
}

.tip-text {
  font-size: 12px;
}

.feedback-btn {
  width: 89%;
  height: 34px;
  line-height: 34px;
  margin: 0 auto;
  text-align: center;
  border-radius: 17px;
  cursor: pointer;
  color: #fff;
  background: #955d2c;
  background-image: linear-gradient(to right, #f3d382, #955d2c);
}
</style>
