<template>
    <div :class="[$style['speed-field-tbody'], 'clearfix']">
        <template v-for="info in allInputData">
            <div
                v-if="info.showCondition"
                :key="`field-${info.objKey}`"
                :class="$style['speed-field-tr']"
            >
                <div :class="[$style['speed-field-td'], $style['speed-field-thead']]">{{ info.title }}</div>
                <div :class="$style['speed-field-td']">
                    <template v-if="!isEdit">
                        <span>{{ info.objKey === 'depositMethod' ? info.value[info.curMethodId] : info.value }}</span>
                    </template>
                    <template v-else>
                        <template v-if="info.objKey === 'depositMethod'">
                            <div
                                v-for="(dataName, key) in info.value"
                                :key="`speed-method-${key}`"
                                :class="[$style['method-item'], { [$style['is-current']]: info.curMethodId === key }]"
                                @click="submitInput(key, info.objKey)"
                            >
                                {{ dataName }}
                            </div>
                        </template>
                        <template v-else-if="info.objKey === 'depositTime'">
                            <date-picker
                                v-model="info.value"
                                :placeholder="info.placeholderText"
                                :class="{error: info.isError}"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-type="format"
                                @input="submitInput(info.value, info.objKey)"
                            />
                        </template>
                        <input
                            v-else
                            v-model="info.value"
                            :class="[$style['speed-deposit-input'], {[$style.error]: info.isError}]"
                            :placeholder="info.placeholderText"
                            @input="submitInput($event.target.value, info.objKey)"
                        />
                        <span v-if="info.isError" :class="$style['speed-deposit-input-error-messgae']">
                            {{ info.placeholderText }}
                        </span>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
    components: {
        DatePicker
    },
    props: {
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
        },
        requiredFields: {
            type: Array,
            required: true
        }
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
                    value: {
                        1: this.$text('S_ONLINE_BANK', '网银'),
                        2: 'ATM',
                        4: this.$text('S_BANK_COUNTER', '银行柜台'),
                        8: this.$text('S_MOBILE_TRANSFER', '手机银行转帐')
                    },
                    showCondition: this.methodId === 3 || this.methodId === 6,
                    isError: false
                },
                {
                    objKey: 'depositTime',
                    title: this.$text('S_DEPOSIT_TIME', '存款时间(北京)'),
                    value: this.speedField.depositTime,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_TIME', '请输入存款时间'),
                    showCondition: true,
                    isError: this.requiredFields.find((item) => item.name === 'deposit_at' && item.required) && !this.speedField.depositTime

                },
                {
                    objKey: 'depositAccount',
                    title: this.$text('S_DEPOSIT_ACCOUNT', '存款帐号'),
                    value: this.speedField.depositAccount,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_ACCOUNT', '请输入存款帐号'),
                    showCondition: true,
                    isError: this.requiredFields.find((item) => item.name === 'pay_account' && item.required) && !this.speedField.depositAccount
                },
                {
                    objKey: 'depositName',
                    title: this.typeId === 6 ? this.$text('S_DEPOSIT_NICKNAME', '存款昵称') : this.$text('S_DEPOSIT_NAME', '存款人姓名'),
                    value: this.speedField.depositName,
                    placeholderText: this.typeId === 6 ? this.$text('S_ENTER_DEPOSIT_NICKNAME', '请输入存款昵称') : this.$text('S_ENTER_DEPOSIT_NAME', '请输入存款人姓名'),
                    showCondition: true,
                    isError: this.requiredFields.find((item) => item.name === 'pay_username' && item.required) && !this.speedField.depositName
                },
                {
                    objKey: 'bankBranch',
                    title: this.$text('S_DEPOSIT_BRANCH', '银行支行'),
                    value: this.speedField.bankBranch,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_BRANCH', '请输入银行支行'),
                    showCondition: this.speedField.depositMethod === '2' || this.speedField.depositMethod === '4',
                    isError: this.requiredFields.find((item) => item.name === 'method' && item.required) && !this.speedField.bankBranch
                },
                {
                    objKey: 'serialNumber',
                    title: this.$text('S_SERIAL_NUMBER2', '流水号'),
                    value: this.speedField.serialNumber,
                    placeholderText: this.$text('S_PLZ_ENTER_SERIAL_NUMBER', '请输入流水号'),
                    showCondition: true,
                    customInput: false,
                    isError: this.requiredFields.find((item) => item.name === 'sn' && item.required) && !this.speedField.serialNumber
                }
            ];
        }
    },
    methods: {
        submitInput(data, objKey) {
            this.$emit('update:speedField', { data, objKey });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module="$styleDefault"></style>
