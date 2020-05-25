import { setup, setupCache } from 'axios-cache-adapter'

import { PORN_DOMAIN } from '@/api/config';
import axios from 'axios';
import querystring from 'querystring'

export default ({
    method = 'get',
    params = {},
    data = {},
    timeout = 30000,
    reqHeaders = {},
    url = "",
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
            ...reqHeaders
        },
        params: {
            ...params
        },
        data: querystring.stringify(data)
    };

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
