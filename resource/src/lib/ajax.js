import { getCookie, setCookie } from '@/lib/cookie';

import axios from 'axios';
import querystring from 'querystring';

export default ({
    method = '', url = '', params = {}, success = () => { }, fail = () => { }, headers = () => { }, timeout = 30000, errorAlert = true, cache = false
}) => {
    const obj = {
        method,
        url,
        timeout,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    if (method === 'post' || method === 'put' || method === 'delete') {
        obj.data = querystring.stringify(params);
    } else {
        obj.params = params;
    }

    // 強制更新
    if (!cache) {
        obj.headers['If-Modified-Since'] = '0';
    }

    return axios(obj).then((response) => {
        if (response.data.result === 'ok') {
            success(response.data);
            headers(response.headers);
        }
        if (response.data.result === 'error') {
            if (response.data.msg && errorAlert) {
                alert(`${response.data.msg} ${response.data.code ? `(${response.data.code})` : ''}`);
            }

            fail(response);
        }
        return response.data;
    })
        .catch((error) => {
            if (error.response && error.response.data.msg && errorAlert) {
                alert(`${error.response.data.msg} ${error.response.data.code ? `(${error.response.data.code})` : ''}`);
            }

            // 收到重新登入需要導向登入頁面
            if (error && error.response && error.response.data && error.response.data.code === "M00001") {
                if (getCookie('cid') && !errorAlert) {
                    alert(`${error.response.data.msg} ${error.response.data.code ? `(${error.response.data.code})` : ''}`);
                }
                setCookie('cid', '');
                setCookie('aid', '');
                window.location.reload();
                window.location.href = '/mobile/login';
            }

            if (error.response) {
                fail(error.response);
            } else {
                fail(error.toString());
            }
        });
};
