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
                v-for="info in selectData"
                :key="`select-method-${info.bank_id}`"
                :class="[$style['info-wrap'], { [$style['is-current']]: info.id === nowSelectCur.id }, 'clearfix']"
                @click="changePay(info)"
            >
                <span :class="$style['info-bank']">{{ info.mainTitle }}</span>
                <span :class="$style['info-method']">{{ info.subTitle }}</span>
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
        }
    }
};
</script>

<style lang="scss" src="../css/selectBox.module.scss" module></style>
