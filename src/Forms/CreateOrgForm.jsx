import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import Form from "../components/Form";
import {
  useCreateOrganizationMutation,
} from "../store/features/organizationApi";
import { getErrorMessage } from "../utils/errorParser";

const OrgForm = ({ onClose, onSuccess }) => {
  const [createOrg, { isLoading }] = useCreateOrganizationMutation();
  const [apiError, setApiError] = useState("");

  const organizationFields = [
    {
      name: "name",
      label: "Organization Name",
      type: "text",
      placeholder: "e.g. Acme Corporation",
      validation: {
        required: "Organization name is required",
        minLength: {
          value: 3,
          message: "Organization name must be at least 3 characters",
        },
        maxLength: {
          value: 100,
          message: "Organization name cannot exceed 100 characters",
        },
      },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Brief details about the organization...",
      validation: {
        maxLength: {
          value: 300,
          message: "Description cannot exceed 300 characters",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "location",
          label: "Location",
          type: "text",
          placeholder: "Islamabad, Pakistan",
        },
        {
          name: "website",
          label: "Website",
          type: "url",
          placeholder: "https://example.com",
          validation: {
            pattern: {
              value: /^https?:\/\/.+$/i,
              message: "Enter a valid website URL",
            },
          },
        },
      ],
    },
  ];

  const handleCreateOrg = async (values) => {
    setApiError("");

    try {
      await createOrg(values).unwrap();

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-50">
      <div className="relative w-[90%] sm:w-[85%] md:w-[50%] lg:w-[35%] max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-100 mb-5 flex items-center gap-2 border-b border-gray-800 pb-3">
          <Building2 className="w-5 h-5 text-blue-500" />
          Create New Organization
        </h2>

        <Form
          fields={organizationFields}
          onSubmit={handleCreateOrg}
          submitLabel={isLoading ? "Creating..." : "Create Organization"}
          apiError={apiError}
        />
      </div>
    </div>
  );
};

export default OrgForm;