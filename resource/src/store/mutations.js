/* eslint-disable no-param-reassign */

import Vue from 'vue';
import jwt from 'jwt-simple';
import EST from '@/lib/EST';
import i18n from '@/config/i18n';
// import navFilterPage from '@/lib/nav_filter_page';
import * as types from './mutations_type';

export default {
    // Webview介接(客端、廳主端)
    [types.SETWEBVIEW](state) {
        state.isWebview = true;
    },
    // 設定環境 (會員端/代理客端)
    [types.SETENV](state, str) {
        state.env = str;
    },
    // 設定後台資料
    [types.SETWEBINFO](state, webInfo) {
        const temp = webInfo;

        if (state.env === 'mem') {
            /* 取 page 組 pageData資料 (提出sub資料) */
            const tempPage = {};
            temp.page.forEach((value) => {
                tempPage[value.pid] = value;
                if (value.sub_page && value.sub_page.length > 0) {
                    value.sub_page.forEach((subValue) => {
                        tempPage[subValue.pid] = subValue;
                    });
                }
            });
            temp.pageData = tempPage;

            /* 頁尾資訊 \n 改成 <br> */
            if (temp.footer) {
                const tempObj = {};

                // 新舊版共存特例, 舊版後台格式處理
                if (typeof (temp.footer) === 'string') {
                    const tempStr = temp.footer.replace(/\n/g, '<br>');
                    Object.keys(temp.language).forEach((key) => {
                        tempObj[key] = tempStr;
                    });
                }

                if (typeof (temp.footer) === 'object') {
                    Object.keys(temp.footer).forEach((key) => {
                        tempObj[key] = temp.footer[key].replace(/\n/g, '<br>');
                    });
                }

                temp.footer = tempObj;
            }
        }

        // 套版用
        if (process.env.NODE_ENV === 'development' && (Vue.cookie.get('TEST_TEMPLATE') !== null && Vue.cookie.get('TEST_TEMPLATE') !== '')) {
            const templateInfo = Vue.cookie.get('TEST_TEMPLATE').split(',');
            [temp.model, temp.style_color] = templateInfo;
        }

        // italking
        const regExp = /^.*italking\.asia|^.*italking\.org/;

        if (regExp.test(temp.on_service_url) && state.loginStatus) {
            const memberData = {
                name: state.memInfo.user.name || '',
                mobile: state.memInfo.user.phone || '',
                account: state.memInfo.user.username
            };
            const rsaData = jwt.encode(memberData, 'T9AuSgQfh2');
            temp.on_service_url = `${temp.on_service_url}&jwtToken=${rsaData}`;
        }

        const language = Object.keys(temp.language).reduce((pre, key) => {
            if (['47', '70', '71'].includes(temp.alias) && key === 'zh-cn' && webInfo.is_production) {
                return { ...pre };
            }

            return {
                ...pre,
                [key]: temp.language[key]
            };
        }, {});

        state.webInfo = {
            ...state.webInfo,
            ...temp,
            language,
            special_case: {
                field: [...(webInfo.special_case.floatPic ? webInfo.special_case.floatPic[0].data : [])]
            }
        };
    },
    // 設定取預覽的自改資料
    [types.SETPREVIEW](state, status) {
        state.preview = status;
    },
    // 設定是否透過外面CDN廠商代理
    [types.SETCDNROOT](state, url) {
        state.cdnRoot = url;
    },
    // 設定遊戲資料
    [types.SETGAMEDATA](state, gameData) {
        const temp = state.gameData;
        const apiData = {};

        gameData.forEach((value) => {
            apiData[`${value.vendor}_${value.kind}`] = value;
        });

        Object.keys(temp).forEach((index) => {
            if (apiData[`${temp[index].vendor}_${temp[index].kind}`]) {
                temp[index].switch = 'Y';
                temp[index].alias = apiData[`${temp[index].vendor}_${temp[index].kind}`].alias;
                temp[index].category = apiData[`${temp[index].vendor}_${temp[index].kind}`].category;
            } else {
                temp[index].switch = 'N';
                temp[index].alias = temp[index].text;
                temp[index].category = '';
            }
        });
        state.gameData = temp;
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     客端 page
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 客端-設定當前頁
    [types.CHANGEPAGE](state, page) {
        // page 若為 pid 轉為數字
        page = Number.isNaN(+page) ? page : +page;
        state.nowpage = page;
    },
    // 客端-電子頁-設定供應商
    [types.SETCASINOVENDOR](state, vendor) {
        state.casinoVendor = vendor;
    },
    // 客端-電子頁-設定API讀取狀態
    [types.SETCASINOLOADINGSTATUS](state, status) {
        state.casinoLoadingStatus = status;
    },
    // 客端-優惠頁-設定全部資料
    [types.SETPROMOTION](state, promotion) {
        state.promotion = promotion;
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     會員、代理 共用
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 會員、代理共用-設定系統時間
    [types.SETSYSTEMTIME](state, str) {
        state.systemTime = str;
    },
    // 會員、代理共用-設定彈出視窗
    [types.SETPOP](state, { type, data }) {
        state.pop = {
            type: state.pop.type === type ? '' : type,
            data
        };
    },
    [types.SETMOBILECHECK](state, { status }) {
        state.mobileCheck = status;
    },
    // 會員、代理共用-最新消息彈出視窗
    [types.NEWSPOPCONTROL](state, data) {
        state.newsPopControl = {
            ...state.newsPopControl,
            ...data
        };
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     MEM 會員相關
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 會員端-設定會員資訊
    [types.SETMEMINFO](state, info) {
        state.memInfo = {
            ...state.memInfo,
            ...info
        };
    },
    // 會員端-設定登入狀態
    [types.ISLOGIN](state, isLogin) {
        state.loginStatus = isLogin;
    },
    // 會員端-設定會員餘額
    [types.SETUSERBALANCE](state, data) {
        const temp = {};
        const maintainList = {};

        // 組維護資訊
        if (data.maintain && data.maintain.length) {
            for (let i = 0; i < data.maintain.length; i += 1) {
                maintainList[data.maintain[i].vendor] = {
                    start_at: Vue.moment(data.maintain[i].start_at).format('YYYY-MM-DD HH:mm:ss'),
                    end_at: Vue.moment(data.maintain[i].end_at).format('YYYY-MM-DD HH:mm:ss'),
                    etc_start_at: EST(data.maintain[i].start_at),
                    etc_end_at: EST(data.maintain[i].end_at)
                };
            }
        }

        for (let i = 0; i < data.ret.length; i += 1) {
            let key = data.ret[i].vendor;
            let text = data.ret[i].alias;
            if (data.ret[i].vendor === '--') {
                key = 'default';
                text = ['67', '69', '500011'].includes(state.webInfo.alias) ? i18n.t('S_MCENTER_WALLET') : i18n.t('S_MAIN_BALANCE');
            }

            temp[key] = {
                amount: data.ret[i].balance,
                text
            };

            if (maintainList[data.ret[i].vendor]) {
                // 額度列表設定維護資訊
                temp[key].maintain = maintainList[data.ret[i].vendor];
                // 維護列表設定額度名稱
                maintainList[data.ret[i].vendor].text = text;
            }
        }
        state.memInfo.balance = {
            total: data.total,
            maintain: maintainList,
            vendor: temp
        };
    },
    // 會員端-設定跑馬燈
    [types.SETNEWS](state, obj) {
        const apiData = [];

        Object.keys(obj).forEach((index) => {
            apiData[index] = {
                time: EST(obj[index].created_at, 'YYYY-MM-DD HH:mm:ss'),
                content: obj[index].content,
                id: obj[index].id
            };
        });
        state.news = apiData;
    },
    // 會員端-設定公告
    [types.SETPOST](state, { config, ret }) {
        let isLogin;
        const list = [];
        config = {
            ...config,
            last_modified_at: EST(config.last_modified_at)
        };

        /**  isLogin 登入狀態
         * 1: 登入前
         * 2: 登入後
         * 3: 不限制
         */
        if (state.loginStatus) {
            isLogin = 2;
        } else {
            isLogin = 1;
        }

        Object.keys(ret).forEach((index) => {
            if (ret[index].popup === isLogin || ret[index].popup === 3) {
                const resultData = ret[index];
                list.push(resultData);
            }
        });

        state.post = {
            config,
            list
        };
    },
    // 會員端-加入最愛的遊戲列表
    [types.SETFAVORITEGAME](state, data) {
        state.favoriteGame = data;
    },
    // 會員端-設定下方遊戲框顯示狀態
    [types.SET_COLLECTION_STATUS](state, status) {
        state.showCollection = status;
    },

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     AGENT 代理相關
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 代理端-設定代理資訊
    [types.SETAGENTMEMINFO](state, info) {
        state.agentInfo = {
            ...state.agentInfo,
            ...info
        };
    },
    // 代理端-設定登入狀態
    [types.SETAGENTLOGIN](state, isLogin) {
        state.agentIsLogin = isLogin;
    },
    // 代理端-設定跑馬燈
    [types.SETAGENTNEWS](state, obj) {
        const apiData = [];

        Object.keys(obj).forEach((index) => {
            apiData[index] = {
                time: EST(obj[index].created_at, 'YYYY-MM-DD'),
                content: obj[index].content
            };
        });
        state.agentNews = apiData;
    },
    // 代理端-設定公告
    [types.SETAGENTPOST](state, { config, ret }) {
        const list = [];
        config = {
            ...config,
            last_modified_at: EST(config.last_modified_at)
        };

        Object.keys(ret).forEach((index) => {
            list[index] = ret[index];
        });

        state.agentPost = {
            config,
            list
        };
    },
    // 代理端-設定使用者層級
    [types.SET_AGENT_USER_LEVELS](state, obj) {
        state.agentUserLevels = {
            ...state.agentUserLevels,
            ...obj
        };
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     MCENTER 會員中心
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 會員中心-設定未讀訊息
    [types.SETMCENTERMSGCOUNT](state, num) {
        state.memInfo = {
            ...state.memInfo,
            msgCount: num
        };
    },
    // 會員中心-設定我的返水-當前頁籤 (返水歷史/實時返水)
    [types.SETMCENTERBANKREBATE](state, obj) {
        state.mcenterBankRebate = obj;
    },
    // 會員中心-我的返水
    [types.SETMCENTERREBATE](state, obj) {
        state.mcenterRebate = obj.url;
        state.mcenterRebateEmbed = obj.embed;
    },
    // 會員中心-存款連結
    [types.SET_MCENTER_DEPOSIT](state, obj) {
        state.mcenterDeposit = obj.uri;
        state.mcenterDepositEmbed = obj.embed;
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     AGCENTER 代理中心
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 代理中心-設定未讀訊息
    [types.SETAGCENTERMSGCOUNT](state, num) {
        state.agentInfo = {
            ...state.agentInfo,
            msgCount: num
        };
    },
    // 代理中心-設定代理會員連動帳號, 塞入agentInfo
    [types.SETAGCENTERMEMUSERNAME](state, value) {
        state.agentInfo = {
            ...state.agentInfo,
            memUsername: value
        };
    },
    // 代理中心-設定代理連結(推廣網址)、合營連結, 塞入agentInfo
    [types.SETAGCENTERLINKS](state, obj) {
        state.agentInfo = {
            ...state.agentInfo,
            intrLink: obj.intrLink,
            outLink: obj.outLink
        };
    },
    // 代理中心-設定取款選定期數
    [types.SETAGCENTERWDPERIOD](state, period) {
        state.agcenterWdPeriod = period;
    },

    [types.ADD_CASE_ITEM](state, data) {
        state.webInfo = {
            ...state.webInfo,
            pageData: {
                ...state.webInfo.pageData,
                [data.nowpage]: {
                    ...state.webInfo.pageData[data.nowpage],
                    data: [...state.webInfo.pageData[data.nowpage].data.map((info) => {
                        if (info.i === data.case_id) {
                            return {
                                ...info,
                                case: {
                                    ...info.case,
                                    content: [
                                        ...data.content
                                    ],
                                    data: [
                                        ...data.field
                                    ],
                                    setting: {
                                        ...data.setting
                                    }
                                }
                            };
                        }
                        return { ...info };
                    })]
                }
            }
        };
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     APP下載頁資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    [types.SET_APP_DOWNLOAD_INFO](state, data) {
        state.appInfo = {
            ...state.appInfo,
            downloadInfo: data
        };
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     QR Code資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    [types.SET_APP_QRCODE](state, data) {
        state.appInfo = {
            ...state.appInfo,
            qrcode: data
        };
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     手機資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    [types.SETMOBILEINFO](state, data) {
        state.mobileInfo = data;
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     電子彩金
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 設定電子彩金資料
    [types.SETJACKPOT](state, data) {
        state.jackpot = {
            ...data
        };
    },
    // 設定網站設定檔
    [types.SETSITECONFIG](state, data) {
        state.siteConfig = {
            ...data
        };
    },
    // 推播中心資料
    [types.SETNOTICEDATA](state, data) {
        state.noticeData = data;
    },
    // VIP
    [types.SET_VIP](state, data) {
        state.vip = data.find((item) => item.complex);
    },
    // isLoading
    [types.SET_ISLOADING](state, data) {
        state.isLoading = data;
    }
};
