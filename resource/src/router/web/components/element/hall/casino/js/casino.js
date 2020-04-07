import { BehaviorSubject } from 'rxjs';
import ajax from '@/lib/ajax';
import * as api from '@/config/api';

const subject = {
    props: {
        maxResult$: new BehaviorSubject(36), // 一次請求的資料數
        page$: new BehaviorSubject(0), // 請求頁數
        curVendor$: new BehaviorSubject(''), // 當前遊戲商
        curType$: new BehaviorSubject('hot'), // 當前選擇類型
        searchText$: new BehaviorSubject(''), // 搜尋文字
        typeList$: new BehaviorSubject({}), // 遊戲類型列表
        gameList$: new BehaviorSubject([]), // 遊戲列表
        activityList$: new BehaviorSubject({}), // 活動列表
        isFetching$: new BehaviorSubject(false), // 是否正在請求中
        isTopListShow$: new BehaviorSubject(false), // 上方列表頁是否呈現 (only mobile)
        isSearchShow$: new BehaviorSubject(false) // 是否呈現搜尋輸入框
    },
    /**
     * 傳入 observable 物件，取得控制物件的方法
     * @param {object} observables - observable 物件
     */
    getMethods(observables, vue) {
        return {
            /**
             * 設定 casino 物件變數值
             * @param {string} varName - 變數名稱
             * @param {*} value - 欲設定的值
             */
            setCasino(varName, value) {
                observables[varName].next(value);
            },
            /**
             * 取得遊戲分類列表
             * @param {object} params
             * @param {boolean} params.isLogin - 是否為登入狀態
             * @param {string} params.vendor - 遊戲服務提供商
             * @param {boolean} params.isBackEnd - 是否為後台
             */
            getGameType({ isLogin, vendor, isBackEnd }) {
                const typeList = observables.typeList$.getValue();

                if (typeList[vendor]) {
                    return typeList;
                }

                const defaultTypes = [
                    {
                        label: '',
                        name: vue.$t('S_ALL')
                    },
                    // 活動先註解不開放，後續開放只要搜 activity_open
                    // {
                    //     label: 'activity',
                    //     name: vue.$t('S_ACTIVITY')
                    // },
                    {
                        label: 'trial',
                        name: vue.$t('S_GAME_TRIAL')
                    },
                    {
                        label: 'new',
                        name: vue.$t('S_NEW_GAMES')
                    },
                    {
                        label: 'hot',
                        name: vue.$t('S_HOT')
                    }
                ];

                if (isBackEnd) {
                    const backEndTypeList = {
                        [vendor]: [
                            ...defaultTypes,
                            { label: 5, name: '捕鱼机' },
                            { label: 6, name: '老虎机' },
                            { label: 7, name: '累积彩池' },
                            { label: 8, name: '特色游戏' },
                            { label: 9, name: '大型机台' },
                            { label: 10, name: '刮刮乐' },
                            { label: 11, name: '桌上游戏' },
                            { label: 12, name: '视频扑克' },
                            { label: 14, name: '未分类' },
                            { label: 28, name: '电子彩票' },
                            { label: 'favorite', name: '最愛' }
                        ]
                    };
                    observables.typeList$.next(backEndTypeList);
                    return Promise.resolve(backEndTypeList);
                }

                const gameType = ajax({ method: 'get', url: `${api.gameType}?kind=3&vendor=${vendor}` });
                const trialGame = ajax({
                    method: 'get',
                    url: `${api.API_GET_VENDOR}/${vendor || 'bbin'}/game/list?kind=3&label=trial`
                });

                return Promise.all([
                    gameType,
                    trialGame
                ]).then((response) => {
                    // 檢查是否有試玩
                    const hasTrial = () => {
                        // 無試玩遊戲
                        if (!response[1].ret.length) {
                            return false;
                        }
                        // 登入無試玩
                        if (isLogin) {
                            return false;
                        }
                        // vendor 為全部或 bbin 時才有試玩
                        if (!['', 'bbin'].includes(vendor)) {
                            return false;
                        }
                        return true;
                    };

                    let result = [];

                    if (response[0].result === 'ok') {
                        result = [
                            ...defaultTypes,
                            ...response[0].ret
                        ];
                    }

                    // 若無試玩，移除試玩分類
                    if (!hasTrial()) {
                        result = result.filter((typeInfo) => typeInfo.label !== 'trial');
                    }

                    // 最愛統一放置於最後
                    if (isLogin) {
                        result.push({
                            label: 'favorite',
                            name: vue.$t('S_FAVORITE')
                        });
                    }

                    observables.typeList$.next({
                        ...typeList,
                        [vendor]: result
                    });

                    return {
                        ...typeList,
                        [vendor]: result
                    };
                });
            },
            /**
             * 取得遊戲列表
             * @param {object} params - API 參數設定值
             * @returns {object} Promise 物件
             */
            getGameList(params, isBackEnd) {
                if (isBackEnd) {
                    return new Promise((resolve) => resolve([
                        {
                            kind: 3, type: 6, name: 'Staronic', code: '5006', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '激爆水果盘', code: '5007', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '猴子爬树', code: '5008', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '金刚爬楼', code: '5009', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '外星争霸', code: '5012', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '传统', code: '5013', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '丛林', code: '5014', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: 'FIFA2010', code: '5015', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '史前丛林冒险', code: '5016', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '星际大战', code: '5017', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '齐天大圣', code: '5018', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '水果乐园', code: '5019', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '法海斗白蛇', code: '5025', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '2012 伦敦奥运', code: '5026', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '功夫龙', code: '5027', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '中秋月光派对', code: '5028', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 8, name: '王牌5PK', code: '5034', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 7, name: '加勒比扑克', code: '5035', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 7, name: '鱼虾蟹', code: '5039', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 8, name: '百搭二王', code: '5040', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 8, name: '7PK', code: '5041', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '钻石水果盘', code: '5043', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '明星97II', code: '5044', enable: true, sort: 100, is_pc: true, is_mobile: true, trial: true, vendor: 'bbin'
                        },
                        {
                            kind: 3, type: 6, name: '特务危机', code: '5048', enable: true, sort: 100, is_pc: true, is_mobile: false, trial: false, vendor: 'bbin'
                        }
                    ]));
                }
                const settings = {
                    kind: 3,
                    vendor: observables.curVendor$.getValue(),
                    label: observables.curType$.getValue(),
                    first_result: observables.page$.getValue() * observables.maxResult$.getValue(),
                    max_results: observables.maxResult$.getValue(),
                    enable: true,
                    name: encodeURI(observables.searchText$.getValue()),
                    ...params
                };
                const urlParams = Object.keys(settings).map(((key) => `${key}=${settings[key]}`)).join('&');

                return ajax({ method: 'get', url: `${api.gameList}?${urlParams}` });
            },
            /**
             * 取得活動列表
             * @param {object} params - API 參數設定值
             * @returns {object} Promise 物件
             */
            getActivityList(params, isBackEnd) {
                if (isBackEnd) {
                    return new Promise((resolve) => resolve({
                        events: [
                            {
                                vendor: 'rt',
                                is_secure: true,
                                status: 3,
                                url: null
                            },
                            {
                                vendor: 'sg',
                                is_secure: false,
                                status: 4,
                                url: 'http://yam.com'
                            }
                        ],
                        games: [
                            {
                                kind: 3,
                                type: 84,
                                name: '龍之諭',
                                code: '42001',
                                online_at: '2019-04-23T10:00:00+0800',
                                enable: true,
                                sort: '1',
                                is_pc: true,
                                is_mobile: true,
                                trial: false,
                                mobile_trial: false,
                                is_test_domain: true,
                                status: 3,
                                vendor: 'rt',
                                event_sort: '8'
                            },
                            {
                                kind: 3,
                                type: 84,
                                name: '功夫神話',
                                code: '42002',
                                online_at: '2019-04-23T10:00:00+0800',
                                enable: true,
                                sort: '2',
                                is_pc: true,
                                is_mobile: true,
                                trial: false,
                                mobile_trial: false,
                                is_test_domain: true,
                                status: 3,
                                vendor: 'rt',
                                event_sort: '8'
                            },
                            {
                                kind: 3,
                                type: 57,
                                name: '金雞',
                                code: '44033',
                                online_at: '2018-07-10T10:00:00+0800',
                                enable: true,
                                sort: '1',
                                is_pc: true,
                                is_mobile: true,
                                trial: false,
                                mobile_trial: false,
                                is_test_domain: true,
                                status: 4,
                                vendor: 'sg',
                                event_sort: '7'
                            },
                            {
                                kind: 3,
                                type: 57,
                                name: '猴爺到',
                                code: '44025',
                                online_at: '2018-07-10T10:00:00+0800',
                                enable: true,
                                sort: '2',
                                is_pc: true,
                                is_mobile: true,
                                trial: false,
                                mobile_trial: false,
                                is_test_domain: true,
                                status: 4,
                                vendor: 'sg',
                                event_sort: '7'
                            },
                            {
                                kind: 3,
                                type: 57,
                                name: '新霸天下',
                                code: '44020',
                                online_at: '2018-07-10T10:00:00+0800',
                                enable: true,
                                sort: '3',
                                is_pc: true,
                                is_mobile: true,
                                trial: false,
                                mobile_trial: false,
                                is_test_domain: true,
                                status: 4,
                                vendor: 'sg',
                                event_sort: '7'
                            },
                            {
                                kind: 3,
                                type: 57,
                                name: '海龍王',
                                code: '44022',
                                online_at: '2018-07-10T10:00:00+0800',
                                enable: true,
                                sort: '4',
                                is_pc: true,
                                is_mobile: true,
                                trial: false,
                                mobile_trial: false,
                                is_test_domain: true,
                                status: 4,
                                vendor: 'sg',
                                event_sort: '7'
                            }
                        ]
                    }));
                }

                const resultVendor = params.curVendor || 'all';

                const settings = {
                    games: 1,
                    enable: true,
                    first_result: observables.page$.getValue() * observables.maxResult$.getValue(),
                    max_results: observables.maxResult$.getValue()
                };
                const urlParams = Object.keys(settings).map(((key) => `${key}=${settings[key]}`)).join('&');
                const activityData = ajax({ method: 'get', url: `/api/v1/c/vendor/${resultVendor}/vendor_event?${urlParams}` });

                return Promise.all([activityData]).then((response) => {
                    if (response[0].result === 'ok') {
                        observables.activityList$.next({
                            ...response[0]
                        });
                    }

                    return {
                        ...response[0]
                    };
                });
            },
            /**
             * 展開/收合上方列表
             * @param {boolean} [isShow=!observables.isTopListShow$.getValue()] 是否呈現
             */
            toggleTopList(isShow = !observables.isTopListShow$.getValue()) {
                observables.isTopListShow$.next(isShow);
            },
            /**
             * 展開/收合搜尋輸入框
             * @param {boolean} [isShow=!observables.isSearchShow$.getValue()] 是否呈現
             */
            toggleSearch(isShow = !observables.isSearchShow$.getValue()) {
                observables.isSearchShow$.next(isShow);
            }
        };
    }
};

export default subject;
