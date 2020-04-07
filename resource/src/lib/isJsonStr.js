/* 判斷是否為 JSON 格式的字串 */
import _ from 'lodash';

export default (str) => {
    try {
        const result = JSON.parse(str);
        return _.isObjectLike(result);
    } catch (error) {
        return false;
    }
};
