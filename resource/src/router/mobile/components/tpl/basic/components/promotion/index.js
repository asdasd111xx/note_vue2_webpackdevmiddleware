export default {
    path: 'promotion',
    name: 'promotion',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
