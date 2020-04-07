<template>
    <div>
        <slot
            :device-list="deviceList"
            :enter-edit="enterEdit"
            :delete-edit="deleteEdit"
            :set-new-name="setNewName"
            :device-name-edit="deviceNameEdit"
            :device-bind-delete="deviceBindDelete"
        />
    </div>
</template>

<script>
import ajax from '@/lib/ajax';
import { API_AGENT_SLIDE_DEVICE_LIST, API_AGENT_MODIFY_SLIDE_DEVICE, API_AGENT_DELETE_SLIDE_DEVICE } from '@/config/api';

/**
 * 會員裝置綁定
 * @module components/common/bindingDevice
 */
export default {
    data() {
        return {
            deviceSource: []
        };
    },
    computed: {
        deviceList() {
            return this.deviceSource.filter((device) => device.isShow);
        }
    },
    created() {
        ajax({
            method: 'get',
            url: API_AGENT_SLIDE_DEVICE_LIST,
            errorAlert: false
        }).then(
            (res) => {
                if (res && res.result === 'ok') {
                    this.deviceSource = res.ret.map((device) => ({
                        ...device,
                        isShow: true,
                        isModify: false,
                        modifyName: '',
                        isDelete: false
                    }));
                }
            }
        );
    },
    methods: {
        /**
         * 設定為編輯修改裝置狀態
         * @method enterEdit
         * @param {number} index - 索引值
         */
        enterEdit(index) {
            if (this.deviceSource[index].isModify) {
                this.$set(this.deviceSource[index], 'modifyName', '');
            }
            this.$set(this.deviceSource[index], 'isModify', !this.deviceSource[index].isModify);
        },
        /**
         * 設定為編輯刪除裝置狀態
         * @method deleteEdit
         * @param {number} index - 索引值
         */
        deleteEdit(index) {
            this.$set(this.deviceSource[index], 'isDelete', !this.deviceSource[index].isDelete);
        },
        /**
         * 設定裝置名稱欄位資料
         * @method setNewName
         * @param {number} index - 索引值
         * @param {string} value - 裝置名稱
         */
        setNewName(index, value) {
            this.$set(this.deviceSource[index], 'modifyName', value);
        },
        /**
         * 修改裝置名稱
         * @method deviceNameEdit
         * @param {number} index - 索引值
         */
        deviceNameEdit(index) {
            if (this.deviceSource[index].name === this.deviceSource[index].modifyName) {
                this.$set(this.deviceSource[index], 'isModify', false);
                this.$set(this.deviceSource[index], 'modifyName', '');
                return;
            }

            ajax({
                method: 'put',
                url: API_AGENT_MODIFY_SLIDE_DEVICE,
                errorAlert: true,
                params: {
                    app_id: this.deviceSource[index].app_id,
                    name: this.deviceSource[index].modifyName
                }
            }).then((res) => {
                if (res.result === 'ok') {
                    this.$set(this.deviceSource[index], 'isModify', false);
                    this.$set(this.deviceSource[index], 'modifyName', '');
                    this.$set(this.deviceSource[index], 'name', res.ret.device_name);
                }
            });
        },
        /**
         * 刪除裝置名稱
         * @method deviceBindDelete
         * @param {number} index - 索引值
         */
        deviceBindDelete(index) {
            ajax({
                method: 'delete',
                url: API_AGENT_DELETE_SLIDE_DEVICE,
                errorAlert: true,
                params: {
                    app_id: this.deviceSource[index].app_id
                }
            }).then((res) => {
                if (res.result === 'ok') {
                    this.$set(this.deviceSource[index], 'isShow', false);
                }
            });
        }
    }
};
</script>
