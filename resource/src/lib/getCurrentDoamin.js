import axios from 'axios';

export const getDoamin = () => {

    return axios({
        method: 'get',
        // url: '/api/v1/c/domain-config',
        url: '/conf/domain',
    }).then(res => {
        let result = {
            domain: '',
            site: ''
        }
        // to do nginx 配置
        const site = res && res.data && String(res.data.site) || '';
        const domain = res && res.data && String(res.data.domain) || '';
        result['site'] = site;
        result['domain'] = domain;
        return result;

        // if (res && res.data && res.data.ret && res.data.ret.domain) {
        //     result['domain'] = domain;
        //     switch (domain) {
        //         case '500015':
        //         case '67':
        //         case '69':
        //         default:
        //             result['site'] = 'porn1';
        //             break;
        //         case '500023':
        //         case '41':
        //         case '74':
        //             result['site'] = 'ey1';
        //             break;
        //     }
        // }
        // return result
    }).catch((res) => {
        console.log(res)
        return {
            domain: '',
            site: 'porn1'
        }
    })
};
