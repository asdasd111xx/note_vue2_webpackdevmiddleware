export default {
    path: 'joinagent',
    name: 'joinAgent',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
