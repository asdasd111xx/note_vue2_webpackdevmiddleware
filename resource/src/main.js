import 'vue-loading-overlay/dist/vue-loading.min.css';
// semantic ui
import './css/plugins/semantic/semantic.css';
// flatpickr
import 'flatpickr/dist/flatpickr.css';
// vue-awesome-swiper
import 'swiper/css/swiper.css';
// vue-multiselect
import 'vue-multiselect/dist/vue-multiselect.min.css';
import 'vue2-datepicker/index.css';
// hint.css
import 'hint.css/hint.min.css';
// video.js
import 'video.js/dist/video-js.min.css';
import '@/config/iconList';

import App from './App';
// Icon 組件全域使用, 只載入有使用的 Icon 資料
import Icon from 'vue-awesome/components/Icon';
import Loading from 'vue-loading-overlay';
import Meta from 'vue-meta';
// vee-validate - 表單驗證
import VeeValidate from 'vee-validate';
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueCookie from 'vue-cookie';
import VueCropper from 'vue-cropper';
import VueLazyload from 'vue-lazyload';
import VueNativeSock from 'vue-native-websocket'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VueRx from 'vue-rx';
// swal
import VueSwal2 from 'vue-sweetalert2';
import Vuebar from 'vuebar';
import Vuex from 'vuex';
import depositLink from './lib/depositLink';
import getCdnPath from './lib/getCdnPath';
import { getCookie } from '@/lib/cookie';
import i18n from './config/i18n';
import moment from 'vue-moment';
import router from './router';
import store from './store';
import text from './lib/text';
import vStyle from './lib/vStyle';

/* plugins css - start */
/* eslint-disable */





/* eslint-disable */
/* plugins css - end */
// 推播中心websocket api
let cid = getCookie('cid')
if (cid) {
    const script = document.createElement('script');
    script.setAttribute('src', '/api/v1/ws/front_file');
    script.setAttribute('data-id', 'ws-bc');
    script.setAttribute('data-msg-func', 'notice');
    document.body.appendChild(script);
    window.notice = (data) => {
        const date = new Date();
        store.state.noticeData = [
            ...store.state.noticeData,
            {
                id: date.toISOString(),
                event: data.event,
                ...data.message
            }
        ];
    };
}

// 推播測試
// setTimeout(() => {
//     const date = new Date();
//     store.state.noticeData = [
//         ...store.state.noticeData,
//         {
//             id: date.toISOString(),
//             event: "notice",
//             content: "C_WS_INBOX",
//             type: 'player_inbox'
//         }
//     ];
// }, 2500)

Vue.use(Vuex);
Vue.use(VueRx);
Vue.use(VeeValidate, { inject: true });
Vue.use(VueCookie);
Vue.use(moment);
Vue.use(VueLazyload);
Vue.use(VueSwal2);
Vue.use(Loading);
Vue.use(Vuebar);
Vue.use(Meta);
Vue.use(getCdnPath);
Vue.use(text);
Vue.use(vStyle);
Vue.use(VueClipboard);
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(depositLink);
Vue.use(VueCropper);
Vue.component('icon', Icon);

/* eslint-disable no-new */
new Vue({
    i18n,
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});

// 換頁前，顯示loading圖
// router.beforeEach((to, from, next) => {
//     document.getElementById('main-loading').style.display = 'block';
//     next();
// });

// router載入完畢後，移除loading圖
router.afterEach(() => {
    document.getElementById('main-loading').style.display = 'none';
});
