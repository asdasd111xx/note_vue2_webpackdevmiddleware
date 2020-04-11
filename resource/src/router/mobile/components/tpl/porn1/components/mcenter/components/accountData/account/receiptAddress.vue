<template>
    <div class="receipt-address-data">
        <slot
            :new-address="newAddress"
            :add-address="addAddress"
            :edit-address="editAddress"
            :delete-address="deleteAddress"
            :address-list="addressList"
            :open-country-code="openCountryCode"
            :all-tip="allTip"
            :set-default="setDefault"
            :set-form-status="setFormStatus"
            :is-add-address="isAddAddress"
            :hide-edit="hideEdit"
            :now-edit-address="nowEditAddress"
            :now-default="nowDefault"
            :set-edit-data="setEditData"
            :edit-data="editData"
            :add-list="addList"
        />
    </div>
</template>

<script>
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';
import { API_MCENTER_ADDRESS, API_MCENTER_COUNTRY_CODES } from '@/config/api';

export default {
    data() {
        return {
            isAddAddress: false,
            addressList: [],
            nowEditAddress: [],
            openCountryCode: [],
            allTip: {
                name: false,
                countryCode: false,
                mobile: false,
                address: false
            },
            newAddress: {
                countryCode: '',
                name: '',
                mobile: '',
                address: ''
            },
            addList: {
                countryCode: '',
                name: '',
                mobile: '',
                address: ''
            },
            editData: [],
            nowDefault: ''
        };
    },
    created() {
        this.getAllAddress();
        this.getCountryCode();
    },
    methods: {
        getCountryCode() {
            // 取得會員手機開放國碼
            ajax({
                method: 'get',
                url: API_MCENTER_COUNTRY_CODES,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.openCountryCode = response.ret;
                    this.addList.countryCode = response.ret[0];
                    this.newAddress.countryCode = response.ret[0];
                }
            });
        },
        getAllAddress() {
            // 取得全部收貨地址
            ajax({
                method: 'get',
                url: API_MCENTER_ADDRESS,
                errorAlert: false
            }).then((response) => {
                response.ret.forEach((info) => {
                    const list = {
                        ...info,
                        countryCode: `+${info.phone.split('-')[0]}`,
                        mobileNumber: info.phone.split('-')[1],
                        tips: {
                            name: false,
                            countryCode: false,
                            mobileNumber: false,
                            address: false
                        }
                    };
                    if (info.is_default) {
                        this.nowDefault = info.id;
                    }
                    this.addressList.push(list);
                    this.editData.push(list);
                });
            });
        },
        addAddress(data) {
            Object.keys(data).forEach((type) => {
                if (!data[type]) {
                    this.allTip[type] = true;
                } else {
                    this.allTip[type] = false;
                }
            });
            if (data.name && data.countryCode && data.mobile && data.address) {
                // 新增一筆收貨地址
                ajax({
                    method: 'post',
                    url: API_MCENTER_ADDRESS,
                    params: {
                        name: data.name,
                        phone: `${data.countryCode.replace(/\+/ig, '')}-${data.mobile}`,
                        address: data.address
                    },
                    errorAlert: false,
                    success: (response) => {
                        const list = {
                            ...response.ret,
                            countryCode: `+${response.ret.phone.split('-')[0]}`,
                            mobileNumber: response.ret.phone.split('-')[1],
                            tips: {
                                name: false,
                                countryCode: false,
                                mobileNumber: false,
                                address: false
                            }
                        };
                        this.addList = {
                            countryCode: '',
                            name: '',
                            mobile: '',
                            address: ''
                        };
                        this.addressList.push(list);
                        this.setFormStatus('cancel');
                    },
                    fail: (response) => {
                        alert(response.data.msg);
                    }
                });
            }
        },
        setAddressData(index, res, data) {
            this.addressList = this.addressList.map((address, i) => {
                if (i === index) {
                    return {
                        ...address,
                        ...res,
                        ...data
                    };
                }
                return address;
            });
        },
        editAddress(content, idx) {
            Object.keys(content).forEach((type) => {
                if (type === 'name' || type === 'countryCode' || type === 'mobileNumber' || type === 'address') {
                    if (!content[type]) {
                        this.addressList[idx].tips[type] = true;
                    } else {
                        this.addressList[idx].tips[type] = false;
                    }
                }
            });
            if (content.name && content.countryCode && content.mobileNumber && content.address) {
                // 編輯一筆收貨地址
                ajax({
                    method: 'put',
                    url: `${API_MCENTER_ADDRESS}/${content.id}`,
                    params: {
                        id: content.id,
                        is_default: this.nowDefault === content.id ? true : content.is_default,
                        name: content.name,
                        phone: `${content.countryCode.replace(/\+/ig, '')}-${content.mobileNumber}`,
                        address: content.address
                    },
                    errorAlert: false,
                    success: (response) => {
                        this.setAddressData(idx, response.ret, { phone: response.ret.phone, countryCode: `+${response.ret.phone.split('-')[0]}`, mobileNumber: response.ret.phone.split('-')[1] });
                        this.hideEdit(response.ret.id);
                    },
                    fail: (response) => {
                        alert(response.data.msg);
                    }
                });
            }
        },
        deleteAddress(idx) {
            if (isMobile() && !window.confirm(`${this.$t('S_MSG_DELETED')}?`)) {
                return;
            }

            // 刪除一筆收貨地址
            ajax({
                method: 'delete',
                url: `${API_MCENTER_ADDRESS}/${idx}`,
                errorAlert: false
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.addressList = this.addressList.filter((info) => info.id !== idx);
                }
            });
        },
        setDefault(content, key) {
            if (!window.confirm(`${this.$text('S_ADDRESS_SET_DEFAULT', '将此收货地址设为默认')}?`)) {
                return;
            }

            this.nowDefault = content.id;
            this.editAddress(content, key);
        },
        setFormStatus(key) {
            if (key === 'add') {
                if (this.addressList.length === 5) {
                    alert(this.$text('S_ADDRESS_ALREADY_MAX', '收货地址已超过上限'));
                    return;
                }

                this.isAddAddress = true;
                return;
            }
            if (key === 'cancel') {
                this.isAddAddress = false;
                this.newAddress = {
                    countryCode: '',
                    name: '',
                    mobile: '',
                    address: ''
                };
                this.allTip = {
                    name: false,
                    countryCode: false,
                    mobile: false,
                    address: false
                };
                this.addList = {
                    countryCode: '',
                    name: '',
                    mobile: '',
                    address: ''
                };
            }
        },
        hideEdit(key) {
            ajax({
                method: 'get',
                url: API_MCENTER_ADDRESS,
                errorAlert: false
            }).then((response) => {
                response.ret.forEach((info, index) => {
                    const list = {
                        ...info,
                        countryCode: `+${info.phone.split('-')[0]}`,
                        mobileNumber: info.phone.split('-')[1],
                        tips: {
                            name: false,
                            countryCode: false,
                            mobileNumber: false,
                            address: false
                        }
                    };
                    if (info.id === key) {
                        this.addressList[index] = list;
                    }
                });
            });

            this.addList = {
                countryCode: '',
                name: '',
                mobile: '',
                address: ''
            };

            this.nowEditAddress = this.nowEditAddress.filter((data) => data !== key);
        },
        setEditData(content) {
            this.nowEditAddress.push(content.id);
            this.addressList = this.addressList.map((address, index) => {
                if (address.id === content.id) {
                    this.editData[index] = address;
                    return {
                        ...address,
                        tips: {
                            name: false,
                            countryCode: false,
                            mobileNumber: false,
                            address: false
                        }
                    };
                }
                return address;
            });
        }
    }
};
</script>
