import * as apiUrl from '../config/api';
import ajax from '../lib/ajax';

export default {
    // 優惠活動圖片 (外層封面圖.點開彈窗banner圖)
    image(args, imgId = '') {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_PROMOTION_IMG}/${imgId}`,
            errorAlert: false,
            ...args
        });
    },
    // 指定優惠活動取資料
    pop(args, id = '') {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_PROMOTION_POP}/${id}`,
            ...args
        });
    },
    // 所有優惠活動 (前台呈現)
    all(args) {
        return ajax({
            method: 'get',
            params: {
                first_result: 0,
                max_results: 100
            },
            url: apiUrl.API_PROMOTION_ALL,
            errorAlert: false,
            ...args
        });
    },
    // 會員-登入後-加入優惠
    join(args, id = '') {
        return ajax({
            method: 'put',
            url: `${apiUrl.API_PROMOTION_MEM}/${id}`,
            ...args
        });
    },
    // 會員中心-優惠申請
    member(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_PROMOTION_MEM,
            errorAlert: false,
            ...args
        });
    },
    // 取得第三方優惠活動連結
    url(params, args) {
        return ajax(
            {
                method: 'get',
                url: apiUrl.API_PROMOTION_URL,
                params,
                ...args
            }
        );
    }
};
