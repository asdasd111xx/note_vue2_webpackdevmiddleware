/* global TencentCaptcha */
export default (successFuc, closeFuc, isSuccessClose = true) => {
    const captcha = new TencentCaptcha('2028894711', (res) => {
        if (res.ret === 0) {
            const { appid, randstr, ticket } = res;
            const data = { appid, randstr, ticket };
            successFuc({ data });
        }

        captcha.destroy();

        if (res.ret === 0 && !isSuccessClose) {
            return;
        }

        if (closeFuc) {
            closeFuc();
        }
    });

    captcha.show();
};
