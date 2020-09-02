<template>
    <div class="account-binding-device">
        <div class="binding-device-title">
            {{ $t('S_BINDING_DEVICE') }}
            <span v-if="deviceList.length">{{ $t('S_IS_BINDING_GESTURE') }}</span>
            <span v-else>{{ $t('S_IS_NOT_BINDING') }}</span>
        </div>
        <div class="binding-device-table">
            <div class="device-table-thead">
                <div class="device-table-wrap-type">
                    <div class="device-table-type">{{ $t('S_DEVICE_NAME') }}</div>
                    <div class="device-table-type">{{ $t('S_SYSTEM') }}</div>
                    <div class="device-table-type">{{ $t('S_BRAND') }}</div>
                    <div class="device-table-type">{{ $t('S_OPERATING') }}</div>
                </div>
            </div>
            <div class="device-table-tbody">
                <div
                    v-for="(deviceData, index) in deviceList"
                    :key="`binding-${deviceData.app_id}`"
                    class="device-table-wrap-type"
                >
                    <div class="device-table-type device-modify-type">
                        <div class="device-title">{{ $t('S_DEVICE_NAME') }}</div>
                        <div class="device-data">
                            <div v-if="!deviceData.isModify" class="device-name">{{ deviceData.name }}<div class="device-name-btn" @click="setDeviceData(index, { isModify: true })"><icon name="edit" /></div></div>
                            <div v-if="deviceData.isModify" class="device-modify-wrap">
                                <input
                                    v-once
                                    :ref="`input-name-${index}`"
                                    :value="deviceData.name"
                                />
                                <button
                                    class="modify-cancel-btn"
                                    @click="setDeviceData(index, { isModify: false })"
                                >
                                    {{ $t('S_CANCEL') }}
                                </button>
                                <button
                                    :value="index"
                                    class="modify-confirm-btn"
                                    @click="confirmModifyDevice(index)"
                                >
                                    {{ $t('S_CONFIRM') }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="device-table-type">
                        <div class="device-title">{{ $t('S_SYSTEM') }}</div>
                        <div class="device-data">{{ deviceData.os }}</div>
                    </div>
                    <div class="device-table-type">
                        <div class="device-title">{{ $t('S_BRAND') }}</div>
                        <div class="device-data">{{ deviceData.brand }}</div>
                    </div>
                    <div class="device-table-type device-delete-table">
                        <div class="device-title">{{ $t('S_OPERATING') }}</div>
                        <div class="device-data">
                            <button
                                v-if="!deviceData.isDelete"
                                class="device-delete-btn"
                                @click="setDeviceData(index, { isDelete: true })"
                            >
                                <icon
                                    name="trash"
                                    width="18"
                                    height="18"
                                />
                            </button>
                            <div v-if="deviceData.isDelete" class="device-delete-wrap">
                                <span>{{ $t('S_CONFIRM_DELETE') }}？</span>
                                <button
                                    class="modify-cancel-btn"
                                    @click="setDeviceData(index, { isDelete: false })"
                                >
                                    {{ $t('S_CANCEL') }}
                                </button>
                                <button
                                    :value="index"
                                    class="modify-confirm-btn"
                                    @click="confirmDeleteDevice(index)"
                                >
                                    {{ $t('S_CONFIRM') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as apiUrl from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            deviceList: []
        };
    },
    created() {
        this.getDeviceInit();
    },
    methods: {
        getDeviceInit() {
            ajax({
                method: 'get',
                url: apiUrl.API_AGENT_SLIDE_DEVICE_LIST
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.deviceList = response.ret.map((device) => ({
                        ...device,
                        isModify: false,
                        isDelete: false
                    }));
                }
            });
        },
        setDeviceData(index, data) {
            this.deviceList = this.deviceList.map((device, i) => {
                if (i === index) {
                    return {
                        ...device,
                        ...data
                    };
                }
                return device;
            });
        },
        confirmModifyDevice(index) {
            ajax({
                method: 'put',
                url: apiUrl.API_AGENT_MODIFY_SLIDE_DEVICE,
                errorAlert: true,
                params: {
                    app_id: this.deviceList[index].app_id,
                    name: this.$refs[`input-name-${index}`][0].value
                }
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.setDeviceData(index, { name: response.ret.device_name, isModify: false });
                }
            });
        },
        confirmDeleteDevice(index) {
            ajax({
                method: 'delete',
                url: apiUrl.API_AGENT_DELETE_SLIDE_DEVICE,
                errorAlert: true,
                params: {
                    app_id: this.deviceList[index].app_id
                }
            }).then((response) => {
                if (response && response.result === 'ok') {
                    this.deviceList = this.deviceList.filter((device) => device.app_id !== this.deviceList[index].app_id);
                }
            });
        }
    }
};
</script>

<style src="../css/indexBindingDevice.scss" lang="scss" scoped></style>
