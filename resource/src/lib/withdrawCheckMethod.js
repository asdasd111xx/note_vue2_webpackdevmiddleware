import store from "@/store";
import router from "@/router";

export const lib_withdrawCheckMethod = (redirect = "home") => {
  const cb = () => {
    router.push(`/mobile/withdrawAccount?redirect=${redirect}`);
  };

  // 未綁帳戶但已綁卡
  if (
    !store.state.withdrawCheckStatus.account &&
    store.state.withdrawCheckStatus.bank
  ) {
    store.dispatch("actionSetGlobalMessage", {
      msg: "请先设定提现资料",
      cb
    });
    return;
  }

  // 未綁帳戶資料 且 未綁卡
  if (
    !store.state.withdrawCheckStatus.account &&
    !store.state.withdrawCheckStatus.bank
  ) {
    store.dispatch("actionSetGlobalMessage", {
      msg: "请先设定提现信息",
      cb
    });
    return;
  }
};
