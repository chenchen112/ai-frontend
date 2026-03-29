/**
 * @fileoverview Enforce input component to have maxlength attribute
 * @author vue2-element-admin-eslint-plugin
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce input component to have maxlength attribute',
      category: 'vue2-element-admin',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          inputTags: {
            type: 'array',
            items: { type: 'string' },
            default: ['el-input'],
          },
          defaultMaxlength: {
            type: 'number',
            default: 50,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const inputTags = options.inputTags || ['el-input'];
    const defaultMaxlength = options.defaultMaxlength || 50;

    function isInputTag(node) {
      if (!node || node.type !== 'VElement') return false;
      const tagName = node.rawName || node.name;
      return inputTags.includes(tagName);
    }

    function hasMaxlengthAttribute(node) {
      if (!node || !node.startTag) return false;
      const attributes = node.startTag.attributes;

      for (const attr of attributes) {
        if (!attr.key) continue;

        if (attr.key.type === 'VDirectiveKey') {
          if (attr.key.name && attr.key.name.name === 'bind') {
            const arg = attr.key.argument;
            if (arg && arg.type === 'VIdentifier' && arg.name === 'maxlength') {
              return true;
            }
          }
        }

        if (attr.key.type === 'VIdentifier' && attr.key.name === 'maxlength') {
          return true;
        }
      }
      return false;
    }

    function checkElement(node) {
      if (!node) return;
      if (isInputTag(node) && !hasMaxlengthAttribute(node)) {
        context.report({
          node,
          message: 'Input component must have maxlength attribute',
          fix(fixer) {
            const openingTag = node.startTag;
            const lastAttr = openingTag.attributes[openingTag.attributes.length - 1];

            if (lastAttr) {
              const lastAttrEnd = lastAttr.range[1];
              return fixer.insertTextAfterRange([lastAttrEnd, lastAttrEnd], ` :maxlength="${defaultMaxlength}"`);
            }

            const sourceCode = context.getSourceCode();
            const tagText = sourceCode.getText(node);
            const tagNameMatch = tagText.match(/^<(\w+)/);
            if (tagNameMatch) {
              const insertPos = node.range[0] + tagNameMatch[0].length;
              return fixer.insertTextAfterRange([insertPos, insertPos], ` maxlength="${defaultMaxlength}"`);
            }

            return null;
          },
        });
      }
      if (node.type === 'VElement' && node.children) {
        node.children.forEach((child) => {
          if (child.type === 'VElement') {
            checkElement(child);
          }
        });
      }
    }

    return {
      Program(node) {
        if (node.templateBody) {
          checkElement(node.templateBody);
        }
      },
    };
  },
};
