import axios from 'axios';

export const getDoamin = () => {
    return axios({
        method: 'get',
        url: '/api/v1/c/domain-config',
    }).then(res => {
        let result = {
            domain: '',
            site: ''
        }
        if (res && res.data && res.data.ret && res.data.ret.domain) {
            let domain = String(res.data.ret.domain);
            result['domain'] = domain;
            switch (domain) {
                case '500015':
                case '67':
                case '69':
                default:
                    result['site'] = 'porn1';
                    break;
                case '500023':
                case '41':
                    result['site'] = 'ey1';
                    break;
            }
        }
        return result
    }).catch(e => {
        return {
            domain: '',
            site: ''
        }
    })
};
