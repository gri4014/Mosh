module.exports = function override(config, env) {
  return {
    ...config,
    devServer: {
      ...config.devServer,
      allowedHosts: 'all',
    },
  };
};
