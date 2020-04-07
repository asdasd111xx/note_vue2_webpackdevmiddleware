export default {
    path: '/domain',
    name: 'domain',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
