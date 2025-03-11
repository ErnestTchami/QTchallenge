import { useController, Control } from 'react-hook-form';
import { useState } from 'react';
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

export function FormInput({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  showPasswordToggle = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          id={name}
          type={showPasswordToggle && showPassword ? 'text' : type}
          className={`
            appearance-none block w-full  text-gray-600 px-3 py-2 border 
            ${
              error ? "border-red-300 ring-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }
            rounded-lg shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 
            transition-all duration-200 sm:text-sm
            ${error ? "pr-10" : ""}
          `}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : false}
          aria-describedby={`${name}-error`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showPassword ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              )}
            </svg>
          </button>
        )}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
}
