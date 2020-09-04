/* eslint-disable no-param-reassign */
import store from '@/store';
import isMobile from '@/lib/is_mobile';
import router from '../router';
import i18n from '@/config/i18n';

/**
 * 開啓存款
 */
export default {
    install(Vue) {
        Vue.prototype.$depositLink = () => {
            // 存款頁內嵌
            if (store.state.loginStatus) {
                if (store.state.memInfo.user.bankrupt) {
                    alert(i18n.t('S_BANKRUPT_TIP'));
                    return;
                }

                // eslint-disable-next-line
                if (isMobile()) {
                    router.push('/mobile/mcenter/deposit');
                    return;
                }

                router.push('/page/mcenter/deposit');
                return;
            }

            // eslint-disable-next-line
            if (isMobile()) {
                router.push('/simple/mobileDeposit');
                return;
            }

            router.push('/simple/pcDeposit');
        };
    }
};
