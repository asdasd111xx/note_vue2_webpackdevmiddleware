import { PORN_DOMAIN, S_PORN_DOMAIN } from '@/api/config';
import { setup, setupCache } from 'axios-cache-adapter'

import axios from 'axios';
import querystring from 'querystring'
import store from '@/store';

export default ({
    method = 'get',
    params = {},
    data = {},
    timeout = 30000,
    reqHeaders = {},
    url = "",
    smallPig = false,
    fail = () => { },
}) => {
    const pornHeader = {
        "Bundleid": 'chungyo.foxyporn.prod.enterprise.web',
        "Version": 1,
    }

    const obj = {
        method,
        url: PORN_DOMAIN + url,
        timeout,
        headers: {
            ...pornHeader,
            ...reqHeaders,
            origin: location.host
        },
        params: {
            ...params
        },
        data: querystring.stringify(data)
    };

    if (smallPig) {
        // obj['withCredentials'] = true;
        const domain = store &&
            store.state &&
            store.state.memInfo &&
            store.state.memInfo.user &&
            store.state.memInfo.user.domain;

        if (domain === '500015') {
            obj['url'] = S_PORN_DOMAIN + url;
        }
    }

    let api = window.PermissionRequest;

    if (!api) {
        //  Create `axios-cache-adapter` instance
        const cache = setupCache({
            maxAge: 30 * 60 * 1000,
            // debug: true,
            exclude: {
                query: false
            }
        })

        // window.PermissionRequest = setup({
        //     ...obj,
        //     baseURL: PORN_DOMAIN,
        //     cache: {
        //         maxAge: 15 * 60 * 1000
        //     }
        // })

        //  Create `axios` instance passing the newly created `cache.adapter`
        window.PermissionRequest = axios.create({
            adapter: cache.adapter
        })
        api = window.PermissionRequest;
    }

    return api(obj).then((res) => {
        if (res && res.data) {
            return res.data;
        } else {
            fail(res.data);
        }
        return res.data;
    })
        .catch((error) => {
            console.log("[PORN request error]")
            console.log(error);
            return error;
        });
};
