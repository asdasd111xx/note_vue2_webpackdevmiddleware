export default {
    path: 'resetpwd',
    name: 'resetPwd',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
