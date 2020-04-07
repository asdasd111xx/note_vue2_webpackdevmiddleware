import ajax from '@/lib/ajax';
import * as api from '@/config/api';

/* 組開元棋牌資料 */
export default (isBackEnd, vendor, firstResult, label, name, callback) => {
    if (isBackEnd) {
        // 後台mock資料
        const response = {
            ret: [
                {
                    kind: 5,
                    type: 61,
                    name: '德州撲克',
                    code: 49620,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '二八槓',
                    code: 49720,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '炸金花',
                    code: 49220,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '21 點',
                    code: 49600,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '通比牛牛',
                    code: 49870,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '極速炸金花',
                    code: 49230,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '十三水',
                    code: 49630,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '幸運五張',
                    code: 49380,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '鬥地主',
                    code: 49610,
                    vendor: 'ky'
                },
                {
                    kind: 5,
                    type: 61,
                    name: '射龍門',
                    code: 49390,
                    vendor: 'ky'
                }
            ]
        };
        callback(response.ret);
        return;
    }

    // 前台API資料
    ajax({
        method: 'get',
        url: `${api.gameList}?kind=5&vendor=${vendor}&label=${label}&name=${name}&first_result=${firstResult}&max_results=1000&enable=true`,
        success: (response) => {
            callback(response.ret);
        }
    });
};
