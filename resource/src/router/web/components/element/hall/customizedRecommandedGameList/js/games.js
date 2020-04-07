import { BehaviorSubject } from 'rxjs';
import * as api from '@/config/api';
import ajax from '@/lib/ajax';

const games = {
    props: {
        page$: new BehaviorSubject(0), // 請求頁數
        gameList$: new BehaviorSubject([]), // 遊戲列表
        maxResult$: new BehaviorSubject(36), // 一次請求的資料數
        isFetching$: new BehaviorSubject(false) // 是否正在請求中
    },
    /**
     * 傳入 observable 物件，取得控制物件的方法
     * @param {object} observables - observable 物件
     */
    getMethods(observables) {
        return {
            /**
             * 設定 props 物件變數值
             * @param {string} varName - 變數名稱
             * @param {*} value - 欲設定的值
             */
            setProps(varName, value) {
                observables[varName].next(value);
            },
            /**
             * 取得所有廳主推薦遊戲列表
             */
            getGameList() {
                const params = {
                    vendor: 'all',
                    first_result: observables.page$.getValue() * observables.maxResult$.getValue(),
                    max_results: observables.maxResult$.getValue()
                };

                return ajax({
                    method: 'get',
                    url: api.API_GET_CUSTOMIZED_HOT_GAME,
                    params
                });
            }
        };
    }
};

export default games;
