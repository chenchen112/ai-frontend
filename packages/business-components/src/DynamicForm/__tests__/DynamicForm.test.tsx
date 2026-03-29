import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynamicForm from '../index';
import type { FormField } from '../types';

const mockFields: FormField[] = [
  {
    name: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    required: true,
    rules: [{ required: true, message: '请输入用户名' }],
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入正确的邮箱格式' },
    ],
  },
  {
    name: 'age',
    label: '年龄',
    type: 'number',
  },
  {
    name: 'gender',
    label: '性别',
    type: 'radio',
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
    ],
  },
  {
    name: 'city',
    label: '城市',
    type: 'select',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
    ],
  },
];

describe('DynamicForm', () => {
  describe('Basic Rendering', () => {
    it('should render form with all fields', () => {
      render(<DynamicForm fields={mockFields} />);

      expect(screen.getByLabelText('用户名')).toBeInTheDocument();
      expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
      expect(screen.getByLabelText('年龄')).toBeInTheDocument();
      expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
      expect(screen.getByText('爱好')).toBeInTheDocument();
      expect(screen.getByLabelText('城市')).toBeInTheDocument();
    });

    it('should render with correct placeholder', () => {
      render(<DynamicForm fields={mockFields} />);

      expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入邮箱')).toBeInTheDocument();
    });

    it('should render with initial values', () => {
      const initialValues = {
        username: '张三',
        email: 'test@example.com',
        age: 25,
        gender: 'male',
        hobby: ['basketball'],
        city: 'beijing',
      };

      render(<DynamicForm fields={mockFields} initialValues={initialValues} />);

      expect((screen.getByLabelText('用户名') as HTMLInputElement).value).toBe('张三');
      expect((screen.getByLabelText('邮箱') as HTMLInputElement).value).toBe('test@example.com');
    });
  });

  describe('Form Submission', () => {
    it('should call onFinish when form is submitted with valid values', async () => {
      const onFinish = jest.fn();
      render(<DynamicForm fields={mockFields} onFinish={onFinish} />);

      const usernameInput = screen.getByLabelText('用户名');
      const emailInput = screen.getByLabelText('邮箱');

      await userEvent.type(usernameInput, '张三');
      await userEvent.type(emailInput, 'test@example.com');

      const form = usernameInput.closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(onFinish).toHaveBeenCalledWith(
          expect.objectContaining({
            username: '张三',
            email: 'test@example.com',
          })
        );
      });
    });

    it('should not call onFinish when form has validation errors', async () => {
      const onFinish = jest.fn();
      render(
        <DynamicForm
          fields={[
            {
              name: 'username',
              label: '用户名',
              type: 'input',
              required: true,
              rules: [{ required: true, message: '请输入用户名' }],
            },
          ]}
          onFinish={onFinish}
        />
      );

      const form = screen.getByLabelText('用户名').closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(onFinish).not.toHaveBeenCalled();
      });
    });

    it('should call onFinishFailed when form validation fails', async () => {
      const onFinishFailed = jest.fn();
      render(
        <DynamicForm
          fields={[
            {
              name: 'username',
              label: '用户名',
              type: 'input',
              required: true,
              rules: [{ required: true, message: '请输入用户名' }],
            },
          ]}
          onFinishFailed={onFinishFailed}
        />
      );

      const form = screen.getByLabelText('用户名').closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(onFinishFailed).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation error when required field is empty on submit', async () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'username',
              label: '用户名',
              type: 'input',
              required: true,
              rules: [{ required: true, message: '请输入用户名' }],
            },
          ]}
        />
      );

      const form = screen.getByLabelText('用户名').closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText('请输入用户名')).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid email format', async () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'email',
              label: '邮箱',
              type: 'input',
              rules: [
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ],
            },
          ]}
        />
      );

      const emailInput = screen.getByLabelText('邮箱');
      await userEvent.type(emailInput, 'invalid-email');

      const form = emailInput.closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText('请输入正确的邮箱格式')).toBeInTheDocument();
      });
    });
  });

  describe('Different Field Types', () => {
    it('should render Input field', () => {
      render(
        <DynamicForm
          fields={[{ name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' }]}
        />
      );

      expect(screen.getByPlaceholderText('请输入姓名')).toBeInTheDocument();
    });

    it('should render TextArea field', () => {
      render(
        <DynamicForm
          fields={[
            { name: 'description', label: '描述', type: 'textarea', placeholder: '请输入描述' },
          ]}
        />
      );

      expect(screen.getByPlaceholderText('请输入描述')).toBeInTheDocument();
    });

    it('should render Number input field', () => {
      render(<DynamicForm fields={[{ name: 'count', label: '数量', type: 'number' }]} />);

      const input = screen.getByLabelText('数量') as HTMLInputElement;
      expect(input.type).toBe('number');
    });

    it('should render Select field', () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'city',
              label: '城市',
              type: 'select',
              options: [
                { label: '北京', value: 'beijing' },
                { label: '上海', value: 'shanghai' },
              ],
            },
          ]}
        />
      );

      expect(screen.getByLabelText('城市')).toBeInTheDocument();
    });

    it('should render Radio.Group field', () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'gender',
              label: '性别',
              type: 'radio',
              options: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
              ],
            },
          ]}
        />
      );

      expect(screen.getByLabelText('男')).toBeInTheDocument();
      expect(screen.getByLabelText('女')).toBeInTheDocument();
    });

    it('should render Checkbox.Group field', () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'hobby',
              label: '爱好',
              type: 'checkbox',
              options: [
                { label: '篮球', value: 'basketball' },
                { label: '足球', value: 'football' },
              ],
            },
          ]}
        />
      );

      expect(screen.getByLabelText('篮球')).toBeInTheDocument();
      expect(screen.getByLabelText('足球')).toBeInTheDocument();
    });
  });

  describe('Form Layout', () => {
    it('should render with vertical layout', () => {
      const { container } = render(<DynamicForm fields={mockFields} layout="vertical" />);

      const formItems = container.querySelectorAll('.ant-form-item');
      expect(formItems.length).toBeGreaterThan(0);
    });

    it('should render with horizontal layout', () => {
      const { container } = render(
        <DynamicForm
          fields={mockFields}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        />
      );

      const formItems = container.querySelectorAll('.ant-form-item');
      expect(formItems.length).toBeGreaterThan(0);
    });

    it('should render with inline layout', () => {
      const { container } = render(<DynamicForm fields={mockFields} layout="inline" />);

      const form = container.querySelector('.ant-form-inline');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Hidden Field', () => {
    it('should not render hidden field', () => {
      render(
        <DynamicForm
          fields={[
            { name: 'visible', label: '可见', type: 'input' },
            { name: 'hidden', label: '隐藏', type: 'input', hidden: true },
          ]}
        />
      );

      expect(screen.getByLabelText('可见')).toBeInTheDocument();
      expect(screen.queryByLabelText('隐藏')).not.toBeInTheDocument();
    });
  });

  describe('onValuesChange', () => {
    it('should call onValuesChange when values change', async () => {
      const onValuesChange = jest.fn();
      render(<DynamicForm fields={mockFields} onValuesChange={onValuesChange} />);

      const usernameInput = screen.getByLabelText('用户名');
      await userEvent.type(usernameInput, '张三');

      expect(onValuesChange).toHaveBeenCalled();
    });
  });
});
