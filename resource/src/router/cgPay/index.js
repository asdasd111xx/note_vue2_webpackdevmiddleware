export default {
    path: '/cgPay',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
