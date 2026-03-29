import type { Meta, StoryObj } from '@storybook/react';
import DynamicForm from '.';
import type { FormField } from './types';

const meta: Meta<typeof DynamicForm> = {
  title: 'Business Components/DynamicForm',
  component: DynamicForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'DynamicForm 是一个根据配置动态生成表单的组件，支持多种表单项类型、表单校验、表单布局等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'inline'],
      description: '表单布局方式',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: '表单控件大小',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用表单',
    },
    colon: {
      control: 'boolean',
      description: '是否在 label 后面显示冒号',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicForm>;

const basicFields: FormField[] = [
  {
    name: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    required: true,
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, message: '用户名至少3个字符' },
    ],
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    required: true,
    rules: [
      { required: true, message: '请输入邮箱' },
      { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: '请输入正确的邮箱格式' },
    ],
  },
  {
    name: 'age',
    label: '年龄',
    type: 'number',
    placeholder: '请输入年龄',
    rules: [
      { min: 18, message: '年龄必须大于18岁' },
      { max: 100, message: '年龄必须小于100岁' },
    ],
  },
  {
    name: 'gender',
    label: '性别',
    type: 'radio',
    required: true,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    name: 'hobby',
    label: '爱好',
    type: 'checkbox',
    options: [
      { label: '篮球', value: 'basketball' },
      { label: '足球', value: 'football' },
      { label: '游泳', value: 'swimming' },
      { label: '跑步', value: 'running' },
    ],
  },
  {
    name: 'city',
    label: '城市',
    type: 'select',
    placeholder: '请选择城市',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
    ],
  },
  {
    name: 'description',
    label: '描述',
    type: 'textarea',
    placeholder: '请输入描述',
  },
  {
    name: 'birthday',
    label: '生日',
    type: 'date',
    placeholder: '请选择生日',
  },
  {
    name: 'workTime',
    label: '工作时间',
    type: 'rangePicker',
    placeholder: ['开始时间', '结束时间'],
  },
  {
    name: 'status',
    label: '状态',
    type: 'switch',
  },
  {
    name: 'rating',
    label: '评分',
    type: 'slider',
  },
];

export const Basic: Story = {
  args: {
    fields: basicFields,
    layout: 'vertical',
    onFinish: (values) => {
      console.log('Form values:', values);
    },
  },
};

export const HorizontalLayout: Story = {
  args: {
    fields: basicFields,
    layout: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
};

export const InlineLayout: Story = {
  args: {
    fields: [
      {
        name: 'search',
        label: '搜索',
        type: 'input',
        placeholder: '请输入搜索内容',
      },
      {
        name: 'category',
        label: '分类',
        type: 'select',
        placeholder: '请选择分类',
        options: [
          { label: '全部', value: 'all' },
          { label: '文章', value: 'article' },
          { label: '视频', value: 'video' },
        ],
      },
    ],
    layout: 'inline',
  },
};

export const WithInitialValues: Story = {
  args: {
    fields: basicFields,
    initialValues: {
      username: '张三',
      email: 'zhangsan@example.com',
      age: 25,
      gender: 'male',
      hobby: ['basketball', 'running'],
      city: 'beijing',
      description: '这是一个初始值示例',
      status: true,
      rating: 75,
    },
  },
};

export const DisabledForm: Story = {
  args: {
    fields: basicFields,
    disabled: true,
    initialValues: {
      username: '李四',
      email: 'lisi@example.com',
      age: 30,
      gender: 'female',
      city: 'shanghai',
    },
  },
};

export const SmallSize: Story = {
  args: {
    fields: basicFields,
    size: 'small',
  },
};

export const LargeSize: Story = {
  args: {
    fields: basicFields,
    size: 'large',
  },
};
