<template>
    <div :class="$style['select-box-wrap']">
        <div :class="$style['select-title-wrap']">
            <div :class="$style['select-close-wrap']" @click.prevent="closeFuc()">
                <img :src="$getCdnPath('/static/image/mobile/mcenter/close_icon.png')" :class="$style['select-close-btn']" />
            </div>
            {{ title }}
        </div>
        <div :class="$style['select-info-wrap']">
            <div
                v-for="(info, index) in selectData"
                :key="`select-method-${info.bank_id || index}`"
                :class="[$style['info-wrap'], { [$style['is-current']]: isCurrent(info) }, 'clearfix']"
                @click="changePay(info)"
            >
                <span v-if="info.mainTitle" :class="[$style['info-bank'], $style[`method-${nowSelectCur.objKey}`]]">{{ info.mainTitle }}</span>
                <span v-if="info.subTitle" :class="$style['info-method']">{{ info.subTitle }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        selectData: {
            type: Array,
            default: () => []
        },
        nowSelectCur: {
            type: Object,
            default: () => {}
        },
        closeFuc: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        /**
         * 更改當前支付方式
         * @method changePay
         * @param {Object} info - 當前支付方式
         */
        changePay(info) {
            this.$emit('update:nowSelectCur', info);
            this.closeFuc();
        },
        isCurrent(info) {
            if (info.selectId === 3 || info.selectId === 6) {
                return info.selectId === this.nowSelectCur.selectId && info.bank_id === this.nowSelectCur.bank_id;
            }

            return info.selectId === this.nowSelectCur.selectId;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
