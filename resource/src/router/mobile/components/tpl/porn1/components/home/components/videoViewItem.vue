<template>
    <div :class="className" @click="$router.push({ name: 'videoPlay', params: { id: info.id } })">
        <div :class="$style['image-wrap']">
            <img :src="info.image" />
        </div>
        <div :class="$style['vendor-title']">{{ info.title }}</div>
    </div>
</template>

<script>
export default {
    props: {
        isSingle: {
            type: Boolean,
            required: true
        },
        info: {
            type: Object,
            required: true
        }
    },
    computed: {
        className() {
            return this.isSingle ? this.$style.single : this.$style.multiple;
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.video-view-item {
    margin-top: 10px;
}

.multiple {
    composes: video-view-item;
    float: left;
    width: 49%;

    &:nth-child(2n) {
        margin-left: 2%;
    }

    .image-wrap {
        height: 110px;
    }
}

.single {
    composes: video-view-item;
    width: 100%;

    .image-wrap {
        height: 180px;
    }
}

.image-wrap {
    overflow: hidden;
    position: relative;

    > img {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        min-height: 100%;
        margin: auto;
    }
}

.vendor-title {
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
    color: #FFF;
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media screen and (min-width: $phone) {
    .vendor-title {
        font-size: 16px;
    }
}

@media screen and (min-width: $pad) {
    .vendor-title {
        font-size: 18px;
    }
}
</style>
