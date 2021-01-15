import Router from "vue-router";
import Vue from "vue";
import agent from "./agent";
import domain from "./domain";
import error404 from "./404";
import error500 from "./500";
import game from "./game";
import isMobile from "@/lib/is_mobile";
import mobile from "./mobile";
import noService from "./no_service";
import popControl from "./popcontrol";
import timeout from "./timeout";
import upup from "./upup";

// prevent NavigationDuplicated error see: https://github.com/vuejs/vue-router/issues/2881
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

const mobileMainbody = () =>
  import(/* webpackChunkName: 'mainbody' */ "./mobile/components");
Vue.use(Router);
export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: mobileMainbody,
      beforeEnter: (to, from, next) => {
        // const isPc = document.cookie.indexOf("pc=1");

        // if (isPc !== -1) {
        //   next();
        //   return;
        // }

        if (to.query.page && to.query.page === "pwdreset") {
          next(`/mobile/resetPwd?kr=${to.query.kr}&type=${to.query.type}`);
          return;
        }

        next("/mobile");
        return;
      }
    },
    popControl,
    game,
    agent,
    mobile,
    domain,
    error500,
    noService,
    upup,
    timeout,
    error404
  ]
});
