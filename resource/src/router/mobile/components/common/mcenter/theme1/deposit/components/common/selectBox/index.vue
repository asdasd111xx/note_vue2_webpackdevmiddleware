<template>
    <div :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" @click.stop="closeFuc()" />
        <div :class="$style['pop-menu']">
            <div :class="$style['pop-title']">
                <span @click.stop="closeFuc()">{{ $text('S_CANCEL', '取消') }}</span>
                {{ title }}
            </div>
            <ul :class="$style['pop-list']">
                <li
                    v-for="(info, index) in selectData"
                    :key="`select-method-${info.selectId || index}`"
                    @click.stop="changePay(info)"
                >
                    <img :src="`/static/image/mcenter/bank/default.png`" />
                    {{ info.mainTitle }}
                    <icon
                        v-if="info.selectId === nowSelectCur.selectId"
                        :class="$style['select-active']"
                        name="check"
                    />
                </li>
            </ul>
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
