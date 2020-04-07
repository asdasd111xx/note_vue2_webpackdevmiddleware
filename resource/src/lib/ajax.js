import axios from 'axios';
import querystring from 'querystring';

export default ({
    method = '', url = '', params = {}, success = () => {}, fail = () => {}, headers = () => {}, timeout = 30000, errorAlert = true, cache = false
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
            if (error.response) {
                fail(error.response);
            } else {
                fail(error.toString());
            }
        });
};
