import axios from 'axios';
import { getCookie } from '@/lib/cookie';

export default ({
    method = 'get',
    params = {},
    urlParams = null,
    timeout = 30000,
    headers = {},
    url = "",
    fail = () => { },
}) => {
    // YABO_API_DOMAIN: 'https://yaboapi.bbin-asia.com/api',
    // YABO_API_DOMAIN: 'https://yaboapi.canarycherrytart.com/api',

    const yaboParams = {
        // "lang": "zh-cn"
    }
    if (urlParams) {
        let query = "";
        for (let [key, value] of Object.entries(urlParams)) {
            query += `&${key}=${value}`
        }
        url = url + "?" + query;
    }

    let _headers = {
        ...headers,
        'cid': getCookie('cid'),
        'x-domain': getCookie('y-x-domain'),
        'username': getCookie('y-username'),
    };

    if (!url.includes('GetAuthorizationToken')) {
        _headers['AuthToken'] = getCookie('y_token');
    }

    const obj = {
        method,
        url,
        timeout,
        headers: {
            ..._headers,
            ...headers,
        },
        params: {
        },
        data: {
        }
    };

    // 不需要formdata params
    if (method === 'post' || method === 'put' || method === 'delete') {
        obj.data = { ...yaboParams, ...params };
    }
    else {
        obj.params = { ...yaboParams, ...params };
    }

    return axios(obj).then((response) => {
        return response.data;
    })
        .catch((error) => {
            console.log(error);
            return error;
        });
};
