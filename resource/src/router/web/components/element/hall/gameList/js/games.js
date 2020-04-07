import { BehaviorSubject } from 'rxjs';
import ajax from '@/lib/ajax';
import * as api from '@/config/api';

const games = {
    props: {
        typeList$: new BehaviorSubject([]), // 平台商的遊戲分類
        gameList$: new BehaviorSubject([]), // 遊戲列表
        gameInfo$: new BehaviorSubject([]) // 遊戲列表
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
             * 取得遊戲平台分類
             * @param {string} kind - 遊戲項目代號
             * @param {string} vendor - 遊戲平台代號
             */
            getGameType({ kind, vendor }) {
                const typeList = observables.typeList$.getValue();

                if (typeList[vendor]) {
                    return;
                }

                const defaultTypes = [
                    {
                        value: '',
                        text: vue.$t('S_ALL')
                    },
                    {
                        value: 'trial',
                        text: vue.$t('S_GAME_TRIAL')
                    },
                    {
                        value: 'new',
                        text: vue.$t('S_NEW_GAMES')
                    },
                    {
                        value: 'hot',
                        text: vue.$t('S_HOT')
                    }
                ];

                const params = {
                    kind,
                    vendor
                };

                ajax({ method: 'get', url: api.API_GET_GAME_TYPE, params })
                    .then((response) => {
                        let result = [];

                        if (response.status === 'Y') {
                            result = [
                                ...defaultTypes,
                                ...response.data.map((item) => ({ value: `${item.label}`, text: item.name }))
                            ];
                        }

                        // 只有全部及 bbin 會顯示試玩 (行動裝置及登入後不顯示)
                        if (!['', 'bbin'].includes(vendor)) {
                            result = result.filter((typeInfo) => typeInfo.value !== 'trial');
                        }

                        // ky平台不顯示最新跟熱門
                        if (['ky'].includes(vendor)) {
                            result = result.filter((typeInfo) => typeInfo.value !== 'new' && typeInfo.value !== 'hot');
                        }

                        observables.typeList$.next({
                            ...typeList,
                            [vendor]: result
                        });
                    });
            },
            /**
             * 取得遊戲平台分類下的遊戲列表
             * @param {string} kind - 遊戲項目代號
             * @param {string} vendor - 遊戲平台代號
             * @param {string} type - 遊戲分類代號
             */
            getGameList({ kind, vendor, type }) {
                observables.gameList$.next([]);

                const params = {
                    kind,
                    vendor,
                    label: type,
                    max_results: 1000
                };

                ajax({ method: 'get', url: api.API_GET_GAME_LIST, params })
                    .then((response) => {
                        if (response.status === 'Y') {
                            observables.gameList$.next(response.data);
                        }
                    });
            },
            /**
             * 取得遊戲平台分類下的遊戲列表
             * @param {object} gameData - 遊戲提供廠商代號及名稱對照表
             * @param {array} gameList - 遊戲詳細資料
             */
            getGameInfo(isBackEnd, gameList) {
                // 當無遊戲列表，則不取得遊戲資料
                if (gameList.length === 0) {
                    observables.gameInfo$.next([]);
                    return;
                }

                const params = {
                    game_vendors: [],
                    game_kinds: [],
                    game_codes: [],
                    enable: true,
                    max_results: 1000
                };

                gameList.forEach((game) => {
                    params.game_kinds.push(game.kind);
                    params.game_vendors.push(game.vendor);
                    params.game_codes.push(game.gameType);
                });

                const url = (isBackEnd) ? api.API_GET_GAME_INFO : api.API_GET_GAMES;
                const obj = { method: 'post', url };
                if (isBackEnd) {
                    obj.data = params;
                } else {
                    obj.params = params;
                }

                ajax(obj)
                    .then((response) => {
                        if (isBackEnd && response.status === 'Y') {
                            observables.gameInfo$.next(response.data);
                            return;
                        }

                        if (response.result === 'ok') {
                            observables.gameInfo$.next(response.ret);
                        }
                    });
            }
        };
    }
};

export default games;
