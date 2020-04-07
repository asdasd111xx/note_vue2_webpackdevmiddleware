<template>
    <div class="vip-content">
        <div class="content-left">
            <div class="now-vip-level">
                <img :src="isNextBtn ? badgeImg.img_badge_src : nowUserLevel.img_badge_src" />
            </div>
            <div class="now-vip-level info">
                <div
                    v-if="isNextBtn && nowLevelList.length > 1"
                    class="arrow prev"
                    @click="previewLevel(nowUserLevel, 'pre')"
                />
                <h1>{{ isNextBtn ? nowLevelList[nowCurIndex].alias : nowUserLevel.now_level_alias }}</h1>
                <div
                    v-if="(!isNextBtn || !nowLevelList[nowCurIndex].is_max_level) && nowLevelList.length > 1"
                    class="arrow next"
                    @click="previewLevel(nowUserLevel, 'next')"
                />
                <template v-if="!isNextBtn">
                    <div v-if="parseFloat(+nowUserLevel.now_birth_amount + +nowUserLevel.now_gift_amount) > 0" class="info-list">
                        <span>{{ $text('S_CLAIM_AMOUNT', '可领礼金') }}</span>
                        <span class="amount">{{ commaFormat((+nowUserLevel.now_birth_amount + +nowUserLevel.now_gift_amount)) }}</span>
                    </div>
                    <div class="line" />
                    <div v-if="nowUserLevel.downgrade && parseFloat(nowUserLevel.downgrade_valid_bet) > 0" class="info-list">
                        <span>{{ $text('S_DOWNGRADE_VALID_BET', '保级条件') }}</span>
                        <span v-if="nowUserLevel.downgrade_achieve" class="amount">{{ $text('S_CONDITIONS_MET', '已达条件') }}</span>
                        <span v-else class="amount">{{ commaFormat(+nowUserLevel.downgrade_valid_bet) }}</span>
                    </div>
                    <div v-if="nowUserLevel.downgrade && !nowUserLevel.downgrade_achieve && parseFloat(nowUserLevel.downgrade_valid_bet) > 0" class="info-list">
                        <span class="rebate">{{ $text('S_SERIAL_DAY_REACH', { replace: [{ target: '%s', value: nowUserLevel.downgrade_day }] }) }}</span>
                    </div>
                </template>
                <template v-else>
                    <div v-if="parseFloat(nowLevelList[nowCurIndex].gift_amount) > 0" class="info-list">
                        <span>{{ $text('S_VIP_ADVANCE_GIFT', '晋级礼金') }}</span>
                        <span class="amount">{{ commaFormat(+nowLevelList[nowCurIndex].gift_amount) }}</span>
                    </div>
                    <div v-if="parseFloat(nowLevelList[nowCurIndex].gift_amount) > 0 && parseFloat(nowLevelList[nowCurIndex].birth_amount) > 0" class="line" />
                    <div v-if="parseFloat(nowLevelList[nowCurIndex].birth_amount) > 0" class="info-list">
                        <span>{{ $text('S_VIP_BIRTH_GIFT', '生日礼金') }}</span>
                        <span class="amount">{{ commaFormat(+nowLevelList[nowCurIndex].birth_amount) }}</span>
                    </div>
                </template>
            </div>
        </div>
        <div class="content-right">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="vip-level-content" v-html="showHtml(nowUserLevel, nowUserLevel.levelUpTip)" />
            <div class="vip-level-bar">
                <span>{{ nowUserLevel.now_level_name }}</span>
                <div class="bar-wrap">
                    <img
                        :src="$getCdnPath('/static/image/mcenter/vip/bar.png')"
                        :style="{'width': nowUserLevel.percent+'%'}"
                        class="progress-bar"
                    />
                    <img :src="$getCdnPath('/static/image/mcenter/vip/bar_bg.png')" class="progress-bar-bg" />
                </div>
                <span>{{ nowUserLevel.next_level_name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        previewLevel: {
            type: Function,
            default: () => {}
        },
        isNextBtn: {
            type: Boolean,
            default: false
        },
        nowLevelList: {
            type: Array,
            default: () => []
        },
        badgeImg: {
            type: Object,
            default: () => {}
        },
        nowCurIndex: {
            type: Number,
            default: () => {}
        },
        nowUserLevel: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        showHtml(info, levelUpTip) {
            if (info.is_max_level) {
                return this.$text('S_YOU_ALREADY_HIGHEST_LEVEL', '您的等级已是当前最高等级');
            }

            if (info.is_achieve) {
                return this.$text('S_YOU_MET_PROMOTION_REQUIREMENTS', {
                    text: '您已满足%s晋级条件',
                    replace: [{
                        target: '%s',
                        value: info.next_level_alias
                    }]
                });
            }

            return levelUpTip;
        },
        commaFormat(value) {
            // 加上千分位符號
            return value
                .toString()
                .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
