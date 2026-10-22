import { SelectHTMLAttributes, ReactNode } from 'react';

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  children: ReactNode;
}

export default function FormSelect({ label, id, children, ...props }: FormSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={selectId} className="field-label">{label}</label>
      <select id={selectId} {...props} className="field">
        {children}
      </select>
    </div>
  );
}
