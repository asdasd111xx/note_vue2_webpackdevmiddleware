<template>
    <div
        v-if="!isClosed"
        :class="mainClass"
    >
        <div
            v-for="(item, index) in itemData.floatPic"
            :key="index"
            class="image-wrap clearfix"
            @mouseover="onImageIn(index)"
            @mouseleave="onImageOut(index)"
        >
            <img
                :ref="`image-${index}`"
                :src="$getCdnPath(`${cdnDomain}${item.img}`)"
                class="image-default"
                @load="onImageLoad('image')"
            />
            <div :ref="`image-hover-${index}`" class="hover-box">
                <img
                    :src="$getCdnPath(`${cdnDomain}${item.img_hover}`)"
                    class="image-hover"
                    @click="onItemClick(item)"
                    @load="onImageLoad('imageHover')"
                />
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        itemIndex: {
            type: Number,
            required: true
        },
        itemData: {
            type: Object,
            required: true
        },
        floatSide: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isClosed: false,
            isImgLoad: {
                image: false,
                imageHover: false
            }
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd'
        }),
        mainClass() {
            return [
                'item-wrap',
                `side-${this.floatSide}`,
                'clearfix'
            ];
        },
        isReady() {
            return Object.keys(this.isImgLoad)
                .map((imageType) => this.isImgLoad[imageType])
                .every((status) => status);
        }
    },
    watch: {
        isReady(nowValue) {
            if (nowValue) {
                this.$emit('onReady', this.itemIndex);
            }
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onImageIn(index) {
            $(this.$refs[`image-${index}`]).css('display', 'none');
            $(this.$refs[`image-hover-${index}`]).css('width', 'auto');
        },
        onImageOut(index) {
            $(this.$refs[`image-${index}`]).css('display', '');
            $(this.$refs[`image-hover-${index}`]).width('');
        },
        onItemClick(item) {
            if (this.isBackEnd) {
                return;
            }
            if (item.linkType === 'close') {
                this.isClosed = true;
                return;
            }

            this.actionChangePage({
                page: item.linkTo,
                type: item.linkType,
                config: {
                    width: item.openSetWitdth,
                    height: item.openSetHeight,
                    linkItem: item.linkItem
                }
            });
        },
        onImageLoad(imageType) {
            this.isImgLoad = {
                ...this.isImgLoad,
                [imageType]: true
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.item-wrap {
    clear: both;

    &.side-right {
        float: right;

        img,
        .hover-box, {
            float: left;
        }

        .image-wrap {
            float: right;
        }
    }

    &.side-left {
        float: left;

        img,
        .hover-box {
            float: right;
        }
        .image-wrap {
            float: left;
        }
    }

    .image-wrap {
        clear: both;

        img {
            cursor: pointer;
        }

        .hover-box {
            width: 0;
            transition: width .6s ease;
            overflow: hidden;
        }
    }
}
</style>
