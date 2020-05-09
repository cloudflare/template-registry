/*eslint-env node*/
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": ["@typescript-eslint"],
    "rules": {
        "no-unused-vars": [2, {"args": "after-used", "argsIgnorePattern": "^_"}],
        "no-undef": "off"

    }
};
