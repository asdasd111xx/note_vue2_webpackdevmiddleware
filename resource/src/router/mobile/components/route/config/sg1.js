export default {
  normal: {
    homeSg1: () => import(/* webpackChunkName: 'homeSg1' */'../../tpl/sg1/components/home'),
  },
  mcenter: {
    homeSg1: () => import(/* webpackChunkName: 'homeSg1' */'../../tpl/sg1/components/mcenter/components/home'),
    walletSg1: () => import(/* webpackChunkName: 'walletSg1' */'../../tpl/sg1/components/mcenter/components/wallet'),
  }
};
