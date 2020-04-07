import { BehaviorSubject } from 'rxjs';
import ajax from '@/lib/ajax';
import * as api from '@/config/api';

const games = {
    props: {
        isFetching$: new BehaviorSubject(false), // 是否正在請求中
        page$: new BehaviorSubject(0), // 請求頁數
        maxResult$: new BehaviorSubject(36), // 一次請求的資料數
        gameList$: new BehaviorSubject([]) // 遊戲列表
    },
    /**
     * 傳入 observable 物件，取得控制物件的方法
     * @param {object} observables - observable 物件
     */
    getMethods(observables) {
        return {
            /**
             * 設定 setFisharea 物件變數值
             * @param {string} varName - 變數名稱
             * @param {*} value - 欲設定的值
             */
            setFisharea(varName, value) {
                observables[varName].next(value);
            },
            /**
             * 取得遊戲列表
             * @param {object} isBackEnd - API 參數設定值
             * @returns {object} Promise 物件
             */
            getGameList(isBackEnd) {
                if (isBackEnd) {
                    return new Promise((resolve) => resolve({
                        pagination: {
                            first_result: 0,
                            max_results: 36,
                            total: '16'
                        },
                        result: 'ok',
                        ret: [
                            {
                                kind: 3, type: 46, name: '捕鱼王', code: '40116', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'ag_casino'
                            },
                            {
                                kind: 3, type: 74, name: '美人捕鱼', code: '55105', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'fg'
                            },
                            {
                                kind: 3, type: 74, name: '欢乐捕鱼', code: '55108', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'fg'
                            },
                            {
                                kind: 3, type: 48, name: '财神捕鱼', code: '39064', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'jdb'
                            },
                            {
                                kind: 3, type: 74, name: '捕鱼嘉年华3D', code: '55110', enable: true, is_pc: true, is_mobile: false, trial: false, mobile_trial: false, vendor: 'fg'
                            },
                            {
                                kind: 3, type: 74, name: '天天捕鱼', code: '55109', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'fg'
                            },
                            {
                                kind: 3, type: 74, name: '捕鸟达人', code: '55107', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'fg'
                            },
                            {
                                kind: 3, type: 40, name: '深海大赢家', code: '20104', enable: true, is_pc: true, is_mobile: false, trial: false, mobile_trial: false, vendor: 'pt'
                            },
                            {
                                kind: 3, type: 48, name: '龙王捕鱼', code: '39047', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'jdb'
                            },
                            {
                                kind: 3, type: 48, name: '龙王捕鱼2', code: '39049', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'jdb'
                            },
                            {
                                kind: 3, type: 74, name: '雷霆战警', code: '55106', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'fg'
                            },
                            {
                                kind: 3, type: 5, name: '捕鱼达人', code: '30599', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'bbin'
                            },
                            {
                                kind: 3, type: 41, name: '寻宝捕鱼王', code: '28066', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'gns'
                            },
                            {
                                kind: 3, type: 5, name: '捕鱼大师', code: '38001', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'bbin'
                            },
                            {
                                kind: 3, type: 80, name: '千炮捕鱼(H5)', code: '41021', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'mw'
                            },
                            {
                                kind: 3, type: 78, name: '捕鱼天王', code: '44120', enable: true, is_pc: true, is_mobile: true, trial: false, mobile_trial: false, vendor: 'sg'
                            }
                        ]
                    }));
                }

                const settings = {
                    label: 5,
                    first_result: observables.page$.getValue() * observables.maxResult$.getValue(),
                    max_results: observables.maxResult$.getValue(),
                    enable: true
                };
                const urlParams = Object.keys(settings).map(((key) => `${key}=${settings[key]}`)).join('&');

                return ajax({ method: 'get', url: `${api.gameList}?${urlParams}` });
            }
        };
    }
};

export default games;
