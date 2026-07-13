import React, { useState } from "react";
import { X, Check, Loader } from "lucide-react";
import { useChangePasswordMutation } from "../store/features/auth/authApi";
import { getErrorMessage } from "../utils/errorParser.js";

export default function ChangePasswordModal({ isOpen, onClose }) {
  // ========================
  // 🔹 MUTATIONS
  // ========================
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // ========================
  // 🔹 STATE
  // ========================
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    message: "",
  });

  // ========================
  // 🔹 HANDLERS
  // ========================
  const handlePasswordFormChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();

      setFeedbackMessage({
        type: "success",
        message: "Password changed successfully!",
      });

      // Reset form and close modal after 1.5 seconds
      setTimeout(() => {
        resetModal();
        onClose();
      }, 1500);
    } catch (err) {
      console.log(err)
      const errorMsg = getErrorMessage(err);
      setFeedbackMessage({
        type: "error",
        message: errorMsg,
      });
      setFieldErrors({
        currentPassword: errorMsg,
      });
    }
  };

  const resetModal = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFieldErrors({});
    setFeedbackMessage({
      type: "",
      message: "",
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // ========================
  // 🔹 RENDER
  // ========================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Change Password</h3>
          <button
            onClick={handleClose}
            disabled={isChangingPassword}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMessage.message && (
          <div
            className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${
              feedbackMessage.type === "success"
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {feedbackMessage.type === "success" ? (
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <p
              className={
                feedbackMessage.type === "success"
                  ? "text-green-300 text-sm"
                  : "text-red-300 text-sm"
              }
            >
              {feedbackMessage.message}
            </p>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                handlePasswordFormChange("currentPassword", e.target.value)
              }
              disabled={isChangingPassword}
              className={`w-full bg-gray-700 text-white px-3 py-2 rounded border ${
                fieldErrors.currentPassword
                  ? "border-red-500"
                  : "border-gray-600"
              } focus:outline-none focus:border-blue-500 disabled:bg-gray-600`}
              placeholder="Enter current password"
            />
            {fieldErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                handlePasswordFormChange("newPassword", e.target.value)
              }
              disabled={isChangingPassword}
              className={`w-full bg-gray-700 text-white px-3 py-2 rounded border ${
                fieldErrors.newPassword ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-blue-500 disabled:bg-gray-600`}
              placeholder="Enter new password"
            />
            {fieldErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                handlePasswordFormChange("confirmPassword", e.target.value)
              }
              disabled={isChangingPassword}
              className={`w-full bg-gray-700 text-white px-3 py-2 rounded border ${
                fieldErrors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-600"
              } focus:outline-none focus:border-blue-500 disabled:bg-gray-600`}
              placeholder="Confirm new password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isChangingPassword}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}