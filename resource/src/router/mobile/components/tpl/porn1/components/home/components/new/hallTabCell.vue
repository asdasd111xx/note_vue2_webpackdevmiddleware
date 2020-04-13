<template>
    <div @click="onClickHallSlide(index)">
        <img
            v-if="seletedIndex === index"
            :src="$getCdnPath(hallTab.hImgSrc)"
            alt="thumb"
        />
        <img v-else :src="$getCdnPath(hallTab.nImgSrc)" alt="thumb" />
        <div :class="['thumb-title', { active: seletedIndex === index }]">
            {{ hallTab.title }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        hallTab: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            seletedIndex: 0
        };
    },
    methods: {
        onClickHallSlide(index) {
            this.seletedIndex = index;
        }
    }
};
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
.thumb-title {
    position: absolute;
    width: 100%;
    top: 37.5px;
    text-align: center;
    font-size: 12px;
    color: #a6a9b2;

    &.active {
        color: white;
    }
}
</style>
