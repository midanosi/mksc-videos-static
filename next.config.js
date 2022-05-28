module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/index' },
      '/videos': { page: '/videos' },
      '/picktrack': { page: '/picktrack' }
    };
  }
};
