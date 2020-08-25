<template>
    <div
        v-if="isChangeVerShow"
        class="change-ver-wrap"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
    >
        <div class="change-ver-mask" />
        <div class="change-ver-img">
            <img :src="$getCdnPath(`${cdnDomain}${webInfo.multi_config.switch_image}`)" @click="goToNewsite" />
        </div>
        <template v-if="isCloseBtnShow">
            <div class="change-ver-close" @click="onClose" />
        </template>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .change-ver-mask[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/common/changeVer/spritesheet.png') }}) -240px -240px no-repeat;
            }

            .change-ver-close[{{ this.$options._scopeId }}]:hover {
                background: url({{ $getCdnPath('/static/image/tpl/common/changeVer/spritesheet.png') }}) -319px -621px no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            isChangeVerShow: true,
            isCloseBtnShow: true,
            isClosing: false
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            isPreview: 'getIsPreview',
            webInfo: 'getWebInfo'
        })
    },
    methods: {
        /**
         * 前往新版
         * @method goToNewsite
         */
        goToNewsite() {
            if (this.isBackEnd) {
                return;
            }

            if (this.isPreview) {
                return;
            }

            window.location.href = '?newsite=Y';
        },
        /**
         * 拉頁動畫
         * @method onInterval
         * @param {array} offsetBase - 拉頁圖片定位
         * @param {array} imgOffsetBase - 拉頁遮罩圖片背景定位
         * @param {boolean} changeVerHide - 是否關閉拉頁
         */
        onInterval(offsetBase, imgOffsetBase, changeVerHide) {
            let i = 0;
            const time = setInterval(() => {
                if (i < offsetBase.length) {
                    $('.change-ver-img').css({
                        top: -offsetBase[i],
                        right: -(122 + offsetBase[i])
                    }).find('img').css({
                        marginTop: offsetBase[i],
                        marginLeft: -(122 + (offsetBase[i] * 2))
                    });
                    $('.change-ver-mask').css('background-position', imgOffsetBase[i]);
                    i += 1;

                    return;
                }

                if (changeVerHide) {
                    this.isChangeVerShow = false;
                }

                window.clearInterval(time);
            }, 60);
        },
        /**
         * 滑鼠移入事件
         * @method onEnter
         */
        onEnter() {
            if (this.isClosing) {
                return;
            }

            const offsetBase = [23, 0];
            const imgOffsetBase = ['-480px -240px', '0 -480px'];
            this.onInterval(offsetBase, imgOffsetBase);
        },
        /**
         * 滑鼠移出事件
         * @method onLeave
         */
        onLeave() {
            if (this.isClosing) {
                return;
            }

            const offsetBase = [23, 42];
            const imgOffsetBase = ['-480px -240px', '-240px -240px'];
            this.onInterval(offsetBase, imgOffsetBase);
        },
        /**
         * 關閉拉頁
         * @method onClose
         */
        onClose() {
            if (this.isBackEnd) {
                return;
            }

            this.isClosing = true;
            this.isCloseBtnShow = false;
            const offsetBase = [23, 42, 61, 80, 100, 120];
            const imgOffsetBase = ['-480px -240px', '-240px -240px', '0px -240px', '-480px 0px', '-240px 0px', '0px 0px'];
            this.onInterval(offsetBase, imgOffsetBase, true);
        }
    }
};
</script>

<style lang="scss" scoped>
.change-ver-wrap {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 11;
    overflow: hidden;
    width: 240px;
    height: 240px;
}

.change-ver-mask {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 240px;
    height: 240px;
}

.change-ver-img {
    position: absolute;
    top: -61px;
    right: -145px;
    overflow: hidden;
    width: 240px;
    height: 240px;
    transform: skew(45deg, 0deg);
    cursor: pointer;

    img {
        display: block;
        width: 240px;
        height: 240px;
        margin: 61px 0 0 -206px;
        transform: skew(-45deg, 0deg);
    }
}

.change-ver-close {
    position: absolute;
    top: 140px;
    right: 97px;
    width: 63px;
    height: 20px;
    cursor: pointer;
}
</style>
