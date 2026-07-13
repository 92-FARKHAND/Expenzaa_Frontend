import React, { useEffect, useState } from "react";
import { Edit2, Lock, AlertCircle, Loader, Check } from "lucide-react";
import { getErrorMessage } from "../../utils/errorParser.js";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} from "../../store/features/auth/authApi.js";
import ChangePasswordModal from "../../Forms/ChangePasswordModal.jsx";
import FieldEditor from "../../components/FieldEditor.jsx";

export default function Profile() {
  // ========================
  // 🔹 QUERIES & MUTATIONS
  // ========================
  const { data: profileData, isLoading, isError, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateAvatarMutation();

  // ========================
  // 🔹 STATE
  // ========================
  const [user, setUser] = useState(null);
  const [editingFields, setEditingFields] = useState({});
  const [editValues, setEditValues] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // ========================
  // 🔹 EFFECTS
  // ========================
  useEffect(() => {
    if (profileData?.data) {
      setUser(profileData.data);
      setEditValues(profileData.data);
    }
  }, [profileData]);

  // Clear feedback message after 5 seconds
  useEffect(() => {
    if (feedbackMessage.message) {
      const timer = setTimeout(() => {
        setFeedbackMessage({ type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // ========================
  // 🔹 HANDLERS - EDIT FIELDS
  // ========================
  const toggleEditField = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveField = async (field) => {
    // Validation
    if (!editValues[field] || editValues[field].trim() === "") {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
      }));
      return;
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editValues[field])) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: "Please enter a valid email",
        }));
        return;
      }
    }

    try {
      const response = await updateProfile({
        [field]: editValues[field],
      }).unwrap();

      if (response?.data) {
        setUser(response.data);
        setEditValues(response.data);
      }

      setFeedbackMessage({
        type: "success",
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`,
      });
      toggleEditField(field);
    } catch (err) {
      setFeedbackMessage({
        type: "error",
        message: getErrorMessage(err),
      });
      setFieldErrors((prev) => ({
        ...prev,
        [field]: getErrorMessage(err),
      }));
    }
  };

  const handleCancel = (field) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: user[field],
    }));
    toggleEditField(field);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // ========================
  // 🔹 HANDLERS - AVATAR
  // ========================
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setFeedbackMessage({
        type: "error",
        message: "Please upload a valid image file (JPEG, PNG, GIF, WebP)",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFeedbackMessage({
        type: "error",
        message: "Image size must be less than 5MB",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await updateAvatar(formData).unwrap();

      if (response?.data) {
        setUser(response.data);
        setEditValues(response.data);
      }

      setFeedbackMessage({
        type: "success",
        message: "Avatar updated successfully!",
      });
    } catch (err) {
      setFeedbackMessage({
        type: "error",
        message: getErrorMessage(err),
      });
    }
  };

  // ========================
  // 🔹 RENDER - LOADING/ERROR
  // ========================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{getErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ========================
  // 🔹 RENDER - MAIN
  // ========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Feedback Message */}
      {feedbackMessage.message && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
            feedbackMessage.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {feedbackMessage.message}
        </div>
      )}

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          {/* Avatar Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-32">
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
              <div className="relative group">
                <img
                  src={
                    user.avatar ||
                    "https://via.placeholder.com/100?text=Profile"
                  }
                  alt={user.fullName}
                  className="w-24 h-24 rounded-full border-4 border-gray-800 object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUpdatingAvatar}
                    className="hidden"
                  />
                  <Edit2 className="w-6 h-6 text-white" />
                </label>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-16 px-6 pb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {user.fullName}
              </h2>
              <p className="text-gray-400">@{user.username}</p>
              <p className="text-sm text-gray-500 mt-2">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Fields Section */}
            <div className="space-y-6">
              {/* Full Name Field */}
              <FieldEditor
                label="Full Name"
                field="fullName"
                value={user.fullName}
                editingFields={editingFields}
                editValues={editValues}
                fieldErrors={fieldErrors}
                isLoading={isUpdatingProfile}
                onEditChange={handleEditChange}
                onToggleEdit={toggleEditField}
                onSave={handleSaveField}
                onCancel={handleCancel}
              />

              {/* Username Field */}
              <FieldEditor
                label="Username"
                field="username"
                value={`@${user.username}`}
                editingFields={editingFields}
                editValues={editValues}
                fieldErrors={fieldErrors}
                isLoading={isUpdatingProfile}
                onEditChange={handleEditChange}
                onToggleEdit={toggleEditField}
                onSave={handleSaveField}
                onCancel={handleCancel}
              />

              {/* Email Field */}
              <FieldEditor
                label="Email"
                field="email"
                value={user.email}
                type="email"
                editingFields={editingFields}
                editValues={editValues}
                fieldErrors={fieldErrors}
                isLoading={isUpdatingProfile}
                onEditChange={handleEditChange}
                onToggleEdit={toggleEditField}
                onSave={handleSaveField}
                onCancel={handleCancel}
              />

              {/* Password Field */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Password
                  </label>
                  <p className="text-gray-400">••••••••</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}