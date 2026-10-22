import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string;
}

export default function FormTextarea({ label, id, ...props }: FormTextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={textareaId} className="field-label">{label}</label>
      <textarea id={textareaId} {...props} className="field resize-y" />
    </div>
  );
}
