import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
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
              type={type}
              id={name}
              className={`
                appearance-none block w-full  text-gray-600 px-3 py-2 border 
                ${
                  invalid
                    ? "border-red-300 ring-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }
                rounded-lg shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-2 
                transition-all duration-200 sm:text-sm
                ${error ? "pr-10" : ""}
              `}
              placeholder={placeholder}
              aria-invalid={invalid}
              aria-describedby={`${name}-error`}
            />
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
      )}
    />
  );
};
