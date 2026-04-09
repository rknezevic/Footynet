interface InputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
}

export default function Input({ label, type = 'text', value, onChange, required, min, max, placeholder }: InputProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full border-0 border-b border-neutral-200 focus:border-neutral-900 outline-none py-3 bg-transparent transition-colors"
      />
    </div>
  );
}
