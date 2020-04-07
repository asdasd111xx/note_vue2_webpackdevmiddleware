import axios from 'axios';

export default ({ domain = '', result = () => { } }) => {
    axios
        .get(`/static/tpl/analytics/${domain}.html?v=${process.env.TIMESTAMP}`)
        .then((response) => {
            // 當無設置站長統計
            if (/^<!DOCTYPE/.test(response.data)) {
                result('');
                return;
            }
            result(response.data);
        })
        .catch(() => {
            result('');
        });
};
