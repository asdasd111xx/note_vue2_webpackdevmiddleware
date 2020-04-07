<template>
    <div :class="[$style['speed-field-wrap'], 'clearfix']">
        <template v-for="info in allInputData">
            <div
                v-if="info.showCondition"
                :key="`field-${info.objKey}`"
                :class="[$style['speed-field'], {[$style.error]: info.isError}, 'clearfix']"
            >
                <div :class="$style['field-title']">{{ info.title }}</div>
                <div :class="$style['field-info']">
                    <template v-if="!isEdit">
                        <span :class="$style['speed-field-title']">{{ info.objKey === 'depositMethod' ? nowSelectData.mainTitle : info.value }}</span>
                    </template>
                    <template v-else>
                        <template v-if="info.objKey === 'depositMethod'">
                            <div :class="$style['speed-field-title']" @click="isShowSelect(true)">{{ nowSelectData.mainTitle }}</div>
                        </template>
                        <template v-else-if="info.objKey === 'depositTime'">
                            <date-picker
                                v-model="info.value"
                                :placeholder="info.placeholderText"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-type="format"
                                @input="submitInput(info.value, info.objKey)"
                            />
                        </template>
                        <input
                            v-else
                            v-model="info.value"
                            :class="$style['speed-deposit-input']"
                            :placeholder="info.placeholderText"
                            @input="submitInput($event.target.value, info.objKey)"
                        />
                    </template>
                </div>
            </div>
            <div
                v-if="info.isError"
                :key="`field-error-${info.objKey}`"
                :class="$style['speed-deposit-input-error-messgae']"
            >
                {{ info.placeholderText }}
            </div>
        </template>
        <select-box
            v-if="isSelectShow"
            :select-data="allInputData[0].selectData"
            :now-select-cur.sync="nowSelectData"
            :close-fuc="isShowSelect"
            :title="allInputData[0].selectTitle"
        />
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
    components: {
        selectBox: () => import(/* webpackChunkName: 'selectBox' */ '../selectBox'),
        DatePicker
    },
    props: {
        showByRequiredFields: {
            type: Boolean,
            default: false
        },
        requiredFields: {
            type: Array,
            default: () => []
        },
        classStyle: {
            type: Object,
            default: () => {}
        },
        speedField: {
            type: Object,
            default: () => {}
        },
        isEdit: {
            type: Boolean,
            default: true
        },
        methodId: {
            type: Number,
            default: 0
        },
        typeId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isSelectShow: false,
            // 只有show必填欄位的狀況下不顯示錯誤提示
            showError: !this.showByRequiredFields
        };
    },
    computed: {
        $style() {
            return this.classStyle || this.$styleDefault;
        },
        allInputData() {
            return [
                {
                    objKey: 'depositMethod',
                    title: this.$text('S_DEPOSIT_METHOD', '存款方式'),
                    curMethodId: this.speedField.depositMethod,
                    selectTitle: this.$text('S_ENTER_DEPOSIT_METHOD', '请输入存款方式'),
                    selectData: [
                        {
                            mainTitle: this.$text('S_ONLINE_BANK', '网银'),
                            selectId: '1'
                        },
                        {
                            mainTitle: 'ATM',
                            selectId: '2'
                        },
                        {
                            mainTitle: this.$text('S_BANK_COUNTER', '银行柜台'),
                            selectId: '4'
                        },
                        {
                            mainTitle: this.$text('S_MOBILE_TRANSFER', '手机银行转帐'),
                            selectId: '8'
                        },
                        {
                            mainTitle: this.$text('S_ZALO_PAY', '其他'),
                            selectId: '16'
                        }
                    ],
                    showCondition: this.showByRequiredFields ? this.requiredFields.find((e) => e.name === 'method' && e.required) : (this.methodId === 3 || this.methodId === 6),
                    isError: false
                },
                {
                    objKey: 'depositTime',
                    title: this.$text('S_DEPOSIT_TIME', '存款时间(北京)'),
                    value: this.speedField.depositTime,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_TIME', '请输入存款时间'),
                    showCondition: this.showByRequiredFields ? this.requiredFields.find((e) => e.name === 'deposit_at' && e.required) : true,
                    isError: this.showError && this.requiredFields.find((item) => item.name === 'deposit_at' && item.required) && !this.speedField.depositTime
                },
                {
                    objKey: 'depositAccount',
                    title: this.$text('S_DEPOSIT_ACCOUNT', '存款帐号'),
                    value: this.speedField.depositAccount,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_ACCOUNT', '请输入存款帐号'),
                    showCondition: this.showByRequiredFields ? this.requiredFields.find((e) => e.name === 'pay_account' && e.required) : true,
                    isError: this.showError && this.requiredFields.find((item) => item.name === 'pay_account' && item.required) && !this.speedField.depositAccount
                },
                {
                    objKey: 'depositName',
                    title: this.typeId === 6 ? this.$text('S_DEPOSIT_NICKNAME', '存款昵称') : this.$text('S_DEPOSIT_NAME', '存款人姓名'),
                    value: this.speedField.depositName,
                    placeholderText: this.typeId === 6 ? this.$text('S_ENTER_DEPOSIT_NICKNAME', '请输入存款昵称') : this.$text('S_ENTER_DEPOSIT_NAME', '请输入存款人姓名'),
                    showCondition: this.showByRequiredFields ? this.requiredFields.find((e) => e.name === 'pay_username' && e.required) : true,
                    isError: this.showError && this.requiredFields.find((item) => item.name === 'pay_username' && item.required) && !this.speedField.depositName
                },
                {
                    objKey: 'bankBranch',
                    title: this.$text('S_DEPOSIT_BRANCH', '银行支行'),
                    value: this.speedField.bankBranch,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_BRANCH', '请输入银行支行'),
                    showCondition: this.speedField.depositMethod === '2' || this.speedField.depositMethod === '4',
                    isError: this.showError && this.requiredFields.find((item) => item.name === 'method' && item.required) && !this.speedField.bankBranch && ['2', '4'].includes(this.speedField.depositMethod)
                },
                {
                    objKey: 'serialNumber',
                    title: this.$text('S_SERIAL_NUMBER2', '流水号'),
                    value: this.speedField.serialNumber,
                    placeholderText: this.$text('S_PLZ_ENTER_SERIAL_NUMBER', '请输入流水号'),
                    showCondition: this.showByRequiredFields ? this.requiredFields.find((e) => e.name === 'sn' && e.required) : true,
                    isError: this.showError && this.requiredFields.find((item) => item.name === 'sn' && item.required) && !this.speedField.serialNumber
                }
            ];
        },
        nowSelectData: {
            get() {
                return {
                    ...this.allInputData[0].selectData.filter((info) => info.selectId === this.speedField.depositMethod)[0],
                    objKey: this.allInputData[0].objKey
                };
            },
            set(value) {
                this.submitInput(value.selectId, 'depositMethod');
            }
        }
    },
    methods: {
        submitInput(data, objKey) {
            this.$emit('update:speedField', { data, objKey });
        },
        /**
         * 是否顯示選擇框
         * @method isShowSelect
         * @param {Boolean} show - 是否顯示
         */
        isShowSelect(show = '') {
            if (show !== '') {
                this.isSelectShow = show;
                return;
            }

            this.isSelectShow = !this.isSelectShow;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module="$styleDefault"></style>
