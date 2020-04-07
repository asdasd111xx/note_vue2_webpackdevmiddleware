<template>
    <div :class="[$style.wrap, 'clearfix']">
        <slot name="title-icon" />
        <slot name="close-icon" />
        <div :class="$style['body-wrap']">
            <div :class="$style['title-text']">{{ $t('S_JOIN_MEMBER') }}</div>
            <!-- 帳號 -->
            <div :class="$style['field-wrap']">
                <div :class="$style[`join-username`] || $style['join-input-wrap']">
                    <input
                        :title="text.username"
                        :placeholder="text.username"
                        :maxlength="field.username.max"
                        :class="[$style['join-input-username'] || $style['join-input'], fieldValue.username ? '' : $style['notext-input']]"
                        :value="fieldValue.username"
                        @input="onInput($event, 'username')"
                        @keydown.13="onSubmit"
                    />
                </div>
                <span v-show="errorMsg.username" :class="$style['join-tips']">{{ errorMsg.username }}</span>
            </div>
            <!-- 密碼 -->
            <div :class="$style['field-wrap']">
                <div :class="$style[`join-password`] || $style['join-input-wrap']">
                    <input
                        :title="text.password"
                        :placeholder="text.password"
                        :maxlength="field.password.max"
                        :class="[$style['join-input-password'] || $style['join-input'], fieldValue.password ? '' : $style['notext-input']]"
                        :value="fieldValue.password"
                        type="password"
                        @input="onInput($event, 'password')"
                        @keydown.13="onSubmit"
                    />
                </div>
                <!-- eslint-disable vue/no-v-html -->
                <span
                    v-show="errorMsg.password"
                    :class="$style['join-tips']"
                    v-html="errorMsg.password"
                />
                <!-- eslint-enable vue/no-v-html -->
            </div>
            <!-- 確認密碼 -->
            <div :class="$style['field-wrap']">
                <div :class="$style[`join-confirm_password`] || $style['join-input-wrap']">
                    <input
                        :title="text.confirm_password"
                        :placeholder="text.confirm_password"
                        :maxlength="field.password.max"
                        :class="[$style['join-input-confirm_password'] || $style['join-input'], fieldValue.confirm_password ? '' : $style['notext-input']]"
                        :value="fieldValue.confirm_password"
                        type="password"
                        @input="onInput($event, 'confirm_password')"
                        @keydown.13="onSubmit"
                    />
                </div>
                <span v-show="errorMsg.confirm_password" :class="$style['join-tips']">{{ errorMsg.confirm_password }}</span>
            </div>
            <!-- 驗證碼 -->
            <div v-if="memInfo.config.register_captcha_type === 1" :class="$style['field-wrap']">
                <div :class="$style[`join-captcha_text`] || $style['join-input-wrap']">
                    <input
                        :title="text.reloadPic"
                        :placeholder="text.captcha_text"
                        :maxlength="field.captcha_text.max"
                        :class="[$style['join-input-captcha_text'] || $style['join-input'], fieldValue.captcha_text ? '' : $style['notext-input']]"
                        :value="fieldValue.captcha_text"
                        @focus="getCaptcha"
                        @input="onInput($event, 'captcha_text')"
                        @keydown.13="onSubmit"
                    />
                    <img
                        v-if="captchaImg"
                        :src="captchaImg"
                        :class="$style['captcha-img']"
                        @click="getCaptcha"
                    />
                </div>
            </div>
            <slide-verification
                v-if="memInfo.config.register_captcha_type === 2"
                :is-enable="isSlideAble"
                :class="$style['slide-join-btn']"
                :success-fuc="onSubmit"
                page-status="register"
            />
            <!-- 加入會員 -->
            <div
                v-else
                :class="$style['join-btn']"
                @click="onSubmit"
            >
                {{ text.join }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@/api/common';
import slideVerification from '@/components/slideVerification';

export default {
    components: {
        slideVerification
    },
    props: {
        theme: {
            type: Object,
            required: true
        },
        field: {
            type: Object,
            required: true
        },
        text: {
            type: Object,
            required: true
        },
        fieldValue: {
            type: Object,
            required: true
        },
        errorMsg: {
            type: Object,
            required: true
        },
        onSubmit: {
            type: Function,
            required: true
        },
        onClose: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            captchaImg: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        $style() {
            if (this.theme) {
                return this.theme;
            }

            return this.$styleDefault;
        },
        isSlideAble() {
            let checkResult = true;
            const slideField = Object.keys(this.fieldValue).filter((key) => key !== 'captcha_text');

            slideField.forEach((fieldName) => {
                if (!this.fieldValue[fieldName] || this.errorMsg[fieldName]) {
                    checkResult = false;
                }
            });

            return checkResult;
        }
    },
    methods: {
        /**
         * 取得驗證碼
         * @method getCaptcha
         */
        getCaptcha() {
            common.captcha({
                success: (response) => {
                    this.captchaImg = response.ret;
                }
            });
        },
        onInput(e, fieldName) {
            this.$emit('update:fieldValue', {
                ...this.fieldValue,
                [fieldName]: e.target.value
            });
        }
    }
};
</script>

<style src="../css/template1.scss" lang="scss" module="$styleDefault">
