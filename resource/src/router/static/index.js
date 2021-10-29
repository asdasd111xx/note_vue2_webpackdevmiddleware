export default {
  path: "/custom/service",
  component: resolve => {
    require.ensure(["./service/components"], () => {
      resolve(require("./service/components"));
    });
  }
};
