module.exports = {
    "plugins": ["@babel/plugin-syntax-dynamic-import", "@babel/transform-runtime"],
    "presets": [
      [
        "@babel/preset-es2015",
        {
          "modules": false
        }
      ],
      "react",
    ],
    "env": {
        "test": {
          "presets": ["@babel/preset-env", "@babel/preset-react"],
          "plugins": ["transform-export-extensions","dynamic-import-node"],
        }
    },
  }