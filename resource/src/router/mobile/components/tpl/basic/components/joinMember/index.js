export default {
    path: 'joinmember',
    name: 'joinMember',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
