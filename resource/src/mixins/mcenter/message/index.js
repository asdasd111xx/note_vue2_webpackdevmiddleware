import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            hasReceive: false,
            numMax: 10, // 每頁顯示幾筆
            pageNow: 1, // 當前頁
            selectId: '',
            messageData: [],
            messageContent: '',
            tempMsgType: 'all', // 下拉式類別 v-model
            curMsgType: 'all', // 當前下拉式類別
            msgTypeOptions: [{ // 站内信下拉式類別選項
                value: 'all', text: this.$t('S_ALL')
            }, {
                value: 'average', text: this.$t('S_AVERAGE_NOTIFICATION')
            }, {
                value: 'promotion', text: this.$t('S_PROMOTION_NOTIFICATION')
            }, {
                value: 'financial', text: this.$t('S_FINANCIAL_NOTIFICAITION')
            }, {
                value: 'system', text: this.$t('S_SYSTEM_NOTIFICATION')
            }, {
                value: 'others', text: this.$t('S_OTHER_NOTIFICATION')
            }]
        };
    },
    computed: {
        curMsgList() {
            const first = (this.pageNow - 1) * this.numMax;
            const last = this.pageNow * this.numMax;
            return this.filterMessageData.slice(first, last);
        },
        filterMessageData() {
            if (this.curMsgType === 'all') {
                return this.messageData;
            }

            return this.messageData.filter((info) => this.msgTypeOptions[info.kind].value === this.curMsgType);
        },
        pageAll() { // 總頁數
            if (this.filterMessageData.length === 0) {
                return 1;
            }

            return Math.ceil(this.filterMessageData.length / this.numMax);
        }
    },
    watch: {
        curMsgType() {
            this.pageNow = 1;
        }
    },
    created() {
        this.getMessgae();
    },
    methods: {
        getMessgae() {
            mcenter.message({
                success: (response) => {
                    this.messageData = response.ret;
                    this.hasReceive = true;
                }
            });
        },
        updateCurMsgType() {
            if (this.curMsgType !== this.tempMsgType) {
                this.selectId = '';
                this.curMsgType = this.tempMsgType;
            }
        },
        pageChange(page) {
            this.selectId = '';
            this.pageNow = page;
            window.scrollTo(0, 0);
        },
        selectMessage(id, index) {
            this.messageContent = '';
            mcenter.messageContent({
                success: (response) => {
                    this.messageContent = response.ret.content.replace(/\n/ig, '<br/>');
                    if (!this.messageData[index].read) {
                        this.messageData[index].read = true;
                    }

                    this.actionSetMcenterMsgCount();
                }
            }, id);
            if (this.selectId === id) {
                this.selectId = '';
                return;
            }

            this.selectId = id;
        },
        deleteMessgae(id) { // 單一刪除
            const text = window.confirm(`${this.$t('S_MSG_DELETED')}?`);
            if (!text) {
                return;
            }
            this.selectId = '';
            this.hasReceive = false;
            mcenter.messageDelete({
                success: () => {
                    this.getMessgae();
                    this.actionSetMcenterMsgCount();
                }
            }, id);
        },
        deleteMessgaes(id) { // 多個刪除
            const text = window.confirm(`${this.$t('S_MSG_DELETED')}?`);
            if (!text) {
                return;
            }

            this.hasReceive = false;
            mcenter.messagesDelete({
                params: { message_ids: id },
                success: () => {
                    this.getMessgae();
                    this.actionSetMcenterMsgCount();
                }
            });
        },
        ...mapActions([
            'actionSetMcenterMsgCount'
        ])
    }
};
