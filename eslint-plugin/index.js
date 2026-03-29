/**
 * @fileoverview vue2-element-admin custom eslint rules
 * @author vue2-element-admin-eslint-plugin
 */
'use strict';

const formRules = require('./lib/rules/form-rules');
const inputMaxlength = require('./lib/rules/input-maxlength');

module.exports = {
  rules: {
    'form-rules': formRules,
    'input-maxlength': inputMaxlength,
  },
  configs: {
    recommended: {
      plugins: ['vue2-element-admin'],
      rules: {
        'vue2-element-admin/form-rules': 'error',
        'vue2-element-admin/input-maxlength': 'error',
      },
    },
  },
};
