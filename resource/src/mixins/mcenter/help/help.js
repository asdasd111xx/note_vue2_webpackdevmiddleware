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
        this.$nextTick(() => {
            // if (this.isCategoryMode) {
            //     this.addSwitchToList();
            // }
        })
    },
    watch: {
        source(val) {
            if (this.isCategoryMode) {
                this.data = val.data;
                return;
            }

            this.data = val.data.map(function (el) {
                let _o = Object.assign({}, el);
                _o.isOpen = false;
                return _o;
            });
        },
        category_currentIndex() {
            // if (this.isCategoryMode) {
            //     this.addSwitchToList();
            // }
        }
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        }),
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
                    if (Number(element.key) === Number(key)) {
                        element.isOpen = !element.isOpen;
                    }
                });
            }
        },
        setType(index) {
            this.category_currentIndex = index;
            this.category_isShowPop = false;
        },
        // addSwitchToList() {
        //     console.log(this.data)
        //     this.category_list[this.category_currentIndex].list = this.data[this.category_currentIndex].list.map(el => {
        //         let _o = Object.assign({}, el);
        //         _o.isOpen = false;
        //         return _o;
        //     });
        // }
    },
};
