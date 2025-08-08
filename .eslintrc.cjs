module.exports = {
  plugins: ["import"],
  rules: {
    "import/no-unresolved": "error",
    "import/no-named-as-default": 0,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
