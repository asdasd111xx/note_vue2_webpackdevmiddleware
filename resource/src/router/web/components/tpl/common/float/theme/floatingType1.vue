<template>
    <div
        v-if="!isClosed"
        :class="mainClass"
        @mouseleave="onItemLeave"
    >
        <img
            ref="tag"
            :src="$getCdnPath(`${cdnDomain}${itemData.themeImg}`)"
            class="floating-tag"
            @load="onImageLoad('tag')"
        />
        <img
            ref="tag"
            :src="$getCdnPath(`${cdnDomain}${itemData.themeImg_hover}`)"
            class="floating-tag-hover"
            @mouseover="onTagHover"
            @load="onImageLoad('tagHover')"
        />
        <div ref="collapse" class="collapse">
            <div
                v-for="(item, index) in itemData.floatPic"
                :key="index"
                class="image-wrap"
            >
                <img
                    :src="$getCdnPath(`${cdnDomain}${item.img}`)"
                    class="image-default"
                    @load="onImageLoad('image')"
                />
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
            collapseWidth: '',
            isImgLoad: {
                tag: false,
                tagHover: false,
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
        onTagHover() {
            const $collapse = $(this.$refs.collapse);

            if ($collapse.width()) {
                return;
            }

            /* 為了取得 collapse 寬度
               先將寬度設為 auto 取寬後將 auto 移除，再將正確的寬度塞回
               目的是為了達成動畫效果 */
            $collapse.css('width', 'auto');
            $($collapse).find('img').css({
                display: 'block',
                float: 'none'
            });
            const collapseWidth = $collapse.width();
            $collapse.css('width', '');
            $($collapse).find('img').css({
                display: '',
                float: ''
            });
            $collapse.css('width', collapseWidth);
        },
        onItemLeave() {
            $(this.$refs.collapse).css('width', '');
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

    &:hover {
        .floating-tag {
            display: none;
        }

        .floating-tag-hover {
            display: block;
        }
    }

    &.side-right {
        float: right;

        img {
            float: left;

            &.floating-tag,
            &.floating-tag-hover {
                float: left;
            }
        }

        .image-wrap {
            float: left;
        }
    }

    &.side-left {
        float: left;

        img {
            float: right;

            &.floating-tag,
            &.floating-tag-hover {
                float: right;
            }
        }
        .image-wrap {
            float: right;
        }
    }

    .floating-tag-hover {
        display: none;
    }

    .collapse {
        float: right;
        width: 0;
        overflow: hidden;
        transition: width .6s ease;
    }

    .image-wrap {
        clear: both;

        img {
            cursor: pointer;
        }

        .image-hover {
            display: none;
        }

        &:hover {
            .image-default {
                display: none;
            }

            .image-hover {
                display: block;
            }
        }
    }
}
</style>
