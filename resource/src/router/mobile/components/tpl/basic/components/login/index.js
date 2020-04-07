export default {
    path: 'login',
    name: 'login',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
