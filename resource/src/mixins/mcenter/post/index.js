import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';

export default {
    data() {
        return {
            hasReceive: false,
            popData: [], // 要顯示的資料
            popupData: [], // 要顯示的類別資料
            eleImg: {} // 圖片src路徑
        };
    },
    computed: {
        ...mapGetters({
            postData: 'getPost',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        this.actionSetPost().then(() => {
            const data = this.postData.list;

            this.hasReceive = true;

            data.forEach((item) => {
                let category;

                switch (item.category) {
                    case 1:
                        category = 'S_HOT_NEWS_2';
                        break;
                    case 2:
                        category = 'S_POPUP_IMPORTANT';
                        break;
                    case 3:
                        category = 'S_POPUP_ACTIVITY';
                        break;
                    case 4:
                        category = 'S_POPUP_MAINTENANCE';
                        break;
                    default:
                        category = 'S_POPUP_NONE';
                        break;
                }

                this.popData.push({
                    ...item
                });

                this.popupData.push(category);

                if (item.image) {
                    common.image({
                        success: (res) => {
                            const img = {
                                ...this.eleImg,
                                [item.id]: res.ret
                            };
                            this.eleImg = img;
                        }
                    }, item.image);
                }
            });
        });
    },
    methods: {
        ...mapActions([
            'actionSetPost'
        ]),
        onLinkTo(url, open, title) {
            let target;
            let setting;

            switch (open) {
                case 1:
                    target = '_self';
                    break;
                case 2:
                    target = '_blank';
                    break;
                case 3:
                    target = title;
                    setting = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=2,width=1024,height=640';
                    break;
                default:
                    target = '_self';
                    break;
            }

            if (setting) {
                window.open(url, target, setting);
                return;
            }

            window.open(url, target);
        }
    }
};
