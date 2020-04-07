<template>
    <div :class="$style['search-wrap-bg']">
        <div :class="$style['search-block']">
            <div :class="$style['search-img']" />
            <input
                v-model="searchText"
                :class="[
                    $style['search-input'],
                    { [$style['no-data']]: isGameDataReceive && gameNum === 0 }
                ]"
                :placeholder="$text('S_ENTER_GAME_NAME')"
                type="text"
            />
        </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';

/**
 * 共用元件 - 手機網頁版 遊戲大廳使用搜尋框
 * @param {String} [theme=1] - 樣式; 值：1
 * @param {String} [text] - 搜尋文字
 * @param {Number} [gameNum] - 搜尋到的遊戲數量
 * @param {Function} [setSearchText] - 更新搜尋文字
 */
export default {
    props: {
        isGameDataReceive: {
            type: Boolean,
            required: true
        },
        theme: {
            type: String,
            default: '1'
        },
        text: {
            type: String,
            default: ''
        },
        gameNum: {
            type: Number,
            required: true
        },
        setSearchText: {
            type: Function,
            required: true
        }
    },
    computed: {
        $style() {
            return this[`$style_${this.theme}`] || this.$style_theme1Gold;
        },
        searchText: {
            get() {
                return this.text;
            },
            set(value) {
                debounce(() => { this.setSearchText(value); }, 600)();
            }
        }
    }
};
</script>

<style lang="scss" src="./css/theme1Gold.module.scss" module="$style_theme1Gold"></style>
<style lang="scss" src="./css/theme1Orange.module.scss" module="$style_theme1Orange"></style>
<style lang="scss" src="./css/theme3.module.scss" module="$style_theme3"></style>
<style lang="scss" src="./css/themeMiller.module.scss" module="$style_themeMiller"></style>
<style lang="scss" src="./css/basicMobile.module.scss" module="$style_basicMobile"></style>
<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
