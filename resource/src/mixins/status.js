import { getDoamin } from '@/lib/getCurrentDoamin';
import store from '@/store';

// 404 500 upup no_service domain判斷
export default {
    data() {
        return {
            imgSite: '',
            domain: {
                domain: '',
                site: 'porn1'
            }
        }
    },
    created() {
        getDoamin().then((res) => {
            this.domain = res || '';
            this.imgSite = res && res.site ? res.site : 'porn1';
        })
    },
    methods: {
        linkToService() {
            let on_service_url = store && store.state && store.state.webInfo && store.state.webInfo.on_service_url;
            localStorage.setItem('serviceUrl', on_service_url || 'https://yaboxxxcs.net/chat/text/chat_1A09E4.html?skill=8ae482827375169c017375f1528b2446');

            if (this.domain.site === "ey1") {
                window.location.href = `/static/upup/ey1/index.html?username=${this.username}`;
            } else {
                window.location.href = `/static/upup/index.html?username=${this.username}`;
            }
            window.location.title = "在线客服";
        },
    },
};
