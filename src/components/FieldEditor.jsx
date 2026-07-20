import React from "react";
import { Edit2, X, Check, Loader } from "lucide-react";

export default function FieldEditor({
  label,
  field,
  value,
  type = "text",
  editingFields,
  editValues,
  fieldErrors,
  isLoading,
  disabled = false,
  onEditChange,
  onToggleEdit,
  onSave,
  onCancel,
}) {
  const isEditing = editingFields[field] && !disabled;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-white mb-1">
          {label}
        </label>

        {isEditing ? (
          <div>
            <input
              type={type}
              value={editValues[field] || ""}
              onChange={(e) => onEditChange(field, e.target.value)}
              disabled={isLoading}
              className={`w-full bg-gray-700 text-white px-3 py-2 rounded border ${
                fieldErrors[field] ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-blue-500 disabled:bg-gray-600`}
            />

            {fieldErrors[field] && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors[field]}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-300">{value}</p>
        )}
      </div>

      <div className="flex gap-2 sm:flex-col">
        {isEditing ? (
          <>
            <button
              onClick={() => onSave(field)}
              disabled={isLoading}
              className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-2 rounded transition-colors flex-1 sm:flex-none"
              title="Save changes"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={() => onCancel(field)}
              disabled={isLoading}
              className="flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-600 text-white px-3 py-2 rounded transition-colors flex-1 sm:flex-none"
              title="Cancel changes"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              if (!disabled) {
                onToggleEdit(field);
              }
            }}
            disabled={disabled}
            className={`flex items-center justify-center gap-1 text-white px-3 py-2 rounded transition-colors flex-1 sm:flex-none ${
              disabled
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            title={disabled ? "Only admins can edit" : "Edit this field"}
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">
              {disabled ? "Locked" : "Edit"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}