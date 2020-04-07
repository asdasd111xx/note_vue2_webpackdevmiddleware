<template>
    <div class="sports-container">
        <div class="sports-container__iframe-wrapper">
            <div v-if="loginStatus">
                <iframe
                    :src="url"
                    allowtransparency="true"
                    frameborder="0"
                />
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { API_GET_VENDOR } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            url: ''
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        if (!this.loginStatus) {
            this.$router.push({ path: '/' });
            return;
        }

        ajax({
            method: 'get',
            url: `${API_GET_VENDOR}/csc/game/launch`,
            params: { kind: 1 },
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    this.$router.push({ path: '/' });
                    return;
                }
                this.url = ret.url;
            },
            fail: () => {
                this.$router.push({ path: '/' });
            }
        });
    }
};
</script>
<style lang='scss' scoped>
iframe {
    display: block;
    width: 1405px;
    height: 905px;
    margin: 0 auto;
}

.sports-container {
    font-weight: 400;
    font-size: 14px;
    color: #333;
    position: relative;
    display: -ms-flexbox;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 900px;
    background: url(/static/image/tpl/18/sports/sports.png) #0B0C10 no-repeat no-repeat center center;
    background-size: cover;
}

.sports-container__iframe-wrapper {
    font-weight: 400;
    font-size: 14px;
    color: #333;
}

.sports-container__iframe {
    font-weight: 400;
    font-size: 14px;
    color: #333;
    width: 1032px;
    margin: 0 auto;
    height: 900px;
    border: 0;
    overflow: auto;
}
</style>
