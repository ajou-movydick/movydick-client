module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        // "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        // "@typescript-eslint",
        "react",
        // "eslint-plugin-import"
    ],
    "rules": {
        // js
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "space-infix-ops": ["error", { "int32Hint": false }],
        "prefer-const": "off",
        "no-unused-vars": "off",

        // react.js
        "react/react-in-jsx-scope": "off",
        // "react/prop-typezs": "off",

        // // plugins
        // "import/order": ["error", {
        //     "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
        //     "newlines-between": "always",
        //     "alphabetize": { "order": "asc", "caseInsensitive": true }
        // }]
    }
};
