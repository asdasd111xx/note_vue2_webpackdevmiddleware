export default {
    path: '/simple/:pid',
    name: 'simple',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
