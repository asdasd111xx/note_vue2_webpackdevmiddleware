import { getCookie, setCookie } from '@/lib/cookie';
import { mapActions, mapGetters } from 'vuex';

import Vue from 'vue';
import axios from 'axios';
import goLangApiRequest from '@/api/goLangApiRequest';
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
      maintainList: [],
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
      ],
      timer: null,
      // develop branch 防報錯
      isMaintainSwag: false
    };
  },
  watch: {
    isReceive() {
      setTimeout(() => {
        this.onResize();
      }, 300)
    },
    noticeData() {
      if (this.noticeData && this.noticeData.length > 0) {
        // this.data = this.noticeData.pop();
        let temp = this.noticeData[this.noticeData.length - 1]
        if (temp.event === "vendor_maintain_notice") {
          this.timer = setInterval(() => {
            this.getMaintainList();
            clearInterval(this.timer);
            this.timer = null;
            return;
          }, 70000);

        }
      }
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
      yaboConfig: 'getYaboConfig',
      noticeData: 'getNoticeData',
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
            id: game.id,
            icon: game.iconName,
            name: game.name
          }))
          .filter(type => {
            return this.isAdult ? type : type.icon !== 'Welfare';
          });

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
      if (this.maintainList.length > 0) {
        // console.log("存入維護狀態");
        this.allGame.find(data => {
          if (!data.vendors) {
            return;
          }
          data.vendors.find(game => {
            this.maintainList.find(maintainData => {
              if (maintainData.vendor === game.vendor && maintainData.kind === game.kind) {
                game.isMaintain = true;
                game.start_at = Vue.moment(maintainData.start_at).utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');//maintainData.start_at;
                game.end_at = Vue.moment(maintainData.end_at).utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');//maintainData.end_at;
                // console.log(game);
              }
            })
          })
        })
      }

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
    this.getMaintainList();
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
      'actionGetMemInfoV3',
      'actionSetYaboConfig'
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
      //     return yaboRequest({
      //         method: 'get',
      //         url: `${this.siteConfig.YABO_API_DOMAIN}/game/list`,
      //         headers: {
      //             'x-domain': this.memInfo.user.domain
      //         }
      //     }).then(response => {
      //         console.log("getAllGame~~~~!!");
      //         if (!response.data) {
      //             return;
      //         }

      //         this.isReceive = true;

      //         try {
      //             localStorage.setItem('game-list', JSON.stringify(response.data));
      //             localStorage.setItem('game-list-timestamp', Date.now());
      //         } catch (e) {
      //             console.log(e);
      //         }

      //         if (!setLocal) {
      //             this.allGame = [...response.data];
      //         }
      //     });

      return goLangApiRequest({
        method: 'get',
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/Game/list`,
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
      let extraHeight = 60;
      if (this.siteConfig.MOBILE_WEB_TPL === "porn1") {
        extraHeight = 60;
      }

      if (this.siteConfig.MOBILE_WEB_TPL === "ey1") {
        extraHeight = 85;
      }

      this.wrapHeight = document.body.offsetHeight - this.$refs['home-wrap'].offsetTop - extraHeight;
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
    onChangeSelectIndex(index, isSetEnd = false, type) {
      if (index === this.selectedIndex) {
        return;
      }

      let offsetTop = 0;

      if (type === 'anchor') {
        let anchor = document.querySelectorAll(`div[data-id="${index}"]`);
        if (anchor && anchor[1]) {
          offsetTop = anchor[1].offsetTop;
        }
        this.selectedIndex = this.typeList.findIndex(i => +i.id === +index);
      } else {
        offsetTop = index * 63;
        this.selectedIndex = index;
      }

      this.isSliding = true;
      this.isTop = false;
      this.isBottom = false;
      this.typeStartTouchY = 0;
      this.startTouchY = 0;
      this.slideDirection = '';
      this.stopScroll = true;

      $(this.$refs['type-wrap']).animate({ scrollTop: offsetTop }, 300);
      $(this.$refs['game-wrap']).animate({ scrollTop: 0 }, 0);

      this.$nextTick(() => {
        this.isSliding = false;
      });

      localStorage.setItem('type', this.typeList[this.selectedIndex].icon);

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

      switch (path) {
        case 'deposit':
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
          return;

        case 'creditTrans':
          this.actionGetMemInfoV3().then(() => {
            this.actionGetRechargeStatus('home');
          })
          return;

        case 'makemoney':
          this.$router.push('/mobile/mcenter/tcenter/management/member');
          return;

        case 'balanceTrans':
          if (this.siteConfig.MOBILE_WEB_TPL === "porn1") {
            this.$router.push(`/mobile/mcenter/balanceTrans`);
            return;
          }

          axios({
            method: 'get',
            url: '/api/v2/c/domain-config',
          }).then(res => {
            let withdraw_info_before_bet = false;
            if (res && res.data && res.data.ret) {
              withdraw_info_before_bet = res.data.ret.withdraw_info_before_bet;
            }

            if (withdraw_info_before_bet) {
              this.checkWithdrawData(path);
              return;
            }

            this.$router.push("/mobile/mcenter/balanceTrans");
          }).catch((res) => {
            this.actionSetGlobalMessage({
              msg: res.data.msg, code: res.data.code, origin: 'home'
            });
          })
          return;

        case 'withdraw':
          if (this.siteConfig.MOBILE_WEB_TPL === "porn1") {
            this.$router.push(`/mobile/mcenter/withdraw`);
            return;
          }
          this.checkWithdrawData(path);
          return;

        default:
          this.$router.push(`/mobile/mcenter/${path}`);
          return;
      }
    },
    checkWithdrawData(target) {
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
              this.actionSetGlobalMessage({
                msg: target === 'withdraw' ? '请先完成提现信息' : '请先设定提现资料'
                , cb: () => {
                  {
                    this.$router.push('/mobile/withdrawAccount');
                  }
                }
              })
              check = false;
              return;
            }
          })

          if (check) {
            this.$router.push(`/mobile/mcenter/${target}`);
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
    },
    // 開啟遊戲
    onOpenGame(game) {
      if (localStorage.getItem('is-open-game')) {
        return;
      }

      switch (game.type) {
        case 'thirdparty':

          let userId = 'guest';
          if (this.memInfo &&
            this.memInfo.user &&
            this.memInfo.user.id &&
            this.memInfo.user.id !== 0) {
            userId = this.memInfo.user.id;
          }

          switch (game.vendor) {
            case 'SWAG':
              if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
              } else {
                localStorage.setItem("is-open-game", true);

                goLangApiRequest({
                  method: 'get',
                  url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/ThirdParty/SWAG/${userId}`,
                  headers: {
                    'x-domain': this.memInfo.user.domain
                  }
                }).then(res => {
                  localStorage.removeItem("is-open-game");

                  if (res && res.status !== '000') {
                    if (res.msg) {
                      this.actionSetGlobalMessage({ msg: res.msg });
                    }
                    return;
                  }
                  else {
                    localStorage.setItem('iframe-third-url', res.data);
                    localStorage.setItem('iframe-third-origin', 'home');
                    this.$router.push(`/mobile/iframe/SWAG?&hasFooter=false&hasHeader=true`);
                    return;
                  }
                })

                return;
              }

            // 鴨脖影視(人人影視) → PPV
            // 美國花花公子 → APB
            // 日本花花公子 → JPB
            // 絲瓜→ LF
            // 芭樂 → BALE
            // 草莓 → STB
            // 向日葵 → SF
            // 屌絲漫畫 → DSC
            // SWAG小說 → LQ
            // 絲瓜小說 → DZ
            default:
              localStorage.setItem("is-open-game", true);

              this.actionSetYaboConfig().then(() => {

                let noLoginVideoSwitch;

                if (this.yaboConfig) {
                  noLoginVideoSwitch = this.yaboConfig.find(i => i.name === "NoLoginVideoSwitch").value;
                }

                // // 第三方開啟有問題時 可調整iframe內嵌
                // let newWindow = window.open('');
                // goLangApiRequest({
                //     method: 'get',
                //     url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/ThirdParty/${game.vendor}/${this.memInfo.user.id}`,
                //     headers: {
                //         'x-domain': this.memInfo.user.domain
                //     },
                // }).then(res => {
                //     if (res.data) {
                //         newWindow.location.href = res.data;
                //     } else {
                //         newWindow.close();
                //     }
                // }).catch(error => {
                //     newWindow.close();
                // })
                // return;

                const getThridUrl = () => goLangApiRequest({
                  method: 'get',
                  url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/ThirdParty/${game.vendor}/${userId}`,
                  headers: {
                    'x-domain': this.memInfo.user.domain
                  }
                }).then(res => {
                  localStorage.removeItem("is-open-game");

                  if (res && res.status !== '000') {
                    if (res.msg) {
                      this.actionSetGlobalMessage({ msg: res.msg });
                    }
                    return;
                  }
                  else {
                    localStorage.setItem('iframe-third-url', res.data);
                    localStorage.setItem('iframe-third-url-title', game.name);
                    this.$router.push(`/mobile/iframe/${game.type}?&hasFooter=false&hasHeader=true`);
                    return;
                  }
                })

                // 未登入開關 開啟時未登入可進入
                if (noLoginVideoSwitch === 'true') {
                  getThridUrl();
                  return;
                }

                // 未登入開關 未開啟時需登入可進入
                if (!this.loginStatus) {
                  this.$router.push('/mobile/login');
                  return;
                } else {
                  getThridUrl();
                }
              });
          }
          return;
        case 'link_to':

          switch (game.vendor) {
            case 'agent':
              this.$router.push('/mobile/mcenter/makeMoney')
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

            case 'BL':
              this.$router.push('/mobile/liveStream?type=cutiesLive');
              return;

            case 'SL':
              this.$router.push('/mobile/liveStream?type=ballLive');
              return;
          }

        case 'anchor':
          this.onChangeSelectIndex(game.vendor, false, 'anchor');
          return;

        case 'T':
          this.actionSetGlobalMessage({ type: 'upgrade' });
          return;

        case 'U':
          this.actionSetGlobalMessage({ type: 'incoming' });
          return;

        // 大廳
        case 'game_lobby':
          if (!this.loginStatus) {
            this.$router.push('/mobile/login');
            return;
          }

          if ([3, 5, 6].includes(game.kind)) {
            const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
            this.$router.push(`/mobile/${trans[game.kind]}/${game.vendor}`);
            return;
          }
          return;
        // 開啟遊戲
        case 'game':
        default:
          if (!this.loginStatus) {
            this.$router.push('/mobile/login');
            return;
          }

          this.isShowLoading = true;

          const openGameSuccessFunc = (res) => {
            this.isShowLoading = false;
          };

          const openGameFailFunc = (res) => {
            this.isShowLoading = false;

            if (res && res.data) {
              let data = res.data;
              this.actionSetGlobalMessage({ msg: data.msg, code: data.code, origin: 'home' })
            }
          };

          openGame({ kind: game.kind, vendor: game.vendor, code: game.code, gameType: game.type }, openGameSuccessFunc, openGameFailFunc);
          return;
      }
    },
    getUserViplevel() {
      let cid = getCookie("cid");
      if (!cid && this.loginStatus) { return; }
      // yaboRequest({
      //     method: "get",
      //     url: `${
      //         this.siteConfig.YABO_API_DOMAIN
      //         }/player/vipinfo/${cid}`,
      //     headers: { "x-domain": this.memInfo.user.domain }
      // }).then(res => {
      //     this.userViplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
      // });
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN
          }/Player/vipinfo`,
        headers: {
          "x-domain": this.memInfo.user.domain,
          "cid": cid
        }
      }).then(res => {
        this.userViplevel = res.data ? res.data[0] && res.data[0].now_level_seq : 0;
      });
    },

    getMaintainList() {
      if (this.loginStatus) {
        //取維護狀態
        axios({
          method: 'get',
          url: '/api/v1/c/vendor/maintains',
        }).then((res) => {
          if (res.data.result == "ok") {
            // console.log("取維護狀態");
            // console.log(res.data);
            this.maintainList = res.data.ret;
          }
        }).catch(res => {
          // console.log("取維護狀態XXXX");
        });
      }
    }
  },
};
