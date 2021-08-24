// Method 區分 Global 與 Local
// 億元在點擊"卡片管理"與"提現"，不論開關有無開啟，因提現密碼的原因，都需要檢查 withdrawCheck 的狀態來判斷是否導到帳戶資料
// Global Method 的情況不適用於上述，因此區分 Local
// By Chia

import axios from "axios";
import router from "@/router";
import store from "@/store";

// 以全域的狀態來判斷
export const lib_useGlobalWithdrawCheck = (redirect = "home") => {
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
      msg: "请先完成提现信息",
      cb
    });
    return;
  }
};

export const lib_useLocalWithdrawCheck = (redirect = "home", routerPush) => {
  const cb = () => {
    router.push(`/mobile/withdrawAccount?redirect=${redirect}`);
  };

  axios({
    method: "get",
    url: "/api/v2/c/withdraw/check"
  })
    .then(res => {
      const { ret, result, msg, code } = res.data;

      if (!res || result !== "ok") {
        store.dispatch("actionSetGlobalMessage", {
          msg,
          code
        });
        return;
      }

      let isAccountPassed = true;
      let isBankPassed = ret.bank;

      // Loop 帳戶欄位
      Object.keys(ret).forEach(item => {
        // 有帳戶欄位未填過
        if (!ret[item] && item !== "bank") {
          isAccountPassed = false;
        }
      });

      // 帳戶資料有通過
      if (isAccountPassed) {
        router.push(routerPush);
        return;
      }

      // 未綁帳戶但已綁卡
      if (!isAccountPassed && isBankPassed) {
        store.dispatch("actionSetGlobalMessage", {
          msg: "请先设定提现资料",
          cb
        });
        return;
      }

      // 未綁帳戶資料且未綁卡
      if (!isAccountPassed && !isBankPassed) {
        store.dispatch("actionSetGlobalMessage", {
          msg: "请先完成提现信息",
          cb
        });
        return;
      }
    })
    .catch(error => {
      const msg = error?.response?.data?.msg;
      const code = error?.response?.data?.code;
      store.dispatch("actionSetGlobalMessage", {
        msg,
        code
      });
    });
};
