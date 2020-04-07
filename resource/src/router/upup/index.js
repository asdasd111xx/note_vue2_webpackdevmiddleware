export default {
    path: '/upup/:mode?',
    name: 'upup',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
