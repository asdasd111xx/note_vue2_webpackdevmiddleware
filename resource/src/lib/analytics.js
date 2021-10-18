import axios from "axios";

export default ({ domain = "", site = "", result = () => {} }) => {
  axios
    .get(`/static/tpl/analytics/index.html?v=${process.env.TIMESTAMP}`)
    .then(response => {
      // 當無設置站長統計
      if (/^<!DOCTYPE/.test(response.data)) {
        result("");
        return;
      }
      result(response.data);
    })
    .catch(() => {
      result("");
    });
};
