<template>
    <transition name="fade">
        <div
            id="js-notice-mask-wrap"
            :class="['ele-notice-mask-wrap', config.color]"
        >
            <div id="js-notice-pop" class="notice-pop">
                <h1 class="ele-notice-title">
                    {{ config.title }}
                    <div class="close-btn" @click="close()">
                        <icon
                            name="times"
                            width="22px"
                            height="22px"
                        />
                    </div>
                </h1>
                <div id="js-notice-inner" class="ele-notice-inner clearfix">
                    <!-- 若管端設定一筆資料時，不呈現左方選單 -->
                    <div
                        v-if="popData.length > 1"
                        id="js-notice-sidemenu"
                        class="ele-notice-sidemenu"
                    >
                        <ul>
                            <template v-for="(item, index) in popData">
                                <li :key="index">
                                    <div
                                        :id="`js-notice-menu-${index}`"
                                        :class="`ele-notice-menu ele-notice-menu-${index} ${index === 0 ? 'ele-notice-menu-active' : ''}`"
                                        :title="item.title"
                                        @click="contentToggle(index)"
                                    >
                                        <span class="ele-notice-icon" />{{ item.title }}
                                    </div>
                                    <!-- 行動裝置 - 內容區塊 -->
                                    <div
                                        :id="`js-notice-mobile-content-${index}`"
                                        class="ele-notice-mobile-content"
                                    >
                                        <div id="js-notice-subtitle">{{ item.title }}</div>
                                        <div
                                            v-if="item.image"
                                            :id="`js-notice-mobile-img-${index}`"
                                            class="ele-notice-pop-img"
                                        >
                                            <img :src="eleImg[item.id]" @click="onLinkTo(item.url, item.open, item.title)" />
                                        </div>
                                        <!-- eslint-disable vue/no-v-html -->
                                        <div
                                            v-else-if="item.content"
                                            :id="`js-notice-mobile-content-${index}`"
                                            class="ele-notice-pop-content ckeditor-default-style"
                                            v-html="item.content.replace(/\n/ig, '')"
                                        />
                                        <!-- eslint-enable vue/no-v-html -->
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                    <!-- 電腦版 - 內容區塊 -->
                    <div id="js-notice-content-wrap" class="ele-notice-content-wrap">
                        <template v-for="(item, index) in popData">
                            <div
                                :id="`js-notice-content-${index}`"
                                :key="index"
                                :class="`ele-notice-content ${index === 0 ? 'ele-notice-content-current' : ''}`"
                            >
                                <div
                                    id="js-notice-subtitle"
                                    class="ele-notice-subtitle"
                                >
                                    <span v-if="item.category !== 0" class="category">{{ $t(popupData[index]) }}</span>
                                    <span class="title">{{ item.title }}</span>
                                </div>
                                <div
                                    v-if="item.image"
                                    :id="`js-notice-mobile-img-${index}`"
                                    class="ele-notice-pop-img"
                                >
                                    <img :src="eleImg[item.id]" @click="onLinkTo(item.url, item.open, item.title)" />
                                </div>
                                <!-- eslint-disable vue/no-v-html -->
                                <div
                                    v-else-if="item.content"
                                    :id="`js-notice-mobile-content-${index}`"
                                    class="ele-notice-pop-content ckeditor-default-style"
                                    v-html="item.content.replace(/\n/ig, '')"
                                />
                                <!-- eslint-enable vue/no-v-html -->
                            </div>
                        </template>
                    </div>
                </div>
                <div
                    v-if="config.popup"
                    id="js-notice-bottom"
                    class="ele-notice-bottom"
                >
                    <label class="ele-notice-checkbox">
                        <input
                            id="checkbox"
                            type="checkbox"
                            @click="showToggle"
                        />{{ $t('S_NO_SHOW_AGAIN') }}
                    </label>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';

export default {
    props: {
        config: {
            type: Object,
            default: () => ({})
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            popData: [], // 要顯示的資料
            popupData: [], // 要顯示的類別資料
            eleImg: {} // 圖片src路徑
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        const { data } = this;

        data.forEach((item) => {
            let category;

            switch (item.category) {
                case 1:
                    category = 'S_HOT_NEWS_2';
                    break;
                case 2:
                    category = 'S_POPUP_IMPORTANT';
                    break;
                case 3:
                    category = 'S_POPUP_ACTIVITY';
                    break;
                case 4:
                    category = 'S_POPUP_MAINTENANCE';
                    break;
                default:
                    category = 'S_POPUP_NONE';
                    break;
            }

            this.popData.push({
                ...item
            });

            this.popupData.push(category);

            if (item.image) {
                common.image({
                    success: (res) => {
                        const img = {
                            ...this.eleImg,
                            [item.id]: res.ret
                        };
                        this.eleImg = img;
                    }
                }, item.image);
            }
        });
    },
    mounted() {
        $(window).resize(this.resize);
        $(window).trigger('resize');
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        resize() {
            if (!$('#js-notice-mask-wrap').is(':visible')) {
                return;
            }

            const { config } = this;
            const dataLength = this.data.length;
            const eleWin = $(window);
            const eleNotice = $('#js-notice-pop');
            const eleWrap = $('#js-notice-inner');
            const eleMenu = $('#js-notice-sidemenu');
            const eleContent = $('#js-notice-content-wrap');
            let eleNoticeWidth;
            let eleNoticeHeight;
            let eleContentWidth;
            let eleContentHeight;
            let eleNoticeSet;
            let eleWrapSet;
            let eleMenuSet;
            let eleContentSet;
            let positionX;
            let positionY;

            // 若有左側選單
            if (dataLength > 1) {
                // 348 => 左側選單寬度
                // 30  => 右側內容區塊左右padding
                eleContentWidth = config.width + 30;
                eleNoticeWidth = eleContentWidth + 348;

                // 15 => 內容區塊上方padding
                // 60 => 上方標題區塊
                eleContentHeight = config.height + 15;
                eleNoticeHeight = eleContentHeight + 60;

                // 若有下方不要再顯示區塊
                if (config.popup) {
                    // 59 => 下方不要再顯示區塊
                    eleNoticeHeight += 59;
                }

                if (eleWin.width() > eleNoticeWidth) {
                    eleContentSet = {
                        display: 'block',
                        width: `${eleContentWidth}px`
                    };

                    eleMenuSet = {
                        float: 'left',
                        width: '348px',
                        height: `${eleContentHeight}px`
                    };

                    eleNoticeSet = {
                        height: eleWin.height() > eleNotice.height() ? `${eleNoticeHeight}px` : eleWin.height()
                    };
                } else {
                    // 寬度不滿版
                    eleNoticeWidth = eleWin.width() - 50;

                    eleContentSet = {
                        display: 'none'
                    };

                    eleMenuSet = {
                        float: 'none',
                        width: '100%',
                        height: 'auto'
                    };

                    eleNoticeSet = {
                        height: 'auto'
                    };
                }

                if (eleWin.height() > eleNoticeHeight) {
                    eleContentSet = {
                        ...eleContentSet,
                        height: `${eleContentHeight}px`
                    };
                } else {
                    eleNoticeHeight = eleWin.height();
                    // 高度不滿版
                    eleContentHeight = eleNoticeHeight - 130;

                    if (config.popup) {
                        eleContentHeight -= 59;
                    }

                    eleContentSet = {
                        ...eleContentSet,
                        height: `${eleContentHeight}px`
                    };

                    eleMenuSet.height = `${eleContentHeight}px`;
                }

                if (eleWin.width() < eleNotice.width() && eleWin.height() < eleNotice.height()) {
                    eleMenuSet.height = 'auto';
                }

                eleWrapSet = {
                    'max-height': `${eleContentHeight + 1}px`
                };

                if ((eleWin.width() - 50) > eleNotice.width()) {
                    eleWrapSet = {
                        ...eleWrapSet,
                        overflow: 'hidden'
                    };
                } else {
                    eleWrapSet = {
                        ...eleWrapSet,
                        overflow: 'auto'
                    };
                }

                positionX = Math.floor((eleWin.width() - eleNoticeWidth) / 2);
                // 留置頂空間
                positionY = Math.floor((eleWin.height() - eleNoticeHeight) / 2) + 30;

                eleNoticeSet = {
                    ...eleNoticeSet,
                    top: `${positionY}px`,
                    left: `${positionX}px`,
                    width: `${eleNoticeWidth}px`,
                    margin: 0
                };

                eleContent.css(eleContentSet);
                eleMenu.css(eleMenuSet);
                eleWrap.css(eleWrapSet);
                eleNotice.css(eleNoticeSet);
            } else {
                eleContentWidth = config.width + 30;
                eleNoticeWidth = eleContentWidth;

                eleContentHeight = config.height + 15;
                eleNoticeHeight = eleContentHeight + 60;

                if (config.popup) {
                    eleNoticeHeight += 59;
                }

                if (eleWin.width() < eleNoticeWidth) {
                    // 寬度不滿版, 外層與內容同寬
                    eleNoticeWidth = eleWin.width() - 50;
                    eleContentWidth = eleNoticeWidth;
                }

                if (eleWin.height() < eleNoticeHeight) {
                    // 高度不滿版
                    eleNoticeHeight = eleWin.height() - 60;
                    eleContentHeight = eleNoticeHeight - 60 - 1;

                    if (config.popup) {
                        eleContentHeight -= 59;
                    }
                }

                positionX = Math.floor((eleWin.width() - eleNoticeWidth) / 2);
                positionY = Math.floor((eleWin.height() - eleNoticeHeight) / 2);

                eleContentSet = {
                    width: `${eleContentWidth}px`,
                    height: `${eleContentHeight}px`
                };

                eleNoticeSet = {
                    top: `${positionY}px`,
                    left: `${positionX}px`,
                    width: `${eleNoticeWidth}px`,
                    height: `${eleNoticeHeight}px`,
                    margin: 0
                };

                eleContent.removeAttr('style');
                eleContent.css(eleContentSet);
                eleNotice.css(eleNoticeSet);
            }

            if (dataLength > 1) {
                if ((eleWin.width() - 50) > eleNoticeWidth) {
                    $('.ele-notice-mobile-current').stop().slideUp();
                } else {
                    $('.ele-notice-mobile-content').removeClass('ele-notice-mobile-current');
                    $('.ele-notice-menu-active').next('.ele-notice-mobile-content').addClass('ele-notice-mobile-current');
                    $('.ele-notice-mobile-current').stop().css('height', 'auto').slideDown(() => {
                        if (eleWin.height() <= eleNotice.height()) {
                            eleNoticeHeight = eleWin.height();
                        }

                        positionY = Math.floor((eleWin.height() - eleNoticeHeight) / 2);
                        eleNotice.css('top', `${positionY}px`);
                    });
                }
            }
        },
        close() {
            $('#js-notice-mask-wrap').fadeOut(300);
            this.actionSetPop();
        },
        contentToggle(index) {
            const win = $(window);
            const notice = $('#js-notice-pop');

            $('.ele-notice-menu').removeClass('ele-notice-menu-active')
                .eq(index)
                .addClass('ele-notice-menu-active');

            /* 電腦版 - 內容區塊切換 */
            $('.ele-notice-content').removeClass('ele-notice-content-current')
                .eq(index)
                .addClass('ele-notice-content-current');

            /* 行動裝置 - 內容區塊切換 */
            if ((win.width() - 50) <= notice.width()) {
                if ($(`#js-notice-mobile-content-${index}`).is(':visible')) {
                    return;
                }
                $('.ele-notice-mobile-content').slideUp();
                $('.ele-notice-menu-active').next('.ele-notice-mobile-content').addClass('ele-notice-content-current');
                $('.ele-notice-menu-active').next('.ele-notice-mobile-content').slideDown();

                $('html, body').delay('200').animate({
                    scrollTop: 60 + (50 * index)
                }, 200, () => {
                    $(window).trigger('resize');
                });
            }
        },
        showToggle() {
            const isLogin = this.loginStatus ? 'Y' : 'N';
            const { config } = this;
            const cookieName = `postStatus${isLogin + config.last_modified_at}`;

            if ($(this.$el).find('#checkbox').prop('checked')) {
                this.$cookie.set(cookieName, $(this.$el).find('#checkbox').prop('checked'), { path: '/', expires: '' });
                return;
            }
            this.$cookie.set(cookieName, '', { path: '/', expires: -1 });
        },
        onLinkTo(url, open, title) {
            let target;
            let setting;

            switch (open) {
                case 1:
                    target = '_self';
                    break;
                case 2:
                    target = '_blank';
                    break;
                case 3:
                    target = title;
                    setting = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=2,width=1024,height=640';
                    break;
                default:
                    target = '_self';
                    break;
            }

            if (setting) {
                window.open(url, target, setting);
                return;
            }

            window.open(url, target);
        }
    }
};
</script>

<style lang="scss" src="@/css/fckeditor.scss" scoped></style>
<style lang="scss" src="../../../css/post/2/index.scss" scoped></style>
