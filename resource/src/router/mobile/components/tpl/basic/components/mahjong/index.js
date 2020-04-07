export default {
    path: 'mahjong/:vendor',
    name: 'mahjong',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
