<template>
  <edit-email
    :old-value="oldValue"
    :new-value="newValue"
    :code-value="codeValue"
    :info="info"
  >
    <template
      scope="{ oldEmail, newEmail, checkCode, sendBtn, countdownSec, onSend, onSubmit }"
    >
      <div :class="[$style.wrap, 'clearfix']">
        <template v-if="oldEmail.isShow">
          <div :class="$style.title">{{ oldEmail.label }}</div>
          <div :class="$style['input-wrap']">
            <input
              v-model="oldValue"
              :placeholder="oldEmail.label"
              :class="$style.input"
              type="text"
            />
          </div>
        </template>
        <template v-if="newEmail.isShow">
          <div :class="$style.title">{{ newEmail.label }}</div>
          <div :class="$style['input-wrap']">
            <input
              v-model="newValue"
              :placeholder="newEmail.label"
              :class="$style.input"
              type="text"
            />
            <div
              v-if="sendBtn.isShow"
              :class="$style['btn-send']"
              @click="handleSend(onSend)"
            >
              {{ sendBtn.label }}
              <template v-if="sendBtn.countdownSec">
                (<span>{{ countdownSec }}</span
                >)
              </template>
            </div>
          </div>
        </template>
        <template v-if="checkCode.isShow">
          <div :class="$style.title">{{ checkCode.label }}</div>
          <div :class="$style['input-wrap']">
            <input
              v-model="codeValue"
              :placeholder="checkCode.label"
              :class="$style.input"
              type="text"
            />
          </div>
        </template>
        <div :class="$style['btn-wrap']">
          <div :class="$style['btn-cancel']" @click="$emit('cancel')">
            {{ $text("S_CANCEL", "取消") }}
          </div>
          <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">
            {{ $text("S_CONFIRM", "確認") }}
          </div>
        </div>
        <div :class="$style['bottom-tip']">
          <div>{{ $text("S_SECURITY_LEVEL") }}</div>
          <div v-if="countdownSec" :class="$style.important">
            {{ $text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5) }}
            {{ $text("S_FIND_TRASH") }}
          </div>
        </div>
      </div>
      <div v-if="sendMsg" :class="$style['send-email']">
        {{ sendMsg }}
      </div>
    </template>
  </edit-email>
</template>

<script>
import { mapActions } from 'vuex';
import editEmail from '@/components/common/editEmail';

export default {
  components: {
    editEmail
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      oldValue: '',
      newValue: '',
      codeValue: '',
      sendMsg: ''
    };
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    handleSend(send) {
      send().then((response) => {
        if (response.status) {
          this.sendMsg = response.msg;

          setTimeout(() => {
            this.sendMsg = '';
          }, 3000);
        }
      });
    },
    handleSubmit(submit) {
      submit().then((response) => {
        if (response.status) {
          this.$emit('cancel');
        }
      });
    }
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
