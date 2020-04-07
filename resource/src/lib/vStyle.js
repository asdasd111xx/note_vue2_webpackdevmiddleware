/**
 * style 組件
 *   - 設置圖片cdn網址與版本號
 */
export default {
    install(Vue) {
        Vue.component('vStyle', {
            functional: true,
            props: {
                styleData: {
                    type: Object,
                    default: () => {}
                }
            },
            render: (createElement, context) => {
                let infoData = '';
                const { styleData } = context.props;

                if (styleData && Object.keys(styleData).length > 0) {
                    styleData.common.forEach((styleInfo) => {
                        infoData = `
                            ${infoData}
                            ${styleInfo.className} {
                                background-image: url('${Vue.prototype.$getCdnPath(styleInfo.path)}');
                            }
                        `;
                    });

                    // css media設定
                    if (styleData.media && styleData.media.length > 0) {
                        styleData.media.forEach((mediaInfo) => {
                            let mediaStyle = '';

                            mediaInfo.common.forEach((styleInfo) => {
                                mediaStyle = `
                                    ${mediaStyle}
                                    ${styleInfo.className} {
                                        background-image: url('${Vue.prototype.$getCdnPath(styleInfo.path)}');
                                    }
                                `;
                            });

                            infoData = `
                                ${infoData}
                                @media screen and (${mediaInfo.rule}) {
                                    ${mediaStyle}
                                }
                            `;
                        });
                    }
                }

                // 直接塞入slot值
                if (Object.keys(context.slots()).length > 0) {
                    infoData = `${infoData}${context.slots().default[0].text}`;
                }

                return createElement('style', infoData);
            }
        });
    }
};
