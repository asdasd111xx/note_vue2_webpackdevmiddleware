<template>
    <div :class="$style['join-wrap']">
        <div :class="$style.join">
            <div :class="$style['join-content']">
                <div :class="[$style['field-wrap'], 'clearfix']">
                    <label :class="$style['field-title']" @click="triggerFocus('username')">
                        {{ text.username }}
                        <span :class="$style['join-star']">*</span>
                    </label>
                    <div :class="$style['field-right']">
                        <input
                            ref="field-username"
                            :class="[$style['join-input'], field.key]"
                            :name="field.key"
                            :value="fieldValue.username"
                            type="text"
                            @input="onInput($event, 'username')"
                            @keydown.13="onSubmit"
                        />
                        <div v-show="errorMsg.username" :class="$style['join-tip']">
                            {{ errorMsg.username }}
                        </div>
                    </div>
                </div>
                <div :class="[$style['field-wrap'], 'clearfix']">
                    <label :class="$style['field-title']" @click="triggerFocus('password')">
                        {{ text.password }}
                        <span :class="$style['join-star']">*</span>
                    </label>
                    <div :class="$style['field-right']">
                        <input
                            ref="field-password"
                            :class="[$style['join-input'], field.key]"
                            :name="field.key"
                            :value="fieldValue.password"
                            type="password"
                            @input="onInput($event, 'password')"
                            @keydown.13="onSubmit"
                        />
                        <div v-show="errorMsg.password" :class="$style['join-tip']">
                            {{ errorMsg.password }}
                        </div>
                    </div>
                </div>
                <div :class="[$style['field-wrap'], 'clearfix']">
                    <label :class="$style['field-title']" @click="triggerFocus('confirm_password')">
                        {{ text.confirm_password }}
                        <span :class="$style['join-star']">*</span>
                    </label>
                    <div :class="$style['field-right']">
                        <input
                            ref="field-confirm_password"
                            :class="[$style['join-input'], field.key]"
                            :name="field.key"
                            :value="fieldValue.confirm_password"
                            type="password"
                            @input="onInput($event, 'confirm_password')"
                            @keydown.13="onSubmit"
                        />
                        <!-- eslint-disable vue/no-v-html -->
                        <div
                            v-show="errorMsg.confirm_password"
                            :class="$style['join-tip']"
                            v-html="errorMsg.confirm_password"
                        />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                </div>
                <div :class="[$style['field-wrap'], 'clearfix']">
                    <label :class="$style['field-title']" @click="triggerFocus('captcha_text')">
                        {{ text.captcha_text }}
                        <span :class="$style['join-star']">*</span>
                    </label>
                    <div :class="$style['field-right']">
                        <input
                            ref="field-captcha_text"
                            :class="[$style['join-input-captcha'], field.key]"
                            :value="fieldValue.captcha_text"
                            type="text"
                            name="join-captcha"
                            maxlength="4"
                            @focus="getCaptcha()"
                            @input="onInput($event, 'captcha_text')"
                            @keydown.13="onSubmit"
                        />
                        <img
                            v-if="captchaImg"
                            :src="captchaImg"
                            :class="$style['captcha-img']"
                            @click="getCaptcha()"
                        />
                        <div v-show="errorMsg.captcha_text" :class="$style['join-tip']">
                            {{ errorMsg.captcha_text }}
                        </div>
                    </div>
                </div>
            </div>
            <div :class="$style['join-btn-wrap']">
                <div :class="$style['join-btn']" @click="onSubmit">
                    {{ $t('S_JM_SURE_SEND') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import common from '@/api/common';

export default {
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
        $style() {
            if (this.theme) {
                return this.theme;
            }

            return this.$styleDefault;
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
        },
        triggerFocus(field) {
            if (this.$refs[`field-${field}`]) {
                this.$refs[`field-${field}`].focus();
            }
        }
    }
};
</script>

<style src="../css/template2.scss" lang="scss" module="$styleDefault">
