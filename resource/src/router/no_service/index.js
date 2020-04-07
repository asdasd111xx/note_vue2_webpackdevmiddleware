export default {
    path: '/no_service/:mode?',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
