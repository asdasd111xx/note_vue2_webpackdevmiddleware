import * as apiUrl from '../config/api';

import ajax from '../lib/ajax';

export default {
    // 遊戲開關
    gameSwitch(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_GAME_SWITCH,
            errorAlert: false,
            ...args
        });
    },
    // 遊戲列表
    gameList(args, vendor, params = {}) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_GET_VENDOR}/${vendor}/game/list`,
            errorAlert: false,
            params,
            ...args
        });
    },
    // window open 連結
    gameLink(args, vendor) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_GET_VENDOR}/${vendor}/game/launch`,
            redirect: false,
            ...args
        });
    },
    // 電子類別
    casinoType(args, vendor) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_GET_VENDOR}/${vendor}/game/types`,
            errorAlert: false,
            ...args
        });
    },
    // 試玩遊戲列表
    trialGame(args, vendor) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_GET_VENDOR}/${vendor}/game/trial`,
            errorAlert: false,
            ...args
        });
    },
    // 依指定遊戲回傳有開放的遊戲列表
    gameListByAssign(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_GET_GAMES,
            errorAlert: false,
            ...args
        });
    },
    // 最近開過的遊戲列表
    recentGame(args) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_GET_RECENT_GAME}`,
            errorAlert: false,
            ...args
        });
    },
    // 取有加入最愛的遊戲列表
    favoriteGame(args) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_FAVORITE_GAME}`,
            errorAlert: false,
            ...args
        });
    },
    // 遊戲加入最愛
    setFavoriteGame(args) {
        return ajax({
            method: 'post',
            url: `${apiUrl.API_FAVORITE_GAME}`,
            errorAlert: false,
            ...args
        });
    },
    // 遊戲加入最愛
    deleteFavoriteGame(args) {
        return ajax({
            method: 'delete',
            url: `${apiUrl.API_FAVORITE_GAME}`,
            errorAlert: false,
            ...args
        });
    },
    // 取得熱門遊戲模塊清單
    getCustomizedHotGames(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_GET_CUSTOMIZED_HOT_GAME,
            errorAlert: false,
            ...args
        });
    }
};
