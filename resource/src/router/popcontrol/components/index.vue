<template>
    <div><iframe v-if="url" :src="url" /></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import promo from '@/api/promotion';

export default {
    data() {
        return {
            url: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            curLang: 'getCurLang'
        })
    },
    async mounted() {
        // 取得初始資料
        await this.actionSetUserdata();
        await this.actionSetWebInfo(this.memInfo.user.domain);

        // 取得參數
        const query = this.$route.params;
        let data;
        try {
            data = JSON.parse(query.datas);
        } catch (e) {
            data = query.datas;
        }

        switch (query.type) {
            // 優惠活動第三方連結
            case 'promo': {
                const params = {
                    id: data.linkItem,
                    logo: this.webInfo.logo ? `${this.webInfo.cdn_domain}${this.webInfo.logo}` : '',
                    mlogo: this.webInfo.m_logo ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}` : '',
                    title: encodeURI(this.memInfo.config.domain_name[this.curLang]),
                    favicon: this.webInfo.fav_icon ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}` : ''
                };

                promo.url(params, {
                    success: (response) => {
                        if (response.result === 'ok') {
                            window.location = response.ret.uri;
                        }
                    },
                    fail: (response) => {
                        if (response.data.result === 'error') {
                            window.close();
                        }
                    }
                });
                break;
            }
            // 活動連結
            case 'festival': {
                ajax({
                    method: 'get',
                    url: `/api/v1/c/vendor/${query.datas}/event?event_id=${query.event_id}`,
                    errorAlert: true,
                    success: (response) => {
                        const { result, ret } = response;

                        if (result !== 'ok') {
                            window.close();
                            return;
                        }

                        // MG電子金豬招財要嵌在iframe
                        if (query.datas === 'mg') {
                            this.url = ret.url;
                            return;
                        }

                        window.location = ret.url;
                    },
                    fail: (response) => {
                        if (response.data.result === 'error') {
                            window.close();
                        }
                    }
                });
                break;
            }
            default:
                window.close();
        }
    },
    methods: {
        ...mapActions([
            'actionSetUserdata',
            'actionSetWebInfo'
        ])
    }
};
</script>

<style lang="scss" scoped>
div {
    overflow: hidden;
    height: 100%;
}

iframe {
    width: 100%;
    height: 100%;
}
</style>
