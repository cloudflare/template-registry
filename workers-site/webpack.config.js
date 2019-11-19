module.exports = {
  entry: 'index.ts',
  mode: 'development',
  output: {
    pathinfo: false,
  },
  devtool: 'none',
  optimization: {
    // We no not want to minimize our code.
    minimize: true,
    removeEmptyChunks: true,
    removeAvailableModules: true,
    mergeDuplicateChunks: true,
  },
}
