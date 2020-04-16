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

<style lang="scss" src="./css/porn1.module.scss" module></style>
