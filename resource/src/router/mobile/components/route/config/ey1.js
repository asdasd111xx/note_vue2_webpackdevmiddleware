export default {
    normal: {
        homeEy1: () => import(/* webpackChunkName: 'homeEy1' */'../../tpl/ey1/components/home'),
        loginEy1: () => import(/* webpackChunkName: 'loginEy1' */'../../tpl/ey1/components/login'),
    },
    mcenter: {
        homeEy1: () => import(/* webpackChunkName: 'homeEy1' */'../../tpl/ey1/components/mcenter/components/home'),
    }
};
