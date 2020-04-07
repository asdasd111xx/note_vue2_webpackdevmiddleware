export default {
    path: '/game/:vendor/:kind/:code?',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
