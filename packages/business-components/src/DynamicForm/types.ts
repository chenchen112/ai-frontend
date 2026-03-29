import type { ReactNode } from 'react';

export type FieldType = 
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'rangePicker'
  | 'switch'
  | 'slider';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string | string[];
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: string | number }>;
  rules?: Array<{
    required?: boolean;
    message?: string;
    type?: string;
    min?: number;
    max?: number;
    pattern?: string;
    validator?: (rule: unknown, value: unknown) => Promise<void>;
  }>;
  dependencies?: string[];
  tooltip?: string;
  extra?: ReactNode;
}

export interface DynamicFormProps {
  fields: FormField[];
  initialValues?: Record<string, unknown>;
  onValuesChange?: (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void;
  onFinish?: (values: Record<string, unknown>) => void;
  onFinishFailed?: (errorInfo: { values: Record<string, unknown>; errorFields: Array<{ name: string[]; errors: string[] }> }) => void;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number; offset?: number };
  wrapperCol?: { span: number; offset?: number };
  colon?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: React.CSSProperties;
  formProps?: Record<string, unknown>;
}

export interface DynamicFormRef {
  getFieldsValue: () => Record<string, unknown>;
  setFieldsValue: (values: Record<string, unknown>) => void;
  resetFields: () => void;
  validateFields: () => Promise<Record<string, unknown>>;
  submit: () => void;
}
