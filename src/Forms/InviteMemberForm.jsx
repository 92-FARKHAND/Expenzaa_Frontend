import Card from "../components/Card.jsx";
import Form from "../components/Form.jsx";

const InviteMemberForm = ({
  open,
  onClose,
  onSubmit,
  loading,
  apiError
}) => {

  if (!open) return null;


  const fields = [
    {
      name: "inviteeEmail",
      label: "Email Address",
      type: "email",
      placeholder: "member@example.com",
      validation: {
        required: "Email is required",
      }
    },

    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        {
          label:"Member",
          value:"member"
        },
        {
          label:"Manager",
          value:"manager"
        },
        {
          label:"Admin",
          value:"admin"
        }
      ],
      validation:{
        required:"Role is required"
      }
    }
  ];


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <Card className="w-full max-w-md">

        <h2 className="text-xl font-bold text-white mb-5">
          Invite Member
        </h2>


        <Form
          fields={fields}
          onSubmit={onSubmit}
          onClose={onClose}
          submitLabel={
            loading 
            ? "Sending..."
            : "Send Invitation"
          }
          apiError={apiError}
        />

      </Card>

    </div>
  );
};


export default InviteMemberForm;