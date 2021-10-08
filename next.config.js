/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const optimizedImages = require('next-optimized-images');

const plugins = [[withBundleAnalyzer, { enabled: true }], [optimizedImages]];

const nextConfig = {
  images: {
    domains: ['images.prismic.io'],
  },
  typescript: {
    ignoreDevErrors: true,
  },
};

module.exports = withPlugins(plugins, nextConfig);
