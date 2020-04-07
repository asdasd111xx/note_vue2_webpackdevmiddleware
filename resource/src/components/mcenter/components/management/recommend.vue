<template>
    <div class="recommend-wrap">
        <div class="mask" />
        <div class="recommend-container">
            <div class="top-recommend-wrap">
                <div class="title">{{ $text('S_FIRST_LEVEL_FRIEND_RECOMMANDED') }}</div>
                <div class="close" @click.stop="$emit('close')">×</div>
            </div>
            <div class="register-wrap">
                <template v-for="key in allInput">
                    <div :key="key" class="input-field clearfix">
                        <div class="title">{{ $text(allText[key].placeholder) }}</div>
                        <div class="input-wrap">
                            <!-- 輸入框 -->
                            <input
                                v-validate="'required'"
                                :class="[{ active: allValue[key], error: allText[key].error }]"
                                :maxlength="allText[key].maxLength"
                                :type="allText[key].type"
                                :value="allValue[key]"
                                data-vv-scope="form-page"
                                @input="onInput($event.target.value, key)"
                                @keydown.13="onSubmit"
                            />
                            <!-- 提示與錯誤訊息 -->
                            <div v-if="key === 'name' || allText[key].error" :class="mainClass(key)">
                                <template v-if="allText[key].tips">{{ $text(allText[key].tips) }}</template>
                                <template v-if="allText[key].message">{{ $text(allText[key].message) }}</template>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="submit-btn" @click="onSubmit">{{ $text('S_ADD') }}</div>
            </div>
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
    }
};
</script>

<style lang="scss" src="./css/recommend.scss" scoped></style>
