import React from 'react';
import { PASTEL_COLORS } from '../../constants';

interface SwitchToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  accentColorClass?: string; // e.g., PASTEL_COLORS.mint.button
}

const SwitchToggle: React.FC<SwitchToggleProps> = ({ 
  id, 
  label, 
  checked, 
  onChange, 
  disabled = false,
  accentColorClass = PASTEL_COLORS.mint.button 
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <label htmlFor={id} className={`text-md ${disabled ? PASTEL_COLORS.textLight : PASTEL_COLORS.textDark} cursor-pointer select-none`}>
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        id={`${id}-switch`}
        onClick={handleToggle}
        disabled={disabled}
        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${checked ? accentColorClass : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group active:scale-95'}`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

export default SwitchToggle;
