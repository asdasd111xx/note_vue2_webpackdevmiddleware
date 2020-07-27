<template>
    <div :class="$style['inline-wrap']">
        <template v-for="info in allInputData">
            <div
                v-if="info.showCondition"
                :key="`field-${info.objKey}`"
                :class="$style['speed-input-group']"
            >
                <div :class="$style['bank-card-title']">{{ info.title }}</div>
                <div :class="$style['bank-feature-wrap']">
                    <!-- 存款方式 -->
                    <template v-if="info.customInput && info.objKey === 'depositMethod'">
                        <div
                            v-for="(dataName, key) in info.value"
                            :key="`speed-method-${key}`"
                            :class="[$style['method-item'], { [$style['is-current']]: info.curMethodId === key }]"
                            @click="submitInput(key, info.objKey)"
                        >
                            {{ dataName }}
                        </div>
                    </template>
                    <!-- 存款時間 -->
                    <template v-if="info.customInput && info.objKey === 'depositTime'">
                        <date-picker
                            v-if="info.objKey === 'depositTime'"
                            v-model="info.value"
                            :placeholder="info.placeholderText"
                            type="datetime"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-type="format"
                            @input="submitInput(info.value, info.objKey)"
                        />
                    </template>
                    <!-- 其他輸入框 -->
                    <input
                        v-if="!info.customInput"
                        v-model="info.value"
                        :class="$style['speed-deposit-input']"
                        :placeholder="info.placeholderText"
                        @input="submitInput($event.target.value, info.objKey)"
                    />
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
            required: true
        },
        requiredField: {
            type: Array,
            default: () => []
        },
        speedField: {
            type: Object,
            default: () => {}
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
    computed: {
        $style() {
            return this.classStyle;
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
                        8: this.$text('S_MOBILE_TRANSFER', '手机银行转帐'),
                        16: this.$text('S_ZALO_PAY', '其他')
                    },
                    showCondition: this.requiredField.find((e) => e.name === 'method' && e.required) && (this.methodId === 3 || this.methodId === 6),
                    customInput: true
                },
                {
                    objKey: 'depositTime',
                    title: this.$text('S_DEPOSIT_TIME', '存款时间(北京)'),
                    value: this.speedField.depositTime,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_TIME', '请输入存款时间'),
                    showCondition: this.requiredField.find((e) => e.name === 'deposit_at' && e.required),
                    customInput: true
                },
                {
                    objKey: 'depositAccount',
                    title: this.$text('S_DEPOSIT_ACCOUNT', '存款帐号'),
                    value: this.speedField.depositAccount,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_ACCOUNT', '请输入存款帐号'),
                    showCondition: this.requiredField.find((e) => e.name === 'pay_account' && e.required),
                    customInput: false
                },
                {
                    objKey: 'depositName',
                    title: this.typeId === 6 ? this.$text('S_DEPOSIT_NICKNAME', '存款昵称') : this.$text('S_DEPOSIT_NAME', '存款人姓名'),
                    value: this.speedField.depositName,
                    placeholderText: this.typeId === 6 ? this.$text('S_ENTER_DEPOSIT_NICKNAME', '请输入存款昵称') : this.$text('S_ENTER_DEPOSIT_NAME', '请输入存款人姓名'),
                    showCondition: this.requiredField.find((e) => e.name === 'pay_username' && e.required),
                    customInput: false
                },
                {
                    objKey: 'bankBranch',
                    title: this.$text('S_DEPOSIT_BRANCH', '银行支行'),
                    value: this.speedField.bankBranch,
                    placeholderText: this.$text('S_ENTER_DEPOSIT_BRANCH', '请输入银行支行'),
                    showCondition: this.requiredField.find((e) => e.name === 'method' && e.required) && (this.speedField.depositMethod === '2' || this.speedField.depositMethod === '4'),
                    customInput: false
                },
                {
                    objKey: 'serialNumber',
                    title: this.$text('S_SERIAL_NUMBER2', '流水号'),
                    value: this.speedField.serialNumber,
                    placeholderText: this.$text('S_PLZ_ENTER_SERIAL_NUMBER', '请输入流水号'),
                    showCondition: this.requiredField.find((e) => e.name === 'sn' && e.required),
                    customInput: false
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
