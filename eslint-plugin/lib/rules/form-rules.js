/**
 * @fileoverview Enforce form component to have rules attribute
 * @author vue2-element-admin-eslint-plugin
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce form component to have rules attribute',
      category: 'vue2-element-admin',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          formTags: {
            type: 'array',
            items: { type: 'string' },
            default: ['el-form'],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const formTags = options.formTags || ['el-form'];

    function isFormTag(node) {
      if (!node || node.type !== 'VElement') return false;
      const tagName = node.rawName || node.name;
      return formTags.includes(tagName);
    }

    function hasRulesAttribute(node) {
      if (!node || !node.startTag) return false;
      const attributes = node.startTag.attributes;

      for (const attr of attributes) {
        if (!attr.key) continue;

        if (attr.key.type === 'VDirectiveKey') {
          if (attr.key.name && attr.key.name.name === 'bind') {
            const arg = attr.key.argument;
            if (arg && arg.type === 'VIdentifier' && arg.name === 'rules') {
              return true;
            }
          }
        }

        if (attr.key.type === 'VIdentifier' && attr.key.name === 'rules') {
          return true;
        }
      }
      return false;
    }

    function checkElement(node) {
      if (!node) return;
      if (isFormTag(node) && !hasRulesAttribute(node)) {
        context.report({
          node,
          message: 'Form component must have rules attribute',
          fix(fixer) {
            const sourceCode = context.getSourceCode();
            const tagText = sourceCode.getText(node);
            const openingTag = node.startTag;
            const lastAttr = openingTag.attributes[openingTag.attributes.length - 1];

            if (lastAttr) {
              const lastAttrEnd = lastAttr.range[1];
              return fixer.insertTextAfterRange([lastAttrEnd, lastAttrEnd], ' :rules="{}"');
            }

            const tagNameMatch = tagText.match(/^<(\w+)/);
            if (tagNameMatch) {
              const insertPos = node.range[0] + tagNameMatch[0].length;
              return fixer.insertTextAfterRange([insertPos, insertPos], ' :rules="{}"');
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
