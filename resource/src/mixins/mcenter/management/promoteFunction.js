import { mapGetters } from 'vuex';
import capitalize from 'lodash/capitalize';
import upperCase from 'lodash/upperCase';
import { API_PROMOTION_INFO } from '@/config/api';
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';

export default {
    data() {
        return {
            isRegister: false,
            isPopup: false,
            domain: '',
            popupType: '',
            agentCode: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        /**
         * 推廣連結
         * @method agentLink
         * @returns {String} 推廣連結
         */
        agentLink() {
            if (!this.domain || !this.agentCode) {
                return ''
            }

            return `https://${this.domain}/a/${this.agentCode}`;


        }
    },
    created() {
        this.getDomain();
        this.getAgentCode();
    },
    methods: {
        getDomain() {
            ajax({
                method: 'get',
                url: '/api/v1/c/hostnames'
            }).then(({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                [this.domain] = ret;
            });
        },
        /**
         * 取得推廣代碼
         * @method getAgentCode
         */
        getAgentCode() {
            ajax({
                method: 'get',
                url: API_PROMOTION_INFO,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.agentCode = ret.code;
                }
            });
        },
        /**
         * 複製推廣代碼或連結
         * @method onCopy
         * @param {String} key - code or link
         */
        onCopy(key) {
            const value = capitalize(key);
            const type = upperCase(key);

            this.$copyText(this[`agent${value}`]).then(() => {
                this.isPopup = true;
                this.popupType = type;

                // 三秒後自動關閉
                setTimeout(() => {
                    this.onPopupClose();
                }, 3000);
            });
        },
        /**
         * 顯示 QR Code(for mobile)
         * @method onQrcodeOpen
         */
        onQrcodeOpen() {
            this.isPopup = true;
            this.popupType = 'qrcode';
        },
        /**
         * 關閉彈跳視窗
         * @method onPopupClose
         */
        onPopupClose() {
            if (isMobile()) {
                this.isPopup = false;
                this.popupType = '';
                return;
            }

            this.isPopup = false;
        }
    }
};
