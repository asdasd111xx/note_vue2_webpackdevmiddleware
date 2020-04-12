<template>
    <edit-phone
        :old-code.sync="oldCode"
        :old-value="oldValue"
        :new-code.sync="newCode"
        :new-value="newValue"
        :code-value="codeValue"
        :info="info"
    >
        <template scope="{ countryCodes, oldPhone, newPhone, checkCode, sendBtn, countdownSec, onSend, onSubmit }">
            <div :class="[$style.wrap, 'clearfix']">
                <template v-if="oldPhone.isShow">
                    <div :class="$style.title">{{ oldPhone.label }}</div>
                    <div :class="[$style['input-wrap'], 'clearfix']">
                        <select v-model="oldCode" :class="[$style.select, $style['phone-select']]">
                            <template v-for="option in countryCodes.options">
                                <option :key="option" :value="option">{{ option }}</option>
                            </template>
                        </select>
                        <input
                            v-model="oldValue"
                            :placeholder="oldPhone.label"
                            :class="[$style.input, $style['phone-input']]"
                            type="text"
                        />
                    </div>
                </template>
                <template v-if="newPhone.isShow">
                    <div :class="$style.title">{{ newPhone.label }}</div>
                    <div :class="[$style['input-wrap'], 'clearfix']">
                        <select v-model="newCode" :class="[$style.select, $style['phone-select']]">
                            <template v-for="option in countryCodes.options">
                                <option :key="option" :value="option">{{ option }}</option>
                            </template>
                        </select>
                        <input
                            v-model="newValue"
                            :placeholder="newPhone.label"
                            :class="[$style.input, $style['phone-input']]"
                            type="text"
                        />
                    </div>
                </template>
                <template v-if="checkCode.isShow">
                    <div :class="$style.title">{{ checkCode.label }}</div>
                    <div :class="[$style['input-wrap'], 'clearfix']">
                        <input
                            v-model="codeValue"
                            :placeholder="checkCode.label"
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
                                (<span>{{ countdownSec }}</span>)
                            </template>
                        </div>
                    </div>
                </template>
                <div :class="$style['btn-wrap']">
                    <div :class="$style['btn-cancel']" @click="$emit('cancel')">{{ $text('S_CANCEL', '取消') }}</div>
                    <div :class="$style['btn-confirm']" @click="handleSubmit(onSubmit)">{{ $text('S_CONFIRM', '確認') }}</div>
                </div>
                <div v-if="countdownSec" :class="$style['bottom-tip']">
                    <div :class="$style.important">
                        {{ $text('S_SEND_CHECK_CODE_VALID_TIME').replace('%s', 5) }}
                        {{ $text('S_FIND_TRASH') }}
                    </div>
                </div>
            </div>
            <div v-if="sendMsg" :class="$style['send-phone']">
                {{ sendMsg }}
            </div>
        </template>
    </edit-phone>
</template>

<script>
import { mapActions } from 'vuex';
import editPhone from '@/components/common/editPhone';

export default {
    components: {
        editPhone
    },
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            oldCode: '',
            newCode: '',
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
