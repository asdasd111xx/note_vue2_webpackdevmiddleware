<template>
    <div v-if="isReceive" :class="$style['page-sports']">
        <div v-if="loginStatus && gameData.csc.switch === 'Y'" :class="$style['iframe-wrap']">
            <iframe :src="url" frameborder="0" />
        </div>
        <div v-else :class="$style['page-wrap']">
            <div :class="$style['page-container']">
                <div :class="$style['people-wrap']">
                    <img
                        v-for="num in 5"
                        :key="num"
                        :class="$style[`people-${num}`]"
                        :src="$getCdnPath(`/static/image/tpl/17/customPage/sports/im_img_${num}.png`)"
                    />
                </div>
                <img :class="$style['title-img']" :src="$getCdnPath('/static/image/tpl/17/customPage/sports/im-title-soon.png')" />
                <img :class="$style['icon-img']" :src="$getCdnPath('/static/image/tpl/17/customPage/sports/im-icon.png')" />
                <div :class="$style['red-img-wrap']">
                    <img
                        v-for="num in 5"
                        :key="num"
                        :class="[$style[`red-img-${num}`], $style['map-animation']]"
                        :src="$getCdnPath('/static/image/tpl/17/customPage/sports/red_img.png')"
                    />
                </div>
                <div :class="$style['blue-img-wrap']">
                    <img
                        v-for="num in 5"
                        :key="num"
                        :class="[$style[`blue-img-${num}`], $style['map-animation']]"
                        :src="$getCdnPath('/static/image/tpl/17/customPage/sports/blue_img.png')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_GET_VENDOR } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            isReceive: false,
            url: ''
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        if (this.gameData.csc.switch !== 'Y') {
            this.isReceive = true;
            return;
        }

        if (!this.loginStatus) {
            alert(this.$text('S_LOGIN_TIPS', '请先登入'));
            this.$router.push({ name: 'home' });
            return;
        }

        ajax({
            method: 'get',
            url: `${API_GET_VENDOR}/csc/game/launch`,
            params: { kind: 1 },
            success: ({ result, ret }) => {
                this.isReceive = true;

                if (result !== 'ok') {
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

<style lang="scss" module>
@keyframes iconAnim {
    0% {
        opacity: 0;
        transform: translate3d(0, 50%, 0) scale(0.6);
    }
    100% {
        opacity: 1;
        transform: translateZ(0) scale(1);
    }
}

@keyframes people1 {
    0% {
        transform: translateY(6px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes people2 {
    0% {
        transform: translateY(-6px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes people3 {
    0% {
        transform: translateY(6px) scale(0.95);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.page-sports {
    padding-top: 120px;
}

.iframe-wrap {
    background: url('/static/image/tpl/17/customPage/sports/bg.jpg') 50% 0 no-repeat;

    > iframe {
        display: block;
        width: 1340px;
        height: 712px;
        position: relative;
        left: 50%;
        margin-left: -670px;
    }
}

.page-wrap {
    height: 782px;
    background: url('/static/image/tpl/17/customPage/sports/im_sport_bg.png') 50% 100% no-repeat;
}

.page-container {
    position: relative;
    left: 50%;
    width: 1729px;
    height: 796px;
    margin: 0 auto;
    margin-left: -865px;
    background: url('/static/image/tpl/17/customPage/sports/im_map.png') 0 100%/100% 239px no-repeat;
}

.people-wrap {
    position: relative;
    top: 141px;
    left: 17%;
    width: 1210px;
    height: 517px;
}

.people-1 {
    position: absolute;
    top: 79px;
    left: 124px;
    animation: people1 1.6s ease-in-out;
}

.people-2 {
    position: absolute;
    top: 37px;
    left: 254px;
    animation: people2 1.6s ease-in-out;
}

.people-3 {
    position: absolute;
    left: 35%;
    animation: people3 1.6s ease-in-out;
}

.people-4 {
    position: absolute;
    right: 243px;
    top: 37px;
    animation: people2 1.6s ease-in-out;
}

.people-5 {
    position: absolute;
    top: 76px;
    right: 127px;
    animation: people1 1.6s ease-in-out;
}

.title-img {
    position: absolute;
    bottom: 100px;
    left: 530px;
}

.icon-img {
    position: absolute;
    bottom: 40px;
    left: 25%;
}

.red-img-wrap {
    display: inline-block;
    position: relative;
    width: 357px;
    height: 169px;
    margin: 71px 0 0 207px;
}

.map-animation {
    animation: iconAnim .6s ease-in-out both;
}

.red-img-1 {
    position: absolute;
    top: 22px;
    right: 47px;
    animation-delay: .5s;
}

.red-img-2 {
    position: absolute;
    top: 72px;
    right: 82px;
    animation-delay: .4s;
}

.red-img-3 {
    position: absolute;
    bottom: 62px;
    right: 151px;
    animation-delay: .3s;
}

.red-img-4 {
    position: absolute;
    bottom: 42px;
    left: 126px;
    animation-delay: .2s;
}

.red-img-5 {
    position: absolute;
    bottom: 20px;
    left: 51px;
    animation-delay: .1s;
}

.blue-img-wrap {
    float: right;
    position: relative;
    width: 223px;
    height: 200px;
    right: 280px;
    top: 44px;
}

.blue-img-1 {
    position: absolute;
    top: 30px;
    left: 35px;
    animation-delay: .5s;
}

.blue-img-2 {
    position: absolute;
    top: 66px;
    right: 90px;
    animation-delay: .4s;
}

.blue-img-3 {
    position: absolute;
    bottom: 100px;
    left: 22px;
    animation-delay: .3s;
}

.blue-img-4 {
    position: absolute;
    bottom: 64px;
    right: 33px;
    animation-delay: .2s;
}

.blue-img-5 {
    position: absolute;
    bottom: 44px;
    right: 112px;
    animation-delay: .1s;
}
</style>
