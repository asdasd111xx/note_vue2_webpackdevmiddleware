<template>
    <div
        class="status-bar-wrap"
        @mouseenter="isMenuShow = true"
        @mouseleave="isMenuShow = false"
    >
        <div
            :aria-label="modeMsg"
            class="status-bar hint--top"
            @click="$emit('update:mode', mode === 'edit' ? 'view' : 'edit')"
        >
            <div :class="['cycle', `is-${mode}`]" />
            <div :class="['icon-mode', 'icon-view', { 'is-active': mode === 'view' }]">
                <icon name="eye" scale="1.2" />
            </div>
            <div :class="['icon-mode', 'icon-edit', { 'is-active': mode === 'edit' }]">
                <icon name="edit" scale="1.2" />
            </div>
        </div>
        <div
            v-show="isMenuShow"
            ref="bar-menu"
            class="bar-menu"
        >
            <div class="ui vertical mini menu">
                <!-- 設置 -->
                <div class="ui dropdown item" @click="onSetting">
                    <icon name="cogs" />
                    {{ $t('S_SETTINGS', memInfo.config.lang || 'zh-cn') }}
                </div>
                <!-- 複製至 -->
                <div class="ui dropdown item">
                    <i class="dropdown icon" />
                    <span class="text">
                        <icon name="copy" />
                        {{ $t('S_COPY_TO', memInfo.config.lang || 'zh-cn') }}
                    </span>
                    <div class="right menu">
                        <div
                            v-for="(item, key) in pageOptions"
                            :key="key"
                            class="item"
                            @click="onCopy(item.page_id)"
                        >
                            {{ item.name[memInfo.config.lang || 'zh-cn'] }}
                        </div>
                    </div>
                </div>
                <!-- 同步至 -->
                <div class="ui dropdown item">
                    <i class="dropdown icon" />
                    <span>
                        <icon name="clone" />
                        {{ $t('S_SYNCHRONIZED_TO', memInfo.config.lang || 'zh-cn') }}
                    </span>
                    <div class="right menu">
                        <div
                            v-for="lang in langOptions"
                            :key="lang.type"
                            class="item"
                            @click="onSync(lang.type)"
                        >
                            {{ lang.name }}
                        </div>
                    </div>
                </div>
                <!-- 顯示狀態 -->
                <div class="ui dropdown item">
                    <i class="dropdown icon" />
                    <span>
                        <icon name="eye" />
                        {{ $t('S_PRESENT_STATUS', memInfo.config.lang || 'zh-cn') }}
                    </span>
                    <div class="right menu">
                        <div
                            :class="['item', { 'active': presentStatus === 'logout' }]"
                            @click="$emit('update:presentStatus', 'logout')"
                        >
                            {{ $t('S_BEFORE_LOGIN', memInfo.config.lang || 'zh-cn') }}
                        </div>
                        <div
                            :class="['item', { 'active': presentStatus === 'login' }]"
                            @click="$emit('update:presentStatus', 'login')"
                        >
                            {{ $t('S_AFTER_LOGIN', memInfo.config.lang || 'zh-cn') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';

export default {
    props: {
        mode: {
            type: String,
            required: true
        },
        presentStatus: {
            type: String,
            required: true
        },
        onSetting: {
            type: Function,
            default: () => ({})
        },
        onCopy: {
            type: Function,
            default: () => ({})
        },
        onSync: {
            type: Function,
            default: () => ({})
        }
    },
    data() {
        return {
            isMenuShow: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            page: 'getPage',
            allLanguage: 'getAllLanguage',
            curLang: 'getCurLang',
            lang: 'getLang'
        }),
        modeMsg() {
            const lockLang = this.memInfo.config.lang || 'zh-cn';
            return `${this.$text('S_MODE', { locale: lockLang })}：
            ${this.mode === 'edit' ? this.$text('S_EDIT', { locale: lockLang }) : this.$text('S_PREVIEW', { locale: lockLang })}`;
        },
        /**
         * 取得頁面選單項目
         * @method pageOptions
         */
        pageOptions() {
            const totalPage = this.page.reduce((init, pageInfo) => {
                if (pageInfo.sub_page && pageInfo.sub_page.length) {
                    return [
                        ...init,
                        pageInfo,
                        ...pageInfo.sub_page
                    ];
                }
                return [
                    ...init,
                    pageInfo
                ];
            }, []);

            return totalPage.filter((item) => {
                if (item.page_key && item.page_key === 'joinAgent') {
                    return !this.memInfo.config.infinity;
                }

                return item.page_type === 'custom';
            });
        },
        /**
         * 取得語系選單項目
         * @method langOptions
         */
        langOptions() {
            return this.allLanguage
                .filter((lang) => this.lang[lang.type] && lang.type !== this.curLang);
        }
    },
    mounted() {
        $(this.$refs['bar-menu']).dropdown({ action: 'nothing' });
    },
    beforeDestroy() {
        $(this.$refs['bar-menu']).dropdown('destroy');
    }
};
</script>

<style lang="scss" scoped>
.status-bar-wrap {
    position: absolute;
    top: 15px;
    left: 20px;
    z-index: 120;
}

.status-bar {
    background: #DDD;
    width: 72px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;

    .cycle {
        position: absolute;
        top: 0;
        background: #00B5AD;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        transition: left .3s ease;

        &.is-edit {
            left: 42px;
        }

        &.is-view {
            left: 0;
        }
    }

    .icon-mode {
        position: absolute;
        top: 6px;
        color: #333;

        &.icon-view {
            left: 5px;
        }

        &.icon-edit {
            right: 5px;
        }

        &.is-active {
            color: #FFF;
        }
    }
}

.bar-menu {
    position: relative;
    margin-top: 6px;
    z-index: 200;
}
</style>
