<template>
    <receipt-address>
        <template scope="{ newAddress, addAddress, deleteAddress, addressList, editAddress, openCountryCode, allTip, setDefault, setFormStatus, isAddAddress, hideEdit, nowEditAddress, nowDefault, setEditData, editData }">
            <div class="receipt-address-title">{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</div>
            <div class="address-tip">
                <span>{{ $text('S_ADDRESS_MAX', { replace: [{ target: '%S', value: 5 }] }) }}</span>
            </div>
            <button
                :disabled="isAddAddress"
                class="add-address-btn"
                @click="setFormStatus('add')"
            >
                <icon name="plus" scale="0.7" />
                <span>{{ $text('S_ADD', '新增') }}</span>
            </button>
            <div class="receipt-address-table">
                <div class="address-table-thead">
                    <div class="address-table-wrap-type">
                        <div class="address-table-type">{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</div>
                        <div class="address-table-type">{{ $text('S_OPERATE', '操作') }}</div>
                    </div>
                </div>
                <div class="address-table-tbody">
                    <template v-if="addressList.length === 0 && !isAddAddress">
                        <tr><td colspan="2" class="no-data">{{ $t('S_NO_DATA_YET') }}</td></tr>
                    </template>
                    <template v-else>
                        <div
                            v-for="(item, key) in addressList"
                            :key="`address-${key}`"
                            class="address-table-wrap-type"
                        >
                            <template v-if="!nowEditAddress.includes(item.id)">
                                <div class="address-table-type">
                                    <div :class="['address-status', nowDefault === item.id ? 'active' : '']" @click="setDefault(item, key)">
                                        <icon name="check-circle" scale="1.6" />
                                    </div>
                                    <div class="address-info">
                                        <div>{{ $text('S_RECEIVER', '收货人') }}：{{ item.name }}</div>
                                        <p>{{ $text('S_MOBILE_NUMBER', '手机号码') }}：{{ item.phone }}</p>
                                        <p>{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}：{{ item.address }}</p>
                                    </div>
                                </div>
                                <div class="address-table-type">
                                    <div v-if="nowDeleteAddress === item.id" class="address-operate">
                                        <button class="cancel" @click="nowDeleteAddress = ''">{{ $text('S_CANCEL', '取消') }}</button>
                                        <button class="confirm" @click="deleteAddress(item.id)">{{ $text('S_CONFIRM', '确认') }}</button>
                                    </div>
                                    <div v-else class="address-operate">
                                        <button @click="setEditData(item)"><icon name="edit"/></button>
                                        <button @click="nowDeleteAddress = item.id"><icon name="trash-alt"/></button>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="address-table-type">
                                    <div class="address-input">
                                        <span>{{ $text('S_RECEIVER', '收货人') }}</span>
                                        <input
                                            v-model="editData[key].name"
                                            :class="['add-input', item.tips.name ? 'notice' : '']"
                                            :placeholder="$text('S_PLEASE_ENTER_RECEIVER', '请输入收货人')"
                                            maxlength="100"
                                            type="text"
                                        />
                                    </div>
                                    <div class="address-input mobile">
                                        <span>{{ $text('S_MOBILE_NUMBER', '手机号码') }}</span>
                                        <select v-model="editData[key].countryCode" :class="['add-select', item.tips.countryCode ? 'notice' : '']">
                                            <option v-for="(code, key) in openCountryCode" :key="`country-code-${key}`">{{ code }}</option>
                                        </select>
                                        <input
                                            v-model="editData[key].mobileNumber"
                                            :class="['add-input', item.tips.mobileNumber ? 'notice' : '']"
                                            :placeholder="$text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')"
                                            maxlength="15"
                                            type="text"
                                        />
                                    </div>
                                    <div class="address-input">
                                        <span>{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</span>
                                        <input
                                            v-model="editData[key].address"
                                            :class="['add-input', item.tips.address ? 'notice' : '']"
                                            :placeholder="$text('S_PLEASE_ENTER_RECEIPT_ADDRESS', '请输入收货地址')"
                                            maxlength="100"
                                            type="text"
                                        />
                                    </div>
                                    <div v-if="item.tips.name || item.tips.countryCode || item.tips.mobileNumber || item.tips.address" class="msg-notice">{{ $text('S_JM_MSG_COMPLETE', '请填写完整') }}</div>
                                </div>
                                <div class="address-table-type">
                                    <div class="address-operate">
                                        <button class="cancel" @click="hideEdit(item.id)">{{ $text('S_CANCEL', '取消') }}</button>
                                        <button class="confirm" @click="editAddress(editData[key], key)">{{ $text('S_CONFIRM', '确认') }}</button>
                                    </div>
                                </div>
                        </template>
                    </div>
                    <div v-if="isAddAddress" class="address-table-add-wrap">
                        <div class="address-table-type">
                            <div class="address-input">
                                <span>{{ $text('S_RECEIVER', '收货人') }}</span>
                                <input
                                    v-model="newAddress.name"
                                    :class="['add-input', allTip.name ? 'notice' : '']"
                                    :placeholder="$text('S_PLEASE_ENTER_RECEIVER', '请输入收货人')"
                                    maxlength="100"
                                    type="text"
                                />
                            </div>
                            <div class="address-input mobile">
                                <span>{{ $text('S_MOBILE_NUMBER', '手机号码') }}</span>
                                <select v-model="newAddress.countryCode" :class="['add-select', allTip.countryCode ? 'notice' : '']">
                                    <option v-for="(code, key) in openCountryCode" :key="`country-code-${key}`">{{ code }}</option>
                                </select>
                                <input
                                    v-model="newAddress.mobile"
                                    :class="['add-input', allTip.mobile ? 'notice' : '']"
                                    :placeholder="$text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')"
                                    maxlength="15"
                                    type="text"
                                />
                            </div>
                            <div class="address-input">
                                <span>{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</span>
                                <input
                                    v-model="newAddress.address"
                                    :class="['add-input', allTip.address ? 'notice' : '']"
                                    :placeholder="$text('S_PLEASE_ENTER_RECEIPT_ADDRESS', '请输入收货地址')"
                                    maxlength="100"
                                    type="text"
                                />
                            </div>
                            <div v-if="allTip.name || allTip.countryCode || allTip.mobile || allTip.address" class="msg-notice">{{ $text('S_JM_MSG_COMPLETE', '请填写完整') }}</div>
                        </div>
                        <div class="address-table-type">
                            <div class="address-operate">
                                <button class="cancel" @click="setFormStatus('cancel')">{{ $text('S_CANCEL', '取消') }}</button>
                                <button class="confirm" @click="addAddress(newAddress)">{{ $text('S_CONFIRM', '确认') }}</button>
                            </div>
                        </div>
                    </div>
                    </template>
                </div>
            </div>
        </template>
    </receipt-address>
</template>

<script>
import receiptAddress from '@/components/common/mcenter/receiptAddress';

export default {
    components: {
        receiptAddress
    },
    data() {
        return {
            nowDeleteAddress: ''
        };
    }
};
</script>

<style lang="scss" src="./css/indexReceiptAddress.scss" scoped></style>
