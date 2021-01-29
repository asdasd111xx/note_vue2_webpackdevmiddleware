import axios from "axios";

export const getDoamin = () => {
  return axios({
    method: "get",
    url: "/conf/domain"
  })
    .then(res => {
      let result = {
        domain: "",
        site: "porn1"
      };
      const site = (res && res.data && String(res.data.site)) || "";
      const domain = (res && res.data && String(res.data.domain)) || "";
      result["site"] = site;
      result["domain"] = domain;
      return result;
    })
    .catch(res => {
      console.log(res);
      return {
        domain: "",
        site: ""
      };
    });
};
