import { getCookie, setCookie } from '@/lib/cookie';
import { mapActions, mapGetters } from 'vuex';

import axios from 'axios';
import mcenter from '@/api/mcenter';
import openGame from '@/lib/open_game';
import yaboRequest from '@/api/yaboRequest';

export default {
    data() {
        return {
            stopScroll: false,
            isReceive: false,
            isShowAllTag: false,
            isSliding: false,
            isTop: false,
            isShow: false,
            isBottom: false,
            typeStartTouchY: 0,
            startTouchY: 0,
            slideDirection: '',
            wrapHeight: 0,
            allGame: [],
            selectedIndex: 0,
            currentLevel: 0,
            showPromotion: false,
            isShowLoading: false,
            isCheckWithdraw: false,
            mcenterList: [
                { name: 'deposit', text: '充值', path: 'deposit' },
                { name: 'balanceTrans', text: '转帐', path: 'balanceTrans' },
                { name: 'withdraw', text: '提现', path: 'withdraw' },
                { name: 'creditTrans', text: '转让', path: 'creditTrans' },
                { name: 'grade', text: '等级', path: 'accountVip' }
            ],
            mcenterEy1List: [
                { name: 'deposit', text: '充值', path: 'deposit' },
                { name: 'balanceTrans', text: '转帐', path: 'balanceTrans' },
                { name: 'makemoney', text: '推广', path: 'makemoney' },
                { name: 'vip', text: 'VIP', path: 'accountVip' },
            ]
        };
    },
    watch: {
        isReceive() {
            this.$nextTick(() => {
                this.onResize();
            })
        }
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            loginStatus: 'getLoginStatus',
            memInfo: 'getMemInfo',
            rechargeConfig: 'getRechargeConfig',
            hasBank: 'getHasBank',
            membalance: 'getMemBalance',
        }),
        isAdult() {
            if (localStorage.getItem('content_rating')) {
                return localStorage.getItem('content_rating') === "1" ? true : false;
            } else {
                return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
            }
        },
        typeList() {
            if (this.allGame) {
                let typeList = this.allGame
                    .map(game => ({
                        category: game.category,
                        sequence: game.sequence,
                        icon: game.iconName,
                        name: game.name
                    }))
                    .filter(type => {
                        return this.isAdult ? type : type.icon !== 'Welfare';
                    });

                // 業主說左側選單前後要各複製一份...
                return [...typeList, ...typeList, ...typeList];
            }
        },
        options() {
            return {
                slidesPerView: "auto",
                spaceBetween: 4,
                slideClass: this.$style.tag
            };
        },
        allGameList() {
            const gameList = this.allGame
                .map(game => game)
                .filter(item => {
                    return this.isAdult ? item : item.iconName !== 'Welfare';
                });
            return gameList;
        },
        currentGame() {
            const length = this.typeList.length / 3;
            const index = this.selectedIndex % length;
            return { ...this.allGameList[index] };
        },
        vipLevel() {
            return this.currentLevel <= 10 ? this.currentLevel : 'max';
        }
    },
    created() {
        localStorage.removeItem('is-open-game');
        this.showPromotion = this.loginStatus ? this.memInfo.user.show_promotion : true;
    },
    mounted() {
        $(window).on('resize', this.onResize);

        // const params = this.isAdult ? [this.getVideoTag(), this.getVideoSort(), this.getVideoRecommand(), this.getVideoList(), this.getAllGame()] : [this.getAllGame()];

        // 首頁選單列表預設拿local
        const cache = this.getAllGameFromCache();
        const setDefaultSelected = () => {
            this.$nextTick(() => {
                this.isReceive = true;
                setTimeout(() => {
                    $(window).trigger('resize');
                    let defaultType = this.siteConfig.MOBILE_WEB_TPL === "porn1" ? 'Welfare' : 'All'
                    if (localStorage.getItem('type')) {
                        defaultType = localStorage.getItem('type')
                    }

                    let defaultIndex = this.typeList.findIndex((type) => {
                        return type.icon.toLowerCase() === defaultType.toLowerCase()
                    });

                    defaultIndex = defaultIndex >= 0 ? defaultIndex : 0;

                    const selectIndex = this.typeList.length / 3 + defaultIndex;
                    this.onChangeSelectIndex(selectIndex);
                    this.isShow = true;
                }, 300);
            });
        };

        if (!cache) {
            const params = [this.getAllGame()];
            Promise.all(params).then(() => {
                setDefaultSelected();
            });
        } else {
            setDefaultSelected();
            this.getAllGame(true)
        }

        if (!this.loginStatus) {
            return;
        }

        mcenter.vipUserDetail({
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                this.currentLevel = ret.find(item => item.complex).now_level_seq;
            }
        });
    },
    beforeDestroy() {
        $(window).off('resize', this.onResize);
    },
    methods: {
        ...mapActions([
            'actionSetGlobalMessage',
            'actionGetRechargeStatus',
            'actionGetMemInfoV3'
        ]),
        getImg(info) {
            return {
                src: info.image,
                error: this.$getCdnPath(
                    `/static/image/${this.siteConfig.MOBILE_WEB_TPL}/default/default_${info.imageType}.png`
                ),
                loading: this.$getCdnPath(
                    `/static/image/${this.siteConfig.MOBILE_WEB_TPL}/default/default_${info.imageType}.png`
                )
            };
        },
        // 取得所有遊戲
        getAllGameFromCache() {
            let result = false;
            try {
                let videolistStorage = localStorage.getItem('game-list');
                if (videolistStorage) {
                    this.allGame = JSON.parse(localStorage.getItem('game-list'));
                    result = true;
                }
            } catch (e) {
                console.log(e);
            }

            return result;
        },
        // 取得所有遊戲
        getAllGame(setLocal) {
            return yaboRequest({
                method: 'get',
                url: `${this.siteConfig.YABO_API_DOMAIN}/game/list`,
                headers: {
                    'x-domain': this.memInfo.user.domain
                }
            }).then(response => {
                if (!response.data) {
                    return;
                }

                this.isReceive = true;

                try {
                    localStorage.setItem('game-list', JSON.stringify(response.data));
                    localStorage.setItem('game-list-timestamp', Date.now());
                } catch (e) {
                    console.log(e);
                }

                if (!setLocal) {
                    this.allGame = [...response.data];
                }
            });
        },
        onResize() {
            // 計算外框高度
            this.wrapHeight =
                window.innerHeight - this.$refs['home-wrap'].offsetTop - 60;
        },
        onTypeTouchStart(e) {
            if (this.isSliding) {
                return;
            }

            // 取得touch起始位置
            this.typeStartTouchY = e.touches[0].clientY;
        },
        onTypeTouchMove(e) {
            if (this.isSliding) {
                return;
            }

            const ele = this.$refs['type-wrap'];
            const isGoBottom = this.typeStartTouchY > e.touches[0].clientY;

            if (
                isGoBottom &&
                ele.scrollHeight - 10 <= ele.scrollTop + ele.clientHeight
            ) {
                e.preventDefault();
            }
        },
        onTouchStart(e) {
            if (this.isSliding) {
                return;
            }

            // 取得touch起始位置
            this.startTouchY = e.touches[0].clientY;
        },
        onTouchMove(e) {
            let wrap = this.$refs['game-wrap'];
            if (this.isSliding) {
                return;
            }

            // 判斷滑動方向
            this.slideDirection =
                this.startTouchY > e.touches[0].clientY ? 'down' : 'up';
            // 判斷是否置頂
            this.isTop = this.slideDirection === 'up' && wrap.scrollTop <= 10;
            // 判斷是否置底
            this.isBottom =
                this.slideDirection === 'down' &&
                wrap.scrollHeight - 10 <= wrap.scrollTop + wrap.clientHeight;
            if (this.isTop || this.isBottom) {
                e.preventDefault();
            }
        },
        onTouchEnd() {
            if (this.isSliding) {
                return;
            }

            if (this.slideDirection === '') {
                return;
            }

            if (this.isTop) {
                const index =
                    this.selectedIndex <= 0
                        ? this.typeList.length - 1
                        : this.selectedIndex - 1;
                this.onChangeSelectIndex(index, true);
                return;
            }

            if (this.isBottom) {
                const index =
                    this.selectedIndex >= this.typeList.length - 1
                        ? 0
                        : this.selectedIndex + 1;
                this.onChangeSelectIndex(index);
            }
        },
        // 切換當前分類
        onChangeSelectIndex(index, isSetEnd = false) {
            if (index === this.selectedIndex) {
                return;
            }

            this.isSliding = true;
            this.isTop = false;
            this.isBottom = false;
            this.typeStartTouchY = 0;
            this.startTouchY = 0;
            this.slideDirection = '';
            this.selectedIndex = index;
            this.stopScroll = true;

            $(this.$refs['type-wrap']).animate({ scrollTop: index * 63 }, 300);
            $(this.$refs['game-wrap']).animate({ scrollTop: 0 }, 0);

            this.$nextTick(() => {
                this.isSliding = false;
            });

            localStorage.setItem('type', this.typeList[index].icon);

            setTimeout(() => {
                this.stopScroll = false;
                if (isSetEnd) {
                    this.$refs['game-wrap'].scrollTop =
                        this.$refs['game-wrap'].scrollHeight -
                        this.$refs['game-wrap'].clientHeight -
                        this.$refs['wrap-buffer'].offsetHeight;
                }
            }, 100);
        },
        // 前往會員中心
        onGoToMcenter(path) {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (path === 'deposit') {
                this.$router.push(`/mobile/mcenter/deposit`);
                //   0706 統一RD5判斷銀行卡
                // yaboRequest({
                //   method: 'get',
                //   url: `${
                //     this.siteConfig.YABO_API_DOMAIN
                //     }/AccountBank/GetBankBindingStatus/${getCookie('cid')}`,
                //   headers: {
                //     'x-domain': this.memInfo.user.domain
                //   }
                // }).then(res => {
                //   if (res.data) {
                //     this.$router.push(`/mobile/mcenter/deposit`);
                //   } else {
                //     this.actionSetGlobalMessage({ type: 'bindcard', code: 'C50099' });
                //   }
                // });
            } else if (path === 'creditTrans') {
                this.actionGetMemInfoV3().then(() => {
                    this.actionGetRechargeStatus('home');
                })
                return;
            } else if (path === "makemoney") {
                this.$router.push('/mobile/mcenter/tcenter/management/member');
            }
            else if (path === "withdraw") {
                if (this.siteConfig.MOBILE_WEB_TPL !== 'ey1') {
                    this.$router.push('/mobile/mcenter/withdraw');
                    return;
                }

                if (this.isCheckWithdraw) { return; }
                this.isCheckWithdraw = true;
                axios({
                    method: 'get',
                    url: '/api/v2/c/withdraw/check',
                }).then((res) => {
                    this.isCheckWithdraw = false;
                    if (res.data.result === "ok") {
                        let check = true;

                        Object.keys(res.data.ret).forEach(i => {
                            if (i !== "bank" && !res.data.ret[i]) {
                                if (this.siteConfig.MOBILE_WEB_TPL === 'ey1') {
                                    this.actionSetGlobalMessage({
                                        msg: '请先设定提现资料', cb: () => {
                                            {
                                                this.$router.push('/mobile/withdrawAccount');
                                            }
                                        }
                                    })
                                }

                                if (this.siteConfig.MOBILE_WEB_TPL === 'porn1') {
                                    this.actionSetGlobalMessage({
                                        msg: '请先设定提现资料', cb: () => {
                                            {
                                                this.$router.push(`/mobile/mcenter/accountData?reqAccount=home`);
                                            }
                                        }
                                    })
                                }

                                check = false;
                                return;
                            }
                        })

                        if (check) {
                            this.$router.push('/mobile/mcenter/withdraw');
                        }
                    } else {
                        this.actionSetGlobalMessage({ msg: res.data.msg, code: res.data.msg.code });
                    }
                }).catch(res => {
                    if (res.response.data) {
                        this.actionSetGlobalMessage({ msg: res.response.data.msg });
                    }
                    this.isCheckWithdraw = false;
                });
            } else {
                this.$router.push(`/mobile/mcenter/${path}`);
            }
        },
        // 開啟遊戲
        onOpenGame(game) {
            if (localStorage.getItem('is-open-game')) {
                return
            }

            // Game Type
            // L => 遊戲大廳
            // G => 遊戲
            // BL => 美女直播
            // SL => 體育直播
            // D => 代理
            // T => 敬请期待
            // YV => 鴨脖視頻
            // PV => 小豬視頻
            // BB => 男男視頻
            // GG => 女女視頻
            if (game.type === 'D') {
                this.$router.push('/mobile/mcenter/makeMoney')
                return;
            }

            if (game.type === 'T') {
                this.actionSetGlobalMessage({ type: 'incoming' });
                return;
            }

            // 福利 全部
            switch (game.type) {
                // 鴨脖影視(人人影視) -> PPV
                // 美國花花公子 -> APB
                // 日本花花公子 -> JPB
                // 絲瓜-> LF
                // 芭樂 -> BALE
                // 草莓 -> STB
                // 向日葵 -> SF
                // 屌絲漫畫->DSC
                case 'PPV':
                // case 'APB':
                // case 'JPB':
                case 'SWAG':
                case 'LF':
                case 'BALE':
                case 'STB':
                // case 'DSC':
                case 'SF':
                    // 正式站 先不用獨立開啟
                    if (!this.loginStatus) {
                        this.$router.push('/mobile/login');
                        return;
                    }
                    this.$router.push(`/mobile/iframe/${game.type}?&title=${game.name}&hasFooter=false&hasHeader=true`);
                    return;
                // case 'LF':
                // case 'BALE':
                // case 'STB':
                case 'DSC':
                // case 'SF':
                // case 'PPV':
                case 'APB':
                case 'JPB':
                    if (!this.loginStatus) {
                        this.$router.push('/mobile/login');
                        return;
                    }
                    // 調整iframe內嵌
                    let newWindow = window.open('');
                    yaboRequest({
                        method: 'get',
                        url: `${this.siteConfig.YABO_API_DOMAIN}/thirdparty/url`,
                        headers: {
                            'x-domain': this.memInfo.user.domain
                        },
                        params: {
                            type: game.type,
                            userid: this.memInfo.user.id
                        },
                    }).then(res => {
                        if (res.data) {
                            newWindow.location.href = res.data;
                        } else {
                            newWindow.close();
                        }
                    }).catch(error => {
                        newWindow.close();
                    })

                    return;
                case 'YV':
                    this.$router.push({
                        name: 'videoList',
                        query: { source: 'yabo' }
                    });
                    return;

                case 'PV':
                    this.$router.push({
                        name: 'videoList',
                        query: { source: 'smallPig' }
                    });
                    return;

                case 'BB':
                    this.$router.push({
                        name: 'videoList',
                        query: { source: 'gay' }
                    });
                    return;

                case 'GG':
                    this.$router.push({
                        name: 'videoList',
                        query: { source: 'les' }
                    });
                    return;

                case 'SLG':
                case 'BG':
                case 'LTG':
                case 'VG':
                case 'SPG':
                    this.onChangeSelectIndex(+game.targetSequence + 9);
                    return;

                default:
                    break;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            // 大廳
            if (game.type === 'L' && [3, 5, 6].includes(game.kind)) {
                const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
                this.$router.push(`/mobile/${trans[game.kind]}/${game.vendor}`);
                return;
            }

            // 直播
            if (['BL', 'SL'].includes(game.type)) {
                switch (game.type) {
                    case 'BL':
                        this.$router.push('/mobile/liveStream?type=cutiesLive');
                        break;
                    case 'SL':
                        this.$router.push('/mobile/liveStream?type=ballLive');
                        break;
                    default:
                        break;
                }
                return;
            }


            //   if (game.type === 'R') {
            //     let urlParams =
            //       game.vendor === 'lg_live' ? '&customize=yabo&tableType=3310' : '';
            //     let newWindow = '';
            //     // 辨別裝置是否為ios寰宇瀏覽器
            //     const isUBMobile =
            //       navigator.userAgent.match(/UBiOS/) !== null &&
            //       navigator.userAgent.match(/iPhone/) !== null;
            //     // 暫時用來判斷馬甲包
            //     const webview = window.location.hostname === 'yaboxxxapp02.com';

            //     // ios寰宇瀏覽器目前另開頁面需要與電腦版開啟方式相同
            //     if (!isUBMobile && !webview) {
            //       newWindow = window.open('', '_blank');
            //     }
            //     ajax({
            //       method: 'get',
            //       url: `${API_GET_VENDOR}/${game.vendor}/game/launch`,
            //       errorAlert: false,
            //       params: { kind: game.kind },
            //       success: ({ result, ret }) => {
            //         if (result !== 'ok') {
            //           if (!isUBMobile && !webview) {
            //             newWindow.close();
            //           }
            //           return;
            //         }

            //         if (webview) {
            //           window.location.href = ret.url + urlParams;
            //           return;
            //         }
            //         if (!isUBMobile) {
            //           newWindow.location.href = ret.url + urlParams;
            //           return;
            //         }

            //         window.open(ret.url + urlParams);
            //       },
            //       fail: error => {
            //         if (!isUBMobile || !webview) {
            //           newWindow.alert(
            //             `${error.data.msg} ${
            //             error.data.code ? `(${error.data.code})` : ''
            //             }`
            //           );
            //         }
            //         newWindow.close();
            //         window.location.reload();d
            //       }
            //     });
            //     return;
            //   }

            this.isShowLoading = true;

            const openGameSuccessFunc = (res) => {
                this.isShowLoading = false;
            };

            const openGameFailFunc = (res) => {
                this.isShowLoading = false;

                if (res && res.data) {
                    let msg = res.data.msg;
                    if (res.data.code !== "C50099" && res.data.code !== "C50100") {
                        msg = `${res.data.msg}`
                    }
                    let data = res.data;
                    this.actionSetGlobalMessage({ msg: msg, code: data.code, origin: 'home' })
                }
            };
            if (game.type === "R") {
                openGame({ kind: game.kind, vendor: game.vendor, code: game.code, gameType: game.type }, openGameSuccessFunc, openGameFailFunc);
            } else {
                openGame({ kind: game.kind, vendor: game.vendor, code: game.code }, openGameSuccessFunc, openGameFailFunc);
            }
        },
        getUserViplevel() {
            let cid = getCookie("cid");
            if (!cid && this.loginStatus) { return; }
            yaboRequest({
                method: "get",
                url: `${
                    this.siteConfig.YABO_API_DOMAIN
                    }/player/vipinfo/${cid}`,
                headers: { "x-domain": this.memInfo.user.domain }
            }).then(res => {
                this.userViplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
            });
        }
    },
};
