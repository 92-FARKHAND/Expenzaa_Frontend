import React from 'react';
import { useForm } from 'react-hook-form';

const Form = ({ fields, onSubmit, defaultValues = {}, submitLabel = "Submit" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm({
    defaultValues,
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const renderField = (field) => {
    const {
      name,
      label,
      type = "text",
      placeholder,
      options,
      validation = {},
    } = field;

    const hasError = !!errors[name];
    const hasTouched = touchedFields[name];
    const isFieldValid = !hasError && hasTouched;

    const baseClass = `p-2 border rounded-md outline-none transition w-full bg-gray-800 text-gray-200
      ${hasError ? 'border-red-500 focus:ring-red-300' :
        isFieldValid ? 'border-green-500 focus:ring-green-300' :
          'border-gray-700 focus:ring-blue-400'} focus:ring-2`;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            placeholder={placeholder}
            {...register(name, validation)}
            className={baseClass}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            {...register(name, validation)}
            className={baseClass}
          >
            <option value="">Select an option</option>
            {options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            id={name}
            type="file"
            {...register(name, validation)}
            accept="image/*"
            className={`file:mr-3 file:py-1.5 file:px-3 file:rounded-lg 
                        file:border-0 file:bg-gray-700 file:text-gray-200 file:cursor-pointer
                        text-gray-200 bg-gray-800 border border-gray-700 rounded-lg p-2 w-full 
                        focus:outline-none focus:ring-2 focus:ring-gray-600`}
          />
        );

      default:
        return (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
            className={baseClass}
          />
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      encType="multipart/form-data"
      noValidate
    >
      {fields.map((field, index) => (
        <div key={index} className="flex flex-col gap-1">
          <label
            htmlFor={field.name}
            className="font-medium text-sm text-white"
          >
            {field.label}
          </label>

          {renderField(field)}

          {errors[field.name] && (
            <p className="text-sm text-red-500">
              {errors[field.name]?.message}
            </p>
          )}

          {!errors[field.name] &&
            touchedFields[field.name] &&
            field.type !== 'file' && (
              <p className="text-sm text-green-500">Valid Input</p>
            )}
        </div>
      ))}

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md font-semibold text-white 
          ${isValid ? 'bg-blue-800 hover:bg-blue-900' : 'bg-gray-600'}
        `}
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;
