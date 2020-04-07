<template>
    <div class="recommend-wrap">
        <div class="top-recommend-wrap">
            <div class="close" @click="$emit('close')" />
            <div class="title">{{ $text('S_FIRST_LEVEL_FRIEND_RECOMMANDED') }}</div>
        </div>
        <div class="register-wrap">
            <div
                v-for="key in allInput"
                :key="key"
                class="input-group"
            >
                <!-- 欄位名稱 -->
                <div :class="[{ active: allValue[key], error: allText[key].error }]">{{ $text(allText[key].placeholder) }}</div>
                <!-- 輸入框 -->
                <div class="placeholder">
                    <template v-if="!allValue[key]">
                        {{ $text(texts[key].placeholder) }}
                    </template>
                    <input
                        v-validate="'required'"
                        :class="[{ active: allValue[key], error: allText[key].error, 'show-placeholder': !allValue[key] }, key]"
                        :maxlength="allText[key].maxLength"
                        :type="allText[key].type"
                        :value="allValue[key]"
                        data-vv-scope="form-page"
                        @input="onInput($event.target.value, key)"
                        @keydown.13="onSubmit"
                    />
                </div>
            </div>
            <!-- 錯誤訊息 -->
            <div class="error-message-wrap">
                <template v-for="key in allInput">
                    <div
                        v-if="allText[key].error && texts[key].error"
                        :key="key"
                        class="error-message"
                    >
                        {{ $text(texts[key].error) }}
                    </div>
                </template>
            </div>
            <button @click="onSubmit">{{ $text('S_ADD') }}</button>
        </div>
    </div>
</template>

<script>
import mixinRecommend from '@/mixins/mcenter/management/mixinRecommend';

/**
 * @param {String} code - 推廣代碼
 */
export default {
    mixins: [mixinRecommend],
    props: {
        code: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            texts: {
                username: {
                    placeholder: 'S_USERNAME_ERROR',
                    error: 'S_USERNAME_ERROR'
                },
                // 密碼
                password: {
                    placeholder: 'S_PASSWORD_ERROR',
                    error: 'S_PASSWORD_ERROR'
                },
                // 確認密碼
                confirm_password: {
                    placeholder: 'S_PWD_CONFIRM',
                    error: 'S_JM_PASSWD_CONFIRM_ERROR'
                },
                // 會員姓名
                name: {
                    placeholder: 'S_REGISTER_TIPS',
                    error: ''
                }
            }
        };
    }
};
</script>

<style lang="scss" src="../css/recommend.scss" scoped></style>
