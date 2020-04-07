<template>
    <nav-container>
        <template slot="sport">
            <div class="nav-back-water">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/sports/ad.png')" />
            </div>
            <div class="nav-game-box clearfix">
                <div class="nav-game-item sport" @click="changePage('custom', '12170')">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/sports/bi.png')" />
                </div>
            </div>
            <div class="nav-qrcode-box">
                <div class="nav-qrcode-img">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <qrcode
                        v-else
                        :value="mobileBetUrl"
                        :options="{ width: 85 }"
                    />
                </div>
            </div>
        </template>
        <template slot="E-sports">
            <div class="nav-back-water">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/esport/ad.png')" />
            </div>
            <div class="nav-game-box clearfix" @click="changePage('games', 'tgp')">
                <div class="nav-game-item esport">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/esport/tgp.png')" />
                </div>
            </div>
            <div class="nav-qrcode-box">
                <div class="nav-qrcode-img">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <qrcode
                        v-else
                        :value="mobileBetUrl"
                        :options="{ width: 85 }"
                    />
                </div>
            </div>
        </template>
        <template slot="live">
            <div class="nav-back-water">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/live/ad.png')" />
            </div>
            <div class="nav-game-box clearfix">
                <div
                    v-for="(item, key) in navGameList.live"
                    :key="`nav-game-item-${key}`"
                    class="nav-game-item live"
                    @click="changePage(item.type, item.vendor)"
                >
                    <img :src="$getCdnPath(item.imgPath)" />
                </div>
            </div>
            <div class="nav-qrcode-box">
                <div class="nav-qrcode-img">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <qrcode
                        v-else
                        :value="mobileBetUrl"
                        :options="{ width: 85 }"
                    />
                </div>
            </div>
        </template>
        <template slot="chess">
            <div class="nav-back-water nav-back-chess" />
            <div class="nav-game-box clearfix" @click="changePage('games', 'ky')">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/ad01.png')" />
            </div>
            <div class="nav-qrcode-box">
                <div class="nav-qrcode-img">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <qrcode
                        v-else
                        :value="mobileBetUrl"
                        :options="{ width: 85 }"
                    />
                </div>
            </div>
        </template>
        <template slot="lottery">
            <div class="nav-back-water">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/lottery/ad.png')" />
            </div>
            <div class="nav-game-box clearfix">
                <div class="nav-game-item" @click="changePage('games', 'lottery')">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/lottery/bb.png')" />
                </div>
                <div class="nav-game-item" @click="changePage('games', 'vr')">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/lottery/vr.png')" />
                </div>
            </div>
            <div class="nav-qrcode-box">
                <div class="nav-qrcode-img">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <qrcode
                        v-else
                        :value="mobileBetUrl"
                        :options="{ width: 85 }"
                    />
                </div>
            </div>
        </template>
        <template slot="slots">
            <div class="nav-back-water">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/casino/ad.png')" />
            </div>
            <div class="nav-game-box clearfix">
                <div class="nav-game-item" @click="changePage('games', 'bbcasino')">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/casino/bb.png')" />
                </div>
                <div class="nav-game-item" @click="changePage('games', 'pt')">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/header/casino/pt.png')" />
                </div>
            </div>
            <div class="nav-qrcode-box">
                <div class="nav-qrcode-img">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <qrcode
                        v-else
                        :value="mobileBetUrl"
                        :options="{ width: 85 }"
                    />
                </div>
            </div>
        </template>
    </nav-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import navContainer from './navContainer';

export default {
    components: {
        navContainer
    },
    data() {
        return {
            navGameList: {
                live: [
                    { type: 'games', vendor: 'bblive', imgPath: '/static/image/tpl/customizeHome/53/header/live/bb.png' },
                    { type: 'games', vendor: 'ag', imgPath: '/static/image/tpl/customizeHome/53/header/live/ag.png' },
                    { type: 'games', vendor: 'lg_live', imgPath: '/static/image/tpl/customizeHome/53/header/live/lg_live.png' }
                ]
            }
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            appInfo: 'getAppInfo'
        }),
        mobileBetUrl() {
            if (this.isBackEnd) {
                return window.location.hostname;
            }

            return this.appInfo.qrcode.url;
        },
        qrcodeStatus() {
            return this.loginStatus || this.appInfo.downloadInfo.unsafe_download;
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(type, page = '', subPage = '') {
            if (this.isBackEnd) {
                return;
            }

            if (!this.loginStatus && !['ag_casino', 'bbcasino', 'pt', 'mw', 'hb', 'ky'].includes(page)) {
                this.$emit('openLoginModal');
                return;
            }

            this.actionChangePage({ type, page, subPage });
        }
    }
};
</script>

<style lang="scss" scoped>
.nav-back-water {
    float: left;
    width: 140px;
}

.nav-game-box {
    float: left;
    width: 940px;
    text-align: center;
}

.nav-game-item {
    display: inline-block;
    vertical-align: top;
    width: 360px;
    margin: 0 20px;
    cursor: pointer;

    &.sport,
    &.esport,
    &.lottery {
        width: 760px;
        margin: 0;
    }

    &.live {
        width: 274px;
        margin: 0 19px;
    }
}

.nav-back-chess {
    margin-top: 40px;
}

.nav-qrcode-box {
    position: relative;
    float: right;
    padding-top: 48px;
    background: url('/static/image/tpl/customizeHome/53/header/bg_qrcode_download.png') 0 0 no-repeat;
    width: 140px;
    min-height: 272px;

    img {
        max-width: 98%;
    }
}

.nav-qrcode-img {
    position: absolute;
    bottom: 18px;
    left: 36px;
    width: 85px;
    height: 85px;
    border-radius: 3px;
    overflow: hidden;

    // canvas {
    //     margin: -13px 0 0 -13px;
    // }
}

.qrcode-img-wrap {
    position: relative;
}

.no-login-text {
    position: absolute;
    width: 100%;
    top: 32px;
    left: 0;
    text-align: center;
    font-size: 12px;
    color: #E2C8A0;
}

.live-more-game {
    float: right;
    margin: 80px 25px 0 0;
    background: url('/static/image/tpl/customizeHome/53/header/more.png') 0 0 no-repeat;
    width: 150px;
    height: 210px;

    .more-btn {
        border: 1px solid #000;
        margin:  155px auto 0;
        width: 120px;
        height: 35px;
        line-height: 35px;
        color: #000;
        text-align: center;
        cursor: pointer;
    }
}

.nav-game-btn {
    width: 135px;
    line-height: 32px;
    text-align: center;
    position: absolute;
    left: 217px;
    bottom: 65px;
    font-size: 14px;
    color: #FFF;
    background: 0 0;
    cursor: pointer;
    border: 1px solid #FFF;
    transition: all 0.5s;
    outline: none;

    &:hover {
        background: #CF2A2A;
        border: 1px solid #CF2A2A;
        box-shadow: 3px 3px 3px rgba(0,0,0,.3);
    }
}

.nav-game-lottery {
    left: 120px;
}

.nav-game-fish {
    width: 120px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
