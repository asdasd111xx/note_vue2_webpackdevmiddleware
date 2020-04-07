export default {
    path: 'forgetpwd/:type',
    name: 'forgetPwd',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
