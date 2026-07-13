import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const Form = ({ fields, onSubmit, defaultValues = {}, submitLabel = "Submit", onClose, apiError = null }) => {
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
      className=" relative"
      encType="multipart/form-data"
      noValidate
    >
      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-15 -right-4 text-gray-400 hover:text-white transition bg-gray-800 rounded-full p-1 border border-gray-600 hover:bg-red-600 shadow-lg z-50"
        >
          <X size={20} />
        </button>
      )}



      {fields.map((field, index) => {
  // ✅ HANDLE ROW LAYOUT
  if (field.type === "row") {
    return (
      <div key={index} className="grid grid-cols-2 gap-4">
        {field.fields.map((subField, subIndex) => (
          <div key={subIndex} className="flex flex-col gap-1">
            <label
              htmlFor={subField.name}
              className="font-medium text-sm text-white"
            >
              {subField.label}
            </label>

            {renderField(subField)}

            {errors[subField.name] && (
              <p className="text-sm text-red-500">
                {errors[subField.name]?.message}
              </p>
            )}

            {!errors[subField.name] &&
              touchedFields[subField.name] &&
              subField.type !== "file" && (
                <p className="text-sm text-green-500">Valid Input</p>
              )}
          </div>
        ))}
      </div>
    );
  }

  // ✅ NORMAL FIELD
  return (
    <div key={index} className="flex flex-col gap-1">
      <label htmlFor={field.name} className="font-medium text-sm text-white">
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
        field.type !== "file" && (
          <p className="text-sm text-green-500">Valid Input</p>
        )}
    </div>
  );
})}

      <button
        type="submit"
        className={`w-full mt-2 py-2 px-4 rounded-md font-semibold text-white 
          ${isValid ? 'bg-blue-800 hover:bg-blue-900' : 'bg-gray-600'}
        `}
      >
        {submitLabel}
      </button>
            {/* API Error Display */}
      {apiError && (
        <div className="text-red-500 text-sm bg-red-100/10 p-2 rounded text-center mb-3">
          {apiError}
        </div>
      )}
    </form>
  );
};

export default Form;
