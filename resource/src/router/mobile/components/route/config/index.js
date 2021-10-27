import merge from "lodash/merge";
import tplAobo1 from "./aobo1";
import tplEy1 from "./ey1";
import tplPorn1 from "./porn1";
import tplSg1 from "./sg1";
import tplSp1 from "./sp1";

export default merge(
  {
    root: {
      rootPorn1: () =>
        import(/* webpackChunkName: 'rootPorn1' */ "../../tpl/porn1/"),
      rootEy1: () => import(/* webpackChunkName: 'rootEy1' */ "../../tpl/ey1/"),
      rootSg1: () => import(/* webpackChunkName: 'rootSg1' */ "../../tpl/sg1/"),

      // 仿币发BIFA
      rootAobo1: () =>
        import(/* webpackChunkName: 'rootSg1' */ "../../tpl/aobo1/"),
      rootSp1: () => import(/* webpackChunkName: 'rootSp1' */ "../../tpl/sp1/")
    }
  },
  tplPorn1, // 币发BIFA
  tplEy1,
  tplSg1,
  tplAobo1,
  tplSp1
);
