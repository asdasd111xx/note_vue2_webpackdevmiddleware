/* eslint-disable no-param-reassign, func-names */
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';


export default {
    install(Vue) {
        /**
         * 取字典檔文字
         * @method getText
         * @param {string} key 字典檔 key 值
         * @param {string|object} options 為字串時表示未取到字典檔的預設文字
         * @param {string} options.text 未取到字典檔的預設文字
         * @param {string} options.locale 指定字典要呈現的語系
         * @param {string|array} options.replace 取代文字，為字串時預設取代 %s 字串
         * @example
         * $text('S_SETTINGS', {
         *     replace: [
         *         { target: '%s', value: 'test' }
         *         { target: '%s', value: 'test2' }
         *         { target: '%s', value: 'test3' }
         *     ]
         * })
         * @returns {string} 字典檔文字
         */
        const getText = function (key, options = {
            text: '',
            locale: undefined,
            replace: undefined
        }) {
            let resultText = this.$t(key, options.locale);
            const defaultText = isString(options) ? options : options.text;

            if (resultText === key && defaultText) {
                resultText = defaultText;
            }

            if (isString(options.replace)) {
                resultText = resultText.replace('%s', options.replace);
            }

            if (isArray(options.replace)) {
                resultText = options.replace
                    .reduce((init, rp) => init
                        .replace(rp.target, rp.value),
                    resultText);
            }

            return resultText;
        };

        Vue.mixin({
            beforeCreate() {
                getText.bind(this);
            }
        });

        Vue.prototype.$text = getText;
    }
};
