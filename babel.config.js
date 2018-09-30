const presets = [
  ["@babel/env", {
    targets: {
      node: "current",
    },
    useBuiltIns: "usage"
  }],
  "@babel/react",
]

const plugins = [
  "@babel/plugin-proposal-class-properties",
]

module.exports = {
  presets,
  plugins,
  sourceMaps: true,
  retainLines: true
}