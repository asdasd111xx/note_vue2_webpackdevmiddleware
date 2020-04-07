export default {
    path: 'card/:vendor',
    name: 'card',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
