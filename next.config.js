const withTM = require('next-transpile-modules');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const nextConfiguration = {
  webpack: (config) => {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config;
  },
  images: {
    disableStaticImages: true,
  },
  distDir: 'build',
  cleanDistDir: false,
  trailingSlash: true,
};


module.exports = withPlugins([[withTM], [withImages]], nextConfiguration);
