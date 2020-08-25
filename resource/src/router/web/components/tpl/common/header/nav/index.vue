<template>
    <ele1
        v-if="theme === 1"
        :nav-max="navMax"
        :icon-type="iconType"
        :icon-width="iconWidth"
        :icon-height="iconHeight"
        :animation-type="animationType"
    />
</template>

<script>
export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1')
    },
    props: {
        theme: {
            type: Number,
            default: null
        },
        iconType: {
            type: String,
            default: null // more icon 圖示
        },
        iconWidth: {
            type: Number,
            default: null // more icon 寬度
        },
        iconHeight: {
            type: Number,
            default: null // more icon 高度
        },
        navMax: {
            type: Number,
            default: null // 導覽列,最大可顯示數量
        },
        animationType: {
            type: String,
            default: null // 下拉選單動畫樣式
        }
    }
};
</script>
