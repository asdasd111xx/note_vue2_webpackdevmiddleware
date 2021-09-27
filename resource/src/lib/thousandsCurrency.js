export const thousandsCurrency = data => {
  const formatter = function(val) {
    return val
      .toString()
      .replace(
        /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/,
        (all, pre, groupOf3Digital) =>
          pre + groupOf3Digital.replace(/\d{3}/g, ",$&")
      );
  };

  if (data && data.isArray && data.isArray()) {
    let result = data.forEach(i => {
      return formatter(data);
    });
    return result;
  } else {
    return formatter(data);
  }
};
