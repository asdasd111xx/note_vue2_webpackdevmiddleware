export default {
    path: 'aglogin',
    name: 'agLogin',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
