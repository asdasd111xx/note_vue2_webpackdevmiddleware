import * as apiUrl from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            deviceList: []
        };
    },
    methods: {
        getDeviceInit() {
            ajax({
                method: 'get',
                url: apiUrl.API_AGENT_SLIDE_DEVICE_LIST,
                errorAlert: false
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
