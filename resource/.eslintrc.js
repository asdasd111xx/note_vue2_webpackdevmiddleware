module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/recommended'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // check if imports actually resolve
    'settings': {
        'import/resolver': {
            'webpack': {
                'config': 'build/webpack.base.conf.js'
            }
        },
        'import/core-modules': [ 'querystring' ]
    },
    // 自訂規則
    'rules': {
        indent: [2, 4, { "SwitchCase": 1 }],
        'no-unused-vars': 1,
        'comma-dangle': [2, 'never'],
        'arrow-body-style': [2, 'as-needed'],
        'global-require': 0,
        'max-len': 0,

        // 暫時先關掉
        'no-alert': 0,
        'no-console': 0,

        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            'js': 'never',
            'vue': 'never'
        }],
        'import/prefer-default-export': 1,
        'import/no-dynamic-require': 0,
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            'optionalDependencies': ['test/unit/index.js']
        }],

        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        // vue plugin
        'vue/html-indent': [1, 4],
        'vue/max-attributes-per-line': [1, {
            singleline: 2,
            multiline: {
                max: 1,
                allowFirstLine: false
            },
        }],
        'vue/html-self-closing': [1, {
            html: {
                void: 'always',
                "normal": "always",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],
        // 此規則會導致safari瀏覽器跑版
        "vue/singleline-html-element-content-newline": 0
    }
};
