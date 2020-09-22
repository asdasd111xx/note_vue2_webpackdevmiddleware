import { getCookie, setCookie } from '@/lib/cookie';

import axios from 'axios';

export default ({
    method = 'get',
    moudle = '',
    params = {},
    timeout = 5000,
    reqHeaders = {},
    url = "",
    fail = () => { },
}) => {
    const bbosHeader = {
        "Useragent": navigator.userAgent,
        "Ekey": "sobb",
        'Content-Type': 'application/json',
    }

    if (reqHeaders && reqHeaders.cid) {
        bbosHeader['Cid'] = reqHeaders.cid;
    } else if (getCookie('cid')) {
        bbosHeader['Cid'] = getCookie('cid');
    }

    const bbosParams = {
        "lang": "zh-cn"
    }

    const obj = {
        method,
        url,
        timeout,
        headers: {
            ...bbosHeader,
            ...reqHeaders,
        },
        params: {
        },
        data: {
        }
    };

    // 不需要formdata params
    if (method === 'post' || method === 'put' || method === 'delete') {
        obj.data = { ...bbosParams, ...params };
    }
    else {
        obj.params = { ...bbosParams, ...params };
    }

    return axios(obj).then((response) => {
        if (process.env.NODE_ENV === "development") {
            console.log("[bbos request]")
            console.log(url, response.data)
        }
        const responseData = response && response.data;

        if (responseData) {
            if (responseData.status === "000") {
                return responseData;
            }

            if (responseData.code === "M00001" || responseData.code === "C600001") {
                if (getCookie('cid')) {
                    alert(`${response.data.msg}`);
                }

                setCookie('cid', '');
                setCookie('y_token', '');
                setCookie('aid', '');

                window.location.reload(true);
                window.location.href = '/mobile/login';
                return;
            }

            // fail
            fail(responseData);
            return responseData;
        }
    })
        .catch((error) => {
            console.log(error);
            return error;
        });
};
