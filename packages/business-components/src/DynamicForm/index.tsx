import { useImperativeHandle, forwardRef, useCallback } from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Switch,
  Slider,
  type FormProps,
  type FormItemProps,
} from 'antd';
import type { DynamicFormProps, DynamicFormRef, FormField } from './types';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const renderField = (field: FormField) => {
  const { type, placeholder, disabled, options, hidden } = field;

  if (hidden) {
    return null;
  }

  const commonProps = {
    disabled,
    style: { width: '100%' } as const,
  };

  switch (type) {
    case 'input':
      return <Input placeholder={placeholder as string} {...commonProps} />;
    case 'textarea':
      return <TextArea placeholder={placeholder as string} rows={4} {...commonProps} />;
    case 'number':
      return <Input type="number" placeholder={placeholder as string} {...commonProps} />;
    case 'select':
      return (
        <Select placeholder={placeholder as string} options={options} allowClear {...commonProps} />
      );
    case 'radio':
      return (
        <Radio.Group {...commonProps}>
          {options?.map((opt) => (
            <Radio key={opt.value} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </Radio.Group>
      );
    case 'checkbox':
      if (options && options.length > 0) {
        return (
          <Checkbox.Group {...commonProps}>
            {options.map((opt) => (
              <Checkbox key={opt.value} value={opt.value}>
                {opt.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      }
      return <Checkbox {...commonProps} />;
    case 'date':
      return (
        <DatePicker
          placeholder={placeholder as string}
          {...commonProps}
          style={{ width: '100%' }}
        />
      );
    case 'rangePicker':
      return (
        <RangePicker
          placeholder={placeholder as [string, string]}
          {...commonProps}
          style={{ width: '100%' }}
        />
      );
    case 'switch':
      return <Switch {...commonProps} />;
    case 'slider':
      return <Slider {...commonProps} />;
    default:
      return <Input placeholder={placeholder as string} {...commonProps} />;
  }
};

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>((props, ref) => {
  const {
    fields,
    initialValues,
    onValuesChange,
    onFinish,
    onFinishFailed,
    layout = 'vertical',
    labelCol = { span: 24 },
    wrapperCol = { span: 24 },
    colon = true,
    disabled = false,
    size = 'middle',
    className,
    style,
    formProps,
  } = props;

  const [form] = Form.useForm();

  const getFieldsValue = useCallback(() => form.getFieldsValue(), [form]);

  const setFieldsValue = useCallback(
    (values: Record<string, unknown>) => {
      form.setFieldsValue(values);
    },
    [form]
  );

  const resetFields = useCallback(() => {
    form.resetFields();
  }, [form]);

  const validateFields = useCallback(async () => {
    const values = await form.validateFields();
    return values;
  }, [form]);

  const submit = useCallback(() => {
    form.submit();
  }, [form]);

  useImperativeHandle(
    ref,
    () => ({
      getFieldsValue,
      setFieldsValue,
      resetFields,
      validateFields,
      submit,
    }),
    [getFieldsValue, setFieldsValue, resetFields, validateFields, submit]
  );

  const handleFinish = (values: Record<string, unknown>) => {
    onFinish?.(values);
  };

  const handleFinishFailed = (
    errorInfo: Parameters<NonNullable<FormProps['onFinishFailed']>>[0]
  ) => {
    onFinishFailed?.(errorInfo as never);
  };

  const formLayout: FormProps['layout'] =
    // eslint-disable-next-line no-nested-ternary
    layout === 'inline' ? 'inline' : layout === 'horizontal' ? 'horizontal' : 'vertical';

  return (
    <Form
      form={form}
      layout={formLayout}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      labelCol={layout === 'horizontal' ? labelCol : undefined}
      wrapperCol={layout === 'horizontal' ? wrapperCol : undefined}
      colon={colon}
      disabled={disabled}
      size={size}
      className={className}
      style={style}
      {...formProps}
    >
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          required={field.required}
          tooltip={field.tooltip}
          extra={field.extra}
          dependencies={field.dependencies}
          hidden={field.hidden}
          initialValue={field.defaultValue}
          rules={field.rules as FormItemProps['rules']}
        >
          {renderField(field)}
        </Form.Item>
      ))}
    </Form>
  );
});

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;
export type { DynamicFormProps, DynamicFormRef, FormField, FieldType } from './types';
