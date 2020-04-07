<template>
    <receipt-address>
        <template scope="{ addressList, nowDefault, openCountryCode, allTip, addAddress, setEditData, editData, editAddress, setFormStatus, isAddAddress, hideEdit, nowEditAddress, setDefault, deleteAddress, addList }">
            <div v-if="!nowEditAddress.includes(editKey) && !isAddAddress">
                <div :class="$style['top-tip']">
                    <span>{{ $text('S_ADDRESS_MAX', { replace: [{ target: '%S', value: 5 }] }) }}</span>
                    <div
                        :class="$style['add-btn']"
                        @click="setCurrentPage({ type: 'add', index: '', key: '', func: () => { setFormStatus('add') } })"
                    >
                        <icon
                            name="plus"
                            width="20"
                            height="20"
                        />
                    </div>
                </div>
                <div
                    v-for="(item, key) in addressList"
                    :key="`address-${key}`"
                    :class="$style['address-wrap']"
                >
                    <div :class="$style['address-content']">
                        <div :class="$style['address-default']" @click="setDefault(item, key)">
                            <div :class="[$style['default-btn'], { [$style['is-default']]: nowDefault === item.id }]" />
                        </div>
                        <div :class="$style['content-main-item']">
                            <div :class="$style['content-item']">
                                <span :class="$style['left']">{{ $text('S_RECEIVER', '收货人') }}</span>
                                <span :class="$style['right']">
                                    <div @click="setCurrentPage({ type: 'edit', index: key, key: item.id, func:() => { setEditData(item) } })">
                                        <icon
                                            name="edit"
                                            width="10"
                                            height="10"
                                        />
                                    </div>
                                    {{ item.name }}
                                </span>
                            </div>
                            <div :class="$style['content-item']">
                                <span :class="$style['left']">{{ $text('S_MOBILE_NUMBER', '手机号码') }}</span>
                                <span :class="$style['right']">{{ item.phone }}</span>
                            </div>
                            <div :class="$style['content-item']">
                                <span :class="$style['left']">{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</span>
                                <span :class="$style['right']">{{ item.address }}</span>
                            </div>
                        </div>
                    </div>
                    <div :class="$style['address-delete']">
                        <div :class="$style['delete-btn']" @click="deleteAddress(item.id)">
                            <icon
                                name="regular/trash-alt"
                                width="24"
                                height="21"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="nowEditAddress.includes(editKey) && currentPage === 'edit' && !isAddAddress" :class="$style['add-address-wrap']">
                <div :class="$style['input-wrap']">
                    <p>{{ $text('S_RECEIVER', '收货人') }}</p>
                    <input
                        v-model="editData[editIndex].name"
                        :class="[$style['add-input'], { [$style['notice']]: addressList[editIndex].tips.name }]"
                        :placeholder="$text('S_PLEASE_ENTER_RECEIVER', '请输入收货人')"
                        maxlength="100"
                        type="text"
                    />
                </div>
                <div :class="[$style['input-wrap'], $style['mobile']]">
                    <p>{{ $text('S_MOBILE_NUMBER', '手机号码') }}</p>
                    <div :class="[$style['select-wrap'], { [$style['notice']]: addressList[editIndex].tips.countryCode }]">
                        <select v-model="editData[editIndex].countryCode">
                            <option v-for="(code, key) in openCountryCode" :key="`country-code-${key}`">{{ code }}</option>
                        </select>
                    </div>
                    <input
                        v-model="editData[editIndex].mobileNumber"
                        :class="[$style['add-input'], { [$style['notice']]: addressList[editIndex].tips.mobileNumber }]"
                        :placeholder="$text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')"
                        maxlength="15"
                        type="text"
                    />
                </div>
                <div :class="$style['input-wrap']">
                    <p>{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</p>
                    <input
                        v-model="editData[editIndex].address"
                        :class="[$style['add-input'], { [$style['notice']]: addressList[editIndex].tips.address }]"
                        :placeholder="$text('S_PLEASE_ENTER_RECEIPT_ADDRESS', '请输入收货地址')"
                        maxlength="100"
                        type="text"
                    />
                </div>
                <div v-if="addressList[editIndex].tips.name || addressList[editIndex].tips.countryCode || addressList[editIndex].tips.mobileNumber || addressList[editIndex].tips.address" :class="$style['msg-notice']">{{ $text('S_JM_MSG_COMPLETE', '请填写完整') }}</div>
                <div :class="$style['button-wrap']">
                    <button :class="$style['cancel']" @click.stop="hideEdit(editKey)">{{ $text('S_CANCEL', '取消') }}</button>
                    <button :class="$style['confirm']" @click="editAddress(editData[editIndex], editIndex)">{{ $text('S_CONFIRM', '确认') }}</button>
                </div>
            </div>
            <div v-else-if="!nowEditAddress.includes(editKey) && currentPage === 'add' && isAddAddress" :class="$style['add-address-wrap']">
                <div :class="$style['input-wrap']">
                    <p>{{ $text('S_RECEIVER', '收货人') }}</p>
                    <input
                        v-model="addList.name"
                        :class="[$style['add-input'], { [$style['notice']]: allTip.name }]"
                        :placeholder="$text('S_PLEASE_ENTER_RECEIVER', '请输入收货人')"
                        maxlength="100"
                        type="text"
                    />
                </div>
                <div :class="[$style['input-wrap'], $style['mobile']]">
                    <p>{{ $text('S_MOBILE_NUMBER', '手机号码') }}</p>
                    <div :class="[$style['select-wrap'], { [$style['notice']]: allTip.countryCode }]">
                        <select v-model="addList.countryCode">
                            <option v-for="(code, key) in openCountryCode" :key="`country-code-${key}`">{{ code }}</option>
                        </select>
                    </div>
                    <input
                        v-model="addList.mobile"
                        :class="[$style['add-input'], { [$style['notice']]: allTip.mobile }]"
                        :placeholder="$text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')"
                        maxlength="15"
                        type="text"
                    />
                </div>
                <div :class="$style['input-wrap']">
                    <p>{{ $text('S_RECEIPT_ADDRESS', '收货地址') }}</p>
                    <input
                        v-model="addList.address"
                        :class="[$style['add-input'], { [$style['notice']]: allTip.address }]"
                        :placeholder="$text('S_PLEASE_ENTER_RECEIPT_ADDRESS', '请输入收货地址')"
                        maxlength="100"
                        type="text"
                    />
                </div>
                <div v-if="allTip.name || allTip.countryCode || allTip.mobile || allTip.address" :class="$style['msg-notice']">{{ $text('S_JM_MSG_COMPLETE', '请填写完整') }}</div>
                <div :class="$style['button-wrap']">
                    <button :class="$style['cancel']" @click.stop="setFormStatus('cancel')">{{ $text('S_CANCEL', '取消') }}</button>
                    <button :class="$style['confirm']" @click="addAddress(addList)">{{ $text('S_CONFIRM', '确认') }}</button>
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
            nowDeleteAddress: '',
            currentPage: '',
            editIndex: '',
            editKey: ''
        };
    },
    methods: {
        setCurrentPage({ type, index, key, func }) {
            if (type === 'clear') {
                this.currentPage = '';
                return;
            }

            if (func) { 
                func(); 
            }
        
            this.editIndex = index;
            this.editKey = key;
            this.currentPage = type;
        }
    }
};
</script>
<style src="../css/index.module.scss" lang="scss" module>
