const timestamp = Date.parse(new Date())
  .toString()
  .substr(2, 8);

module.exports = {
  NODE_ENV: '"production"',
  TIMESTAMP: JSON.stringify(`${timestamp}.1`)
};
