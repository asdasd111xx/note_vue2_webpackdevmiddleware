import store from '@/store';

/* 取遊戲名稱 */
export default (data) => {
    // 後台設定頁面不顯示
    if (data.page_show !== 'Y') {
        return false;
    }
    // 後台設定頁面顯示時機
    if (data.show_status) {
        // 後台設定僅登入後顯示，當前未登入
        if (data.show_status === 'member' && !store.state.loginStatus) {
            return false;
        }
        // 後台設定僅登入前顯示，當前已登入
        if (data.show_status === 'guest' && store.state.loginStatus) {
            return false;
        }
    }

    // 頁面為 "加入會員", 但當前已登入
    if (data.linkTo === 'join' && store.state.loginStatus) {
        return false;
    }
    // 頁面為 "加入代理", 若後台未開放代理或者當前為無限層廳，不顯示
    if (data.page_key === 'joinAgent') {
        return store.state.memInfo.config.agent_register;
    }
    return true;
};
