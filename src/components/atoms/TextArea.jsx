import { motion } from 'framer-motion';
import { useState } from 'react';

const TextArea = ({ 
  label,
  placeholder = '',
  value = '',
  onChange,
  onFocus,
  onBlur,
  onPaste,
  disabled = false,
  error = null,
  className = '',
  rows = 4,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const baseClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200 resize-none
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}
    ${focused ? 'border-primary' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </motion.label>
      )}
      <motion.textarea
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={baseClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={onPaste}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default TextArea;