import Vue from 'vue';
import Router from 'vue-router';
import isMobile from '@/lib/is_mobile';
import popControl from './popcontrol';
import game from './game';
import agent from './agent';
import mobile from './mobile';
import simple from './simple';
import domain from './domain';
import error500 from './500';
import noService from './no_service';
import upup from './upup';
import timeout from './timeout';
import error404 from './404';

// prevent NavigationDuplicated error see: https://github.com/vuejs/vue-router/issues/2881
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch((err) => err);
};

const mainbody = () => import(/* webpackChunkName: 'mainbody' */'./web/components');

Vue.use(Router);
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: mainbody,
            beforeEnter: (to, from, next) => {
                const isPc = document.cookie.indexOf('pc=1');

                if (isPc !== -1) {
                    next();
                    return;
                }

                if (isMobile()) {
                    if (to.query.page && to.query.page === 'pwdreset') {
                        next(`/mobile/resetPwd?kr=${to.query.kr}&type=${to.query.type}`);
                        return;
                    }

                    next('/mobile');
                    return;
                }
                next();
            }
        },
        {
            path: '/page/:pid/:subId?',
            name: 'page',
            component: mainbody,
            alias: '/preview/page/:pid/:subId?',
            beforeEnter: (to, from, next) => {
                const isPc = document.cookie.indexOf('pc=1');

                if (isPc !== -1) {
                    next();
                    return;
                }

                if (isMobile()) {
                    if (to.query.page && to.query.page === 'pwdreset') {
                        next(`/mobile/resetPwd?kr=${to.query.kr}&type=${to.query.type}`);
                        return;
                    }

                    next('/mobile');
                    return;
                }
                next();
            }
        },
        {
            path: '/preview',
            name: 'preview',
            component: mainbody
        },
        {
            path: '/webview/:pid',
            name: 'webview',
            component: mainbody
        },
        {
            path: '/a/:agentId',
            component: mainbody,
            beforeEnter: (to, from, next) => {
                const isPc = document.cookie.indexOf('pc=1');

                if (isPc !== -1) {
                    next();
                    return;
                }

                if (isMobile()) {
                    Vue.cookie.set('a', to.params.agentId);

                    if (to.query.page && to.query.page === 'pwdreset') {
                        next(`/mobile/resetPwd?kr=${to.query.kr}&type=${to.query.type}`);
                        return;
                    }

                    if (to.params) {
                        next('/mobile/joinmember');
                        return;
                    }

                    next('/mobile');
                    return;
                }
                next();
            }
        },
        popControl,
        game,
        agent,
        mobile,
        simple,
        domain,
        error500,
        noService,
        upup,
        timeout,
        error404
    ]
});
