export default {
  path: "/static/service",
  component: resolve => {
    require.ensure(["./service/components"], () => {
      resolve(require("./service/components"));
    });
  }
};
