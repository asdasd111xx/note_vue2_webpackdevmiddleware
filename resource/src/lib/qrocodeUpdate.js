import store from '@/store';

/**
 * qrcode 更新
 */
export default {
    timer: null,
    update() {
        store.dispatch('actionSetAppQrcode').then((res) => {
            if (!res || res.result !== 'ok') {
                return;
            }
            this.timer = setTimeout(() => {
                this.update();
            }, store.state.appInfo.qrcode.ttl * 1000);
        });
    }
};
