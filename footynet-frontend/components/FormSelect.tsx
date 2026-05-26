import { SelectHTMLAttributes, ReactNode } from 'react';

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  children: ReactNode;
}

export default function FormSelect({ label, id, children, ...props }: FormSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <select
        id={selectId}
        {...props}
        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
      >
        {children}
      </select>
    </div>
  );
}
