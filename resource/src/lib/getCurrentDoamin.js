import axios from 'axios';

export const getDoamin = () => {

    return axios({
        method: 'get',
        // url: '/api/v1/c/domain-config',
        url: '/conf/domain',
    }).then(res => {
        let result = {
            domain: '',
            site: 'porn1'
        }
        // to do nginx 配置
        const site = res && res.data && String(res.data.site) || '';
        const domain = res && res.data && String(res.data.domain) || '';
        result['site'] = site;
        result['domain'] = domain;
        return result;
    }).catch((res) => {
        console.log(res)
        return {
            domain: '',
            site: 'porn1'
        }
    })
};
