import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...rest }) => {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: 'bold' }}>{label}</label>
      <input 
        {...rest} 
        style={{ padding: '8px', borderRadius: '4px', border: error ? '1px solid red' : '1px solid #ccc' }} 
      />
      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
    </div>
  );
};

export default Input;