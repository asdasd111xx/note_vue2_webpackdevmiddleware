export default {
    path: 'casino/:vendor?',
    name: 'casino',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
