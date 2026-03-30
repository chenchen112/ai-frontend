/**
 * @fileoverview Enforce form component to have rules attribute
 * @author vue2-element-admin-eslint-plugin
 */
'use strict';

module.exports = {
  meta: {
    // 规则类型: problem 表示该规则检测的是代码中的错误或潜在问题
    type: 'problem',

    // 规则的文档说明
    docs: {
      // 规则的简要描述
      description: 'Enforce form component to have rules attribute',
      // 规则所属的分类
      category: 'vue2-element-admin',
      // 是否推荐使用
      recommended: true,
    },

    // 指定自动修复的类型: 'code' 表示可以通过 ESLint --fix 自动修复
    fixable: 'code',

    // 规则的配置选项 schema，用于验证用户传入的选项是否合法
    schema: [
      {
        type: 'object',
        properties: {
          // 允许用户自定义要检查的表单标签名
          formTags: {
            type: 'array',
            items: { type: 'string' },
            // 默认检查 el-form 标签
            default: ['el-form'],
          },
        },
        additionalProperties: false,
      },
    ],

    // 规则返回的错误消息模板
    messages: {
      // 错误消息的 key 和内容
      missingRules: 'Form component must have rules attribute',
    },
  },

  create(context) {
    // 获取用户传入的选项，如果没有则使用默认值
    const options = context.options[0] || {};
    const formTags = options.formTags || ['el-form'];

    /**
     * 检查节点是否是表单标签
     * @param {ASTNode} node - VElement 节点
     * @returns {boolean} - 是否是表单标签
     */
    function isFormTag(node) {
      if (!node || node.type !== 'VElement') return false;
      const tagName = node.rawName || node.name;
      return formTags.includes(tagName);
    }

    /**
     * 检查表单元素是否具有 rules 属性
     * @param {ASTNode} node - VElement 节点
     * @returns {boolean} - 是否具有 rules 属性
     */
    function hasRulesAttribute(node) {
      if (!node || !node.startTag) return false;
      const attributes = node.startTag.attributes;

      for (const attr of attributes) {
        if (!attr.key) continue;

        // 检查 v-bind:rules 或 :rules
        if (attr.key.type === 'VDirectiveKey') {
          if (attr.key.name && attr.key.name.name === 'bind') {
            const arg = attr.key.argument;
            if (arg && arg.type === 'VIdentifier' && arg.name === 'rules') {
              return true;
            }
          }
        }

        // 检查静态属性 rules
        if (attr.key.type === 'VIdentifier' && attr.key.name === 'rules') {
          return true;
        }
      }
      return false;
    }

    /**
     * 递归检查元素节点
     * @param {ASTNode} node - VElement 节点
     */
    function checkElement(node) {
      if (!node) return;

      // 如果是表单标签且没有 rules 属性，则报错
      if (isFormTag(node) && !hasRulesAttribute(node)) {
        context.report({
          node,
          message: 'Form component must have rules attribute',
          // 自动修复函数
          fix(fixer) {
            const openingTag = node.startTag;
            const lastAttr = openingTag.attributes[openingTag.attributes.length - 1];

            // 如果已有属性，在最后一个属性后添加 rules
            if (lastAttr) {
              const lastAttrEnd = lastAttr.range[1];
              return fixer.insertTextAfterRange([lastAttrEnd, lastAttrEnd], ' :rules="{}"');
            }

            // 如果没有属性，在标签名后添加 rules
            const sourceCode = context.getSourceCode();
            const tagText = sourceCode.getText(node);
            const tagNameMatch = tagText.match(/^<(\w+)/);
            if (tagNameMatch) {
              const insertPos = node.range[0] + tagNameMatch[0].length;
              return fixer.insertTextAfterRange([insertPos, insertPos], ' :rules="{}"');
            }

            return null;
          },
        });
      }

      // 递归检查子元素
      if (node.type === 'VElement' && node.children) {
        node.children.forEach((child) => {
          if (child.type === 'VElement') {
            checkElement(child);
          }
        });
      }
    }

    return {
      // 在 AST 的根节点进行检查
      Program(node) {
        if (node.templateBody) {
          checkElement(node.templateBody);
        }
      },
    };
  },
};
