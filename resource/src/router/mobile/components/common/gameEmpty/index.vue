<template>
    <div :class="$style['empty-wrap']">
        <div :class="[$style['empty-icon'], $style[nowType]]" />
        <div>{{ nowType === 'activity' ? $text('S_NO_ACTIVITY', '暂无活动') : $text('S_NO_GAME', '未查询到相关游戏') }}</div>
    </div>
</template>

<script>
/**
 * 共用元件 - 手機網頁版 遊戲大廳使用分類選單
 * @param {String} [theme] - 樣式
 */
export default {
    props: {
        theme: {
            type: String,
            required: true
        },
        nowType: {
            type: String,
            default: ''
        }
    },
    computed: {
        $style() {
            return this[`$style_${this.theme}`] || this.$style_theme1Gold;
        }
    }
};
</script>

<style lang="scss" src="./css/theme1Gold.module.scss" module="$style_theme1Gold"></style>
<style lang="scss" src="./css/theme3.module.scss" module="$style_theme3"></style>
<style lang="scss" src="./css/basicMobile.module.scss" module="$style_basicMobile"></style>
<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
