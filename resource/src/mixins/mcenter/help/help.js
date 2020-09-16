import { getCookie, setCookie } from '@/lib/cookie';
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            data: null,
            source: null, // from json data

            // 選單模式
            isCategoryMode: false,
            category_currentIndex: 0,
            category_isShowPop: false,
            category_list: []
        };
    },
    mounted() {
        const query = this.$route.query;
        if (query.key) {
            this.$nextTick(() => {
                this.handleToggleContent(query.key);
            })
        }
    },
    watch: {
        source(val) {
            // 補 isOpen 參數
            if (this.isCategoryMode) {
                this.data = val.data.map(i => {
                    return { ...i, list: i.list.map(obj => ({ ...obj, isOpen: false })) };
                });
                return;
            }

            this.data = val.data.map(obj => ({ ...obj, isOpen: false }));
        },
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        }),
        hasCid() {
            return getCookie('cid') || false;
        },
        isApp() {
            let isApp = !!(
                (this.$route.query && this.$route.query.app) ||
                (this.$route.query && this.$route.query.APP)
            );

            return isApp;
        },
        categorys() {
            if (this.isCategoryMode && this.data) {
                return this.data.map(item => {
                    return item.category;
                });
            }
            return null
        }
    },
    methods: {
        handleToggleContent(key, isSubConent = false) {
            let target = document.getElementById(`q-${key}`);
            if (!target) return;

            if (isSubConent) {
                this.data[this.category_currentIndex].list.map((element, index) => {
                    if (index === Number(key)) {
                        element.isOpen = !element.isOpen;
                    }
                });
            } else {
                this.data.forEach((element, index) => {
                    if (index === Number(key)) {
                        element.isOpen = !element.isOpen;
                    }
                });
            }
        },
        setType(index) {
            this.category_currentIndex = index;
            this.category_isShowPop = false;
        },
        linkTo(target) {
            if (this.isApp) {
                this.$router.push({ query: { event: target, app: true } });
                window.location.reload();
            } else {
                this.$router.push(`/mobile/${target}`);
            }
        }
    },
};
