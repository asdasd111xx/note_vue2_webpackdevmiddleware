/* eslint-disable no-param-reassign */
import store from '@/store';

/**
 * 圖片相關處理
 *   - 設置圖片cdn網址與版本號
 */
export default {
    install(Vue) {
        Vue.prototype.$getCdnPath = (path) => {
            const rootUrl = process.env.NODE_ENV === 'development' ? '' : store.state.cdnRoot;
            return `${rootUrl}${path}?v=${process.env.TIMESTAMP}`;
        };
    }
};
