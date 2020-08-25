<template>
    <div id="mainnav-wrap" class="mainnav-wrap">
        <div class="nav clearfix">
            <!-- 尚未有nav-item元素，先放空元素替代 -->
            <span class="nav-item" style="display:none;" />
            <!-- eslint-disable vue/no-use-v-if-with-v-for -->
            <div
                v-for="(item, index) in navs"
                v-if="index < navQuantity"
                :key="index"
                :class="`nav-${item.pid} nav-item`"
                @mouseover="current = index"
                @mouseleave="current = ''"
            >
                <!-- eslint-enable vue/no-use-v-if-with-v-for -->
                <span
                    :class="nowPage == item.pid || nowPage == item.page_type ? 'current' : ''"
                    :title="item.name[$i18n.locale]"
                    @click="$emit('changePage', {
                        page: item.page_key || item.linkTo || item.pid,
                        type: item.page_key ? '' : item.page_type || '',
                        config: {
                            linkItem: item.linkItem
                        }
                    })"
                >
                    {{ item.name[$i18n.locale] }}
                </span>
                <div v-if="item.sub_page && current === index" class="nav-sub">
                    <div
                        v-for="(subItem, subIndex) in item.sub_page"
                        :key="subIndex"
                        :title="subItem.name[$i18n.locale]"
                        class="nav-item-sub"
                        @click="$emit('changePage', {
                            page: subItem.page_key || subItem.linkTo || subItem.pid,
                            type: subItem.page_key ? '' : subItem.page_type || '',
                            config: {
                                linkItem: subItem.linkItem
                            }
                        })"
                    >
                        {{ subItem.name[$i18n.locale] }}
                    </div>
                </div>
            </div>
            <div
                v-if="isMore"
                :class="`${isMoreList ? 'current' : ''} nav-more`"
                @click="isMoreList = !isMoreList"
            >
                +
                <div v-if="isMoreList" class="nav-more-list">
                    <!-- eslint-disable vue/no-use-v-if-with-v-for -->
                    <span
                        v-for="(item, index) in navs"
                        v-if="index >= navQuantity"
                        :key="index"
                        :class="[{'current': nowPage == item.pid || nowPage == item.page_type}, `nav-${item.pid} nav-item`]"
                        :title="item.name[$i18n.locale]"
                        @click="$emit('changePage', {
                            page: item.page_key || item.linkTo || item.pid,
                            type: item.page_key ? '' : item.page_type || '',
                            config: {
                                linkItem: item.linkItem
                            }
                        })"
                    >
                        {{ item.name[$i18n.locale] }}
                    </span>
                    <!-- eslint-enable vue/no-use-v-if-with-v-for -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            navs: [],
            navQuantity: 0,
            isMore: false,
            isMoreList: false,
            navCount: 0,
            current: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            gameData: 'getGameData',
            popType: 'getPopType',
            nowPage: 'getNowpage',
            webInfo: 'getWebInfo',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        // 前台才動作
        if (!this.isBackEnd) {
            this.$on('changePage', this.changePage);
        }
        this.webInfo.page.forEach((value, index) => {
            const pageId = this.webInfo.page[index].pid;
            // 導覽列
            if (this.webInfo.pageData[pageId].page_show === 'Y' && !(this.loginStatus && this.webInfo.pageData[pageId].linkTo === 'join')) {
                // 如果廳主未開代理, 加入代理不顯示
                if (this.webInfo.pageData[pageId].page_key === 'joinAgent' && !this.memInfo.config.agent_register) {
                    return;
                }
                this.navs.push({
                    ...this.webInfo.page[index],
                    linkItem: ''
                });
            }
        });
        this.navCount = this.navs.length;
    },
    mounted() {
        this.widthSetting();

        $(window).resize(() => {
            this.widthSetting();
        });
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(data) {
            this.actionChangePage(data);
        },
        widthSetting() {
            const navWrapWidth = $(this.$el).width() - 17;
            const navWidth = $(this.$el).find('.nav-item').outerWidth(true);
            this.navQuantity = Math.floor(navWrapWidth / navWidth);
            if (this.navCount > this.navQuantity) {
                this.isMore = true;
            } else {
                this.isMore = false;
            }
        }
    }
};
</script>
