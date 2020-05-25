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

    //  Create `axios-cache-adapter` instance
    const cache = setupCache({
        maxAge: 30 * 60 * 1000
    })

    //  Create `axios` instance passing the newly created `cache.adapter`
    const api2 = axios.create({
        adapter: cache.adapter
    })

    const api = setup({
        ...obj,
        baseURL: PORN_DOMAIN,
        adapter: cache.adapter
    })

    return api(obj).then(async (res) => {
        if (process.env.NODE_ENV === "development") {
            // console.log("[PORN request]");
            // console.log(res.data);
            // const length = await cache.store;
            // console.log('Cache store :', length);
        }

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

    // 未完成
    const _method = method.toLocaleLowerCase();
    switch (_method) {
        case "post":
            return api.post(url).then((res) => {
                console.log(res.request)
                if (process.env.NODE_ENV === "development") {
                    console.log("[PORN request]")
                    console.log(res.data)
                }

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
    }

};
