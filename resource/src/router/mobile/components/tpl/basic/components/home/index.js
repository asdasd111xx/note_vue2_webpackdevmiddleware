export default {
    path: 'home',
    alias: '',
    name: 'mHome',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
