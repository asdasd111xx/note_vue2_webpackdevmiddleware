import normal from './js/normal';
import mcenter from './js/mcenter';
import agcenter from './js/agcenter';

export default {
    path: '/mobile',
    component: () => import(/* webpackChunkName: 'component' */'./components'),
    meta: {
        isMobile: true
    },
    children: [
        ...normal, // 一般頁面
        mcenter, // 會員中心
        agcenter // 代理中心
    ]
};
