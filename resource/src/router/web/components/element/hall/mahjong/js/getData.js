import ajax from '@/lib/ajax';
import * as api from '@/config/api';

/* 組開元棋牌資料 */
export default (isBackEnd, vendor, firstResult, callback) => {
    if (isBackEnd) {
        // 後台mock資料
        const response = {
            ret: [
                {
                    kind: 6,
                    type: 144,
                    name: '四川麻将-血战到底',
                    code: 89001,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '四川麻将-血流成河',
                    code: 89002,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '大众麻将',
                    code: 89003,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '广东麻将',
                    code: 89004,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '湖南转转麻将',
                    code: 89005,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '杭州麻将',
                    code: 89006,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '卡五星麻将',
                    code: 89007,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '贵阳捉鸡麻将',
                    code: 89008,
                    vendor: 'xbb_mj'
                },
                {
                    kind: 6,
                    type: 144,
                    name: '二人麻将',
                    code: 89009,
                    vendor: 'xbb_mj'
                }
            ]
        };
        callback(response.ret);
        return;
    }

    // 前台API資料
    ajax({
        method: 'get',
        url: `${api.gameList}?kind=6&vendor=${vendor}&first_result=${firstResult}&max_results=36&enable=true`,
        success: (response) => {
            callback(response.ret);
        }
    });
};
