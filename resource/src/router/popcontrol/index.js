export default {
    path: '/popcontrol/:type/:datas/:event_id?',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    }
};
