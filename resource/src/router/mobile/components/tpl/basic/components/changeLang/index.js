export default {
    path: 'changeLang',
    name: 'changeLang',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
