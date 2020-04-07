import { BehaviorSubject } from 'rxjs';
import ajax from '@/lib/ajax';
import * as api from '@/config/api';

const subject = {
    props: {
        isFetching$: new BehaviorSubject(''), // 是否正在取得資料，值為正在取資料的項目名稱
        curTab$: new BehaviorSubject('recent'), // 當前選擇頁籤,
        curVendor$: new BehaviorSubject(''), // 當前選擇遊戲商
        recentList$: new BehaviorSubject([]), // 最近玩過列表
        hotGame$: new BehaviorSubject([]), // 熱門遊戲列表
        searchText$: new BehaviorSubject('') // 搜尋文字
    },
    /**
     * 傳入 observable 物件，取得控制物件的方法
     * @param {object} observables - observable 物件
     */
    getMethods(observables) {
        return {
            /**
             * 設定 collection 物件變數值
             * @param {string} varName - 變數名稱
             * @param {*} value - 欲設定的值
             */
            setCollection(varName, value) {
                observables[varName].next(value);
            },
            getRecentList() {
                return ajax({
                    method: 'get',
                    url: `${api.API_GET_RECENT_GAME}`
                }).then((response) => {
                    observables.recentList$.next(response.ret);
                });
            },
            getHotGame(value) {
                return ajax({
                    method: 'get',
                    url: `${api.API_GET_CUSTOMIZED_HOT_GAME}?max_results=${value}`
                }).then((response) => {
                    observables.hotGame$.next(response.ret);
                });
            }
        };
    }
};

export default subject;
