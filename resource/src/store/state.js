import i18n from '@/config/i18n';
import gameData from '@/config/games';

export default {
    // Webview介接(客端、廳主端)
    isWebview: false,
    // 後台左側slidebar的寬度
    sidebarWidth: 0,
    // 環境 (會員端/代理客端)
    env: 'mem',
    vip: {
        enable: false
    },
    allVip: [],
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     後台(mangosteen_front)共用
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    isBackEnd: false,
    nowtpl: null,
    curLang: i18n.locale,
    languageIndex: {},
    slideBar: '',
    layoutRequested: [],
    isFetching: {
        layout: false
    },
    webInfo: {
        cdn_domain: '',
        logo: '',
        logo_hov: '',
        flash_switch: 'off',
        flash_logo: '',
        style_color: 'dark-grey',
        txt_style: 'default',
        pageData: {},
        footer: {},
        special_case: {
            field: []
        }
    },
    // 預覽模式開關
    preview: false,
    // 設定是否透過外面CDN廠商代理
    cdnRoot: '',
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     字型對照表
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    tplTxtStyle: {
        modern: '思源黑體',
        yaHei: 'Microsoft YaHei',
        normal: '新細明體',
        tradition: '標楷體',
        default: 'Microsoft JhengHei, 微軟正黑體, arial, helvetica, sans-serif'
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     遊戲資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    gameData,
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     電子彩金
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    jackpot: {
        bbin: {
            isShow: false
        },
        mg2: {
            isShow: false
        },
        mg: {
            isShow: false
        },
        gns: {
            isShow: false
        },
        isb: {
            isShow: false
        },
        pt: {
            isShow: false
        },
        sg: {
            isShow: false
        },
        ag_casino: {
            isShow: false
        },
        jdb: {
            isShow: false
        },
        hb: {
            isShow: false
        },
        cq9: {
            isShow: false
        },
        fg: {
            isShow: false
        },
        lg_casino: {
            isShow: false
        },
        gti: {
            isShow: false
        }
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     客端 page
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 客端-當前頁
    nowpage: '',
    // 客端-電子頁-供應商
    casinoVendor: 'bbin',
    // 客端-電子頁-API讀取狀態
    casinoLoadingStatus: false,
    // 客端-優惠頁-全部資料
    promotion: [],
    // 加入最愛的遊戲列表
    favoriteGame: [],
    // 下方遊戲框顯示狀態
    showCollection: false,
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     會員、代理 共用
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 會員、代理共用-重設密碼 欄位
    pwdResetInfo: {
        username: {
            key: 'username',
            text: 'S_ACCOUNT',
            type: 'text',
            regExp: /^[a-z][a-z0-9]{3,19}$/,
            errorMsg: 'S_USERNAME_ERROR',
            defaultErrMsg: '请输入4-20码英文小写、数字，首字不得为数字'
        },
        email: {
            key: 'email',
            text: 'S_E_MAIL',
            type: 'text',
            regExp: /^[A-Za-z0-9.\-_]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
            errorMsg: 'S_JM_EMAIL_FORMAT_UNAVAILABLE',
            defaultErrMsg: 'E-mail 格式不正确'
        },
        password: {
            key: 'password',
            text: 'S_PASSWORD',
            type: 'password',
            regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
            errorMsg: 'S_PASSWORD_ERROR',
            defaultErrMsg: '请输入6-12码英文小写、数字'
        },
        chkPwd: {
            key: 'chkPwd',
            text: 'S_PWD_CONFIRM',
            type: 'password',
            regExp: '',
            errorMsg: 'S_JM_PASSWD_CONFIRM_ERROR',
            defaultErrMsg: '确认密码错误，请重新输入'
        }
    },
    // 會員、代理共用-系統時間
    systemTime: '',
    // 會員、代理共用-彈出視窗
    pop: {
        type: '',
        data: ''
    },
    mobileCheck: false,
    newsPopControl: {
        type: 'mem',
        status: false
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     MEM 會員相關
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 會員資訊
    memInfo: {
        config: {
            /* 是否為訪客 */
            read_only: false
        },
        auto_transfer: {
            enable: false
        },
        msgCount: 0,
        balance: {
            vendor: {
                default: {}
            },
            maintain: {}
        }
    },
    // 會員端-登入狀態
    loginStatus: false,
    // 會員端-跑馬燈
    news: [],
    // 會員端-公告
    post: {
        config: {},
        list: []
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     AGENT 代理相關
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 代理資訊
    agentInfo: {
        memUsername: '',
        intrLink: '',
        outLink: '',
        msgCount: 0
    },
    // 代理端-登入狀態
    agentIsLogin: false,
    // 代理端-跑馬燈
    agentNews: [],
    // 代理端-公告
    agentPost: {
        config: {},
        list: []
    },
    // 代理端-使用者層級
    agentUserLevels: {},
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     MCENTER 會員中心
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 會員中心-我的返水-當前頁籤 (返水歷史/實時返水)
    mcenterBankRebate: {
        type: 'history',
        interval: 'yesterday'
    },
    // 會員中心-左側列表
    mcenterList: [
        {
            key: 'account',
            text: 'S_MY_ACCOUNT',
            item: [
                {
                    key: 'accountData',
                    text: 'S_ACCOUNT_DATA',
                    icon: 'envelope'
                },
                {
                    key: 'accountBankCard',
                    text: 'S_BIND_BANK',
                    icon: 'money-check-alt'
                },
                {
                    key: 'accountVip',
                    text: 'VIP',
                    icon: 'crown'
                }
            ]
        },
        {
            key: 'bank',
            text: 'S_PERSONAL_BANK',
            item: [
                {
                    key: 'deposit',
                    text: 'S_ACCOUNT_DEPOSITE',
                    icon: 'money-bill-wave-alt'
                },
                {
                    key: 'withdraw',
                    text: 'S_ACCOUNT_WITHDRAW',
                    icon: 'money-bill-wave'
                },
                {
                    key: 'bankBalanceTran',
                    text: 'S_TRAN_BALANCE',
                    icon: 'share'
                },
                {
                    key: 'bonusAccount',
                    text: 'S_BONUS_ACCOUNT',
                    icon: 'coins'
                },
                {
                    key: 'bankRebate',
                    text: 'S_MYREBATE',
                    icon: 'donate'
                },
                {
                    key: 'bankMoneyDetail',
                    text: 'S_FUNDS_DETAILS',
                    icon: 'money-check-alt'
                }
            ]
        },
        {
            key: 'tcenter',
            text: 'S_TEAM_CENTER',
            item: [
                {
                    key: 'management',
                    text: 'S_TEAM_MANAGEMENT',
                    icon: 'users'
                },
                {
                    key: 'gameRecord',
                    text: 'S_GAME_RECORD',
                    icon: 'file-signature'
                },
                {
                    key: 'commission',
                    text: 'S_MY_COMMISSION',
                    icon: 'donate'
                }
            ]
        },
        {
            key: 'bet',
            text: 'S_BET_INFO',
            item: [
                {
                    key: 'betRecord',
                    text: 'S_BETHISTORYBTN',
                    icon: 'file-alt'
                }
                // {
                //     key: 'betAmount',
                //     text: 'S_EF_STR'
                // }
            ]
        },
        {
            key: 'info',
            text: 'S_MSG_CENTER',
            item: [
                {
                    key: 'infoMessage',
                    text: 'S_PERSONAL_MESSAGE',
                    icon: 'envelope'
                },
                {
                    key: 'infoPost',
                    text: 'S_HOT_NEWS',
                    icon: 'bullhorn'
                },
                {
                    key: 'feedBack',
                    text: 'S_FEEDBACK',
                    icon: 'envelope-open'
                }
            ]
        }
    ],
    // 會員中心-存款
    mcenterDeposit: '',
    mcenterDepositEmbed: false,
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     AGCENTER 代理中心
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 代理中心-左側列表
    agcenterList: [
        {
            key: 'account',
            text: 'S_MY_ACCOUNT',
            item: [
                {
                    key: 'accountData',
                    text: 'S_ACCOUNT_DATA'
                },
                {
                    key: 'accountBankCard',
                    text: 'S_BIND_BANK'
                }
            ]
        },
        {
            key: 'finance',
            text: 'S_FINANCE_CENTER',
            item: [
                {
                    key: 'financeWithdraw',
                    text: 'S_ACCOUNT_WITHDRAW'
                },
                {
                    key: 'financeReward',
                    text: 'S_COMMISSION_DETAILS'
                }
            ]
        },
        {
            key: 'report',
            text: 'S_REPORT_CENTER',
            item: [
                {
                    key: 'reportMember',
                    text: 'S_MEMBER_LIST'
                },
                {
                    key: 'reportGameRecord',
                    text: 'S_MEM_GAME_RECORD'
                }
            ]
        },
        {
            key: 'info',
            text: 'S_MSG_CENTER',
            item: [
                {
                    key: 'infoMessage',
                    text: 'S_PERSONAL_MESSAGE'
                },
                {
                    key: 'infoPost',
                    text: 'S_HOT_NEWS'
                },
                {
                    key: 'feedBack',
                    text: 'S_FEEDBACK'
                }
            ]
        },
        {
            key: 'mobile',
            text: 'S_MOBILE',
            item: [
                {
                    key: 'downloadApp',
                    text: 'S_DOWNLOAD_APP'
                }
            ]
        }
    ],
    // 代理中心-取款選定期數
    agcenterWdPeriod: '',
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     手機資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    mobileInfo: {},
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     APP下載資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    appInfo: {
        qrcode: {},
        downloadInfo: {}
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     推播訊息資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    noticeData: [],
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     各網站設定檔
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    siteConfig: {},
    // 是否Loading
    isLoading: false
};
