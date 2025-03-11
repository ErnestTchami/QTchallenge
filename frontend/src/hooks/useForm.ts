import { useAuth } from "@/context/AuthContext";
import { useState, FormEvent } from "react";

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isLoading: boolean;
}

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isLoading: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const setFieldValue = (name: keyof T, value: unknown) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const setError = (name: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const resetForm = () => {
    setState({
      values: initialValues,
      errors: {},
      isLoading: false,
    });
  };
  const {} = useAuth();
  const handleSubmit = (onSubmit: (values: T) => Promise<void>) => {
    return async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setLoading(false);
      }
    };
  };

  return {
    ...state,
    handleChange,
    setFieldValue,
    setError,
    setLoading,
    resetForm,
    handleSubmit,
  };
}
