import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card.jsx';
import FieldEditor from "../../components/FieldEditor.jsx";
import InviteMemberForm from "../../Forms/InviteMemberForm.jsx";
import ChangeRoleForm from "../../Forms/ChangeRoleForm.jsx";
import {
  Building2,
  Users,
  Calendar,
  User,
  ShieldCheck,
  X,
  Check,
  Plus,
  Trash2,
  Crown,
  Clock
} from 'lucide-react';
import { getErrorMessage } from '../../utils/errorParser.js';
import {
  useGetOrganizationDetailsQuery,
  useUpdateOrganizationMutation,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useAcceptInvitationMutation,
  useRejectInvitationMutation
} from "../../store/features/organizationApi.js"
import Loader from '../../components/Loader.jsx';

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Organization() {
  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingFields, setEditingFields] = useState({});
  const [editValues, setEditValues] = useState({});
  // for field editor
  const [fieldErrors, setFieldErrors] = useState({});

  // Invitation states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  // Role change states
  const [roleChangeModal, setRoleChangeModal] = useState({ open: false, memberId: null, currentRole: '' });
  const [removingMemberId, setRemovingMemberId] = useState(null);

  // Get organization ID from URL params
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const organizationId = searchParams.get('id');

  // Fetch organization data
  const { data: orgResponse, isLoading: apiLoading, error: apiError, refetch } =
    useGetOrganizationDetailsQuery(organizationId, { skip: !organizationId });
    

  // Mutations
  const [triggerInviteMember, { isLoading: invitingLoading }] = useInviteMemberMutation();
  const [triggerRemoveMember, { isLoading: removingLoading }] = useRemoveMemberMutation();
  const [triggerUpdateRole, { isLoading: updatingRoleLoading }] = useUpdateMemberRoleMutation();
  const [acceptInvitation, { isLoading: accepting }] = useAcceptInvitationMutation();
  const [rejectInvitation, { isLoading: rejecting }] = useRejectInvitationMutation();
  const [triggerUpdateOrganization , { isLoading: updating }] = useUpdateOrganizationMutation();


  const isInvited = orgResponse?.data?.userStatus === 'invited';
  const isActive = orgResponse?.data?.userStatus === 'active';
  const isAdmin = orgResponse?.data?.userRole === 'admin' && isActive;
  const coverImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop';

  useEffect(() => {
    if (!organizationId) {
      setMessage({ type: 'error', text: 'No organization selected' });
      setLoading(false);
      return;
    }

    if (orgResponse?.data) {
      const orgData = orgResponse.data;

      setOrganization({
        _id: orgData._id,
        name: orgData.name,
        description: orgData.description || '',
        createdBy: orgData.createdBy?.fullName || 'Unknown',
        createdAt: orgData.createdAt,
        memberCount: parseInt(orgData.memberCount) || 0,
        location: orgData.location || 'Not specified',
        website: orgData.website || '',
        established: new Date(orgData.createdAt).getFullYear().toString()
      });

      const mappedMembers = orgData.members.map((member) => ({
          _id: member._id,
          name: member.fullName,
          email: member.email,
          role: member.role,
          status: member.status,
          joinedAt: member.joinedAt,
          avatar:
            member.avatar ||
            `https://ui-avatars.com/api/?name=${member.fullName}&background=3b82f6&color=fff`,
        }));

      setMembers(mappedMembers);
      setEditValues({
        _id: orgData._id,
        name: orgData.name,
        description: orgData.description || '',
        createdBy: orgData.createdBy?.fullName || 'Unknown',
        createdAt: orgData.createdAt,
        memberCount: parseInt(orgData.memberCount) || 0,
        location: orgData.location || 'Not specified',
        website: orgData.website || '',
        established: new Date(orgData.createdAt).getFullYear().toString()
      });

      setLoading(false);

      const invitedMembers = orgData.members
       .filter((member) => member.status === "invited")
       .map((member) => ({
         _id: member._id,
         email: member.email,
         role: member.role,
         sentAt: member.joinedAt, // or member.invitedAt if your API provides it
       }));
     
     setPendingInvitations(invitedMembers);
    }
    

    if (apiLoading) {
      setLoading(true);
    }

    if (apiError) {
      setMessage({ type: 'error', text: getErrorMessage(apiError) });
      setLoading(false);
    }
  }, [orgResponse, apiLoading, apiError, organizationId]);

  const toggleEditField = (field) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // for edit org details
const handleSaveField = async (field) => {
  setFieldErrors({});

  try {
    const payload = {
      [field]: editValues[field],
    };

    await triggerUpdateOrganization({
      organizationId,
      data: payload,
    }).unwrap();

    setOrganization((prev) => ({
      ...prev,
      [field]: editValues[field],
    }));

    setEditingFields((prev) => ({
      ...prev,
      [field]: false,
    }));

    setMessage({
      type: "success",
      text: "Organization updated successfully!",
    });

    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  } catch (err) {
    setMessage({
      type: "error",
      text: getErrorMessage(err),
    });
  }
};
  // const handleSaveField = async (field) => {
  //   try {
  //     setOrganization(prev => ({
  //       ...prev,
  //       [field]: editValues[field]
  //     }));
  //     toggleEditField(field);
  //     setMessage({ type: 'success', text: 'Organization updated successfully!' });
  //     setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  //   } catch (err) {
  //     setMessage({ type: 'error', text: getErrorMessage(err) });
  //   }
  // };

  const handleCancel = (field) => {
    setEditValues(prev => ({
      ...prev,
      [field]: organization[field]
    }));
    toggleEditField(field);
  };

  // Handle invite member
const handleInviteMember = async (e) => {
  e.preventDefault();

  if (!inviteEmail.trim()) {
    setMessage({ type: 'error', text: 'Please enter an email address' });
    return;
  }

  setInviting(true);

  try {
    await triggerInviteMember({
      organizationId,
      data: {
        inviteeEmail: inviteEmail,
        role: inviteRole
      }
    }).unwrap();

    // Get latest members including invited user
    await refetch();

    setMessage({
      type: 'success',
      text: `Invitation sent to ${inviteEmail}!`
    });

    setInviteEmail('');
    setInviteRole('member');
    setShowInviteModal(false);

    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);

  } catch (err) {
    setMessage({
      type: 'error',
      text: getErrorMessage(err)
    });
  } finally {
    setInviting(false);
  }
};

  // Handle remove member
  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      return;
    }

    setRemovingMemberId(memberId);
    try {
      await triggerRemoveMember({
        organizationId,
        memberId
      }).unwrap();

      setMembers(prev => prev.filter(m => m._id !== memberId));
      setMessage({ type: 'success', text: `${memberName} has been removed from the organization` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setRemovingMemberId(null);
    }
  };

  // Handle update member role
  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await triggerUpdateRole({
        organizationId,
        memberId,
        data: { role: newRole }
      }).unwrap();

      setMembers(prev => prev.map(m =>
        m._id === memberId ? { ...m, role: newRole } : m
      ));
      setMessage({ type: 'success', text: 'Member role updated successfully!' });
      setRoleChangeModal({ open: false, memberId: null, currentRole: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const handleAccept = async () => {
    try {
      await acceptInvitation(organizationId).unwrap();
      setMessage({ type: 'success', text: 'Invitation accepted successfully! Welcome to the organization.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this invitation? You will lose access to this organization.')) {
      return;
    }
    try {
      await rejectInvitation(organizationId).unwrap();
      setMessage({ type: 'success', text: 'Invitation rejected successfully.' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

const getRoleBadgeColor = (role) => {
  const colors = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    member: "bg-green-100 text-green-800",
  };

  return colors[role] || "bg-gray-100 text-gray-800";
};

const getRoleIcon = (role) => {
  if (role === 'admin') return <ShieldCheck className="w-4 h-4" />;
  return <User className="w-4 h-4" />;
};

  if (loading) {
    return <Loader text="Loading organization..."/>
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Organization not found
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen pb-8">
      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
          'bg-red-50 border border-red-200 text-red-700'
          }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative h-64 sm:h-80 mb-8">
        <img
          src={coverImage}
          alt="Organization Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {organization.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {organization.industry} • {organization.location}
          </p>
        </div>

        {isInvited && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700/50 rounded-xl p-6 shadow-xl text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">You have been invited to join this organization!</h3>
            <p className="text-blue-200 text-sm mb-4">
              You are invited with the role of <span className="font-semibold capitalize text-white">{orgResponse?.data?.userRole}</span>. 
              Accept the invitation to gain access to budgets, expenses, and collaboration features.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAccept}
                disabled={accepting || rejecting}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {accepting ? 'Accepting...' : (
                  <>
                    <Check className="w-5 h-5" />
                    Accept Invitation
                  </>
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={accepting || rejecting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {rejecting ? 'Rejecting...' : (
                  <>
                    <X className="w-5 h-5" />
                    Reject Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center bg-gradient-to-br from-blue-800 to-blue-600">
            <Users className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{organization.memberCount}</p>
            <p className="text-sm text-gray-300">Members</p>
          </Card>

          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{organization.established}</p>
            <p className="text-sm text-gray-600">Established</p>
          </Card>

          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {members.filter(m => m.role === 'admin').length}
            </p>
            <p className="text-sm text-gray-600">Admins</p>
          </Card>
        </div>

        <Card title="Organization Details" className="mb-8">
          <div className="space-y-5">
            {/* DESCRIPTION */}
             <FieldEditor
               label="Description"
               field="description"
               value={organization.description || "No description provided"}
               type="text"
               editingFields={editingFields}
               editValues={editValues}
               fieldErrors={fieldErrors}
               isLoading={updating}
               disabled={!isAdmin}
               onEditChange={handleEditChange}
               onToggleEdit={toggleEditField}
               onSave={handleSaveField}
               onCancel={handleCancel}
             />
             
             {/* WEBSITE */}
             <FieldEditor
               label="Website"
               field="website"
               value={organization.website || "No website provided"}
               type="text"
               editingFields={editingFields}
               editValues={editValues}
               fieldErrors={fieldErrors}
               isLoading={updating}
               disabled={!isAdmin}
               onEditChange={handleEditChange}
               onToggleEdit={toggleEditField}
               onSave={handleSaveField}
               onCancel={handleCancel}
             />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-semibold mb-1">Created By</p>
                <p className="text-white text-base">{organization.createdBy}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-semibold mb-1">Created At</p>
                <p className="text-white text-base">{formatDate(organization.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Invitations Section */}
        {isAdmin && pendingInvitations.length > 0 && (
          <Card title="Pending Invitations" className="mb-8">
            <div className="space-y-3">
              {pendingInvitations.map((invitation, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-600">Role: {invitation.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(invitation.sentAt)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Members Section with Admin Controls */}
        <Card title={`Members (${members.length})`}>
          <div className="mb-6">
            {isAdmin && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Invite Member
              </button>
            )}
          </div>

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-900 rounded-lg hover:border-1 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0 flex-1">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <span className={`badge ${getRoleBadgeColor(member.role)} flex items-center gap-1 capitalize px-3 py-1 sm:mb-3 md:mb-5 rounded-full text-sm font-medium`}>
                    {getRoleIcon(member.role)}
                    {member.role}
                  </span>
                  <div className="text-sm text-gray-500">
                    <p className="sm:block">Joined {formatDate(member.joinedAt)}</p>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-2 ml-auto sm:ml-0">
                      {/* Change Role Button */}
                      <button
                        onClick={() => setRoleChangeModal({
                          open: true,
                          memberId: member._id,
                          currentRole: member.role
                        })}
                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition-colors"
                        disabled={updatingRoleLoading}
                        title="Change member role"
                      >
                        <Crown className="w-4 h-4" />
                        <span className="text-xs">Role</span>
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveMember(member._id, member.name)}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors disabled:opacity-50"
                        disabled={removingMemberId === member._id || removingLoading}
                        title="Remove member from organization"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs">Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No members found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Invite Member Modal */}
       <InviteMemberForm
         open={showInviteModal}
         onClose={() => setShowInviteModal(false)}
         loading={invitingLoading}
         apiError={message.type === "error" ? message.text : ""}
         onSubmit={async (values) => {
           try {
             await triggerInviteMember({
               organizationId,
               data: values,
             }).unwrap();
       
             setPendingInvitations((prev) => [
               ...prev,
               {
                 email: values.inviteeEmail,
                 role: values.role,
                 sentAt: new Date(),
               },
             ]);
       
             setShowInviteModal(false);
       
             setMessage({
               type: "success",
               text: "Invitation sent successfully!",
             });
           } catch (err) {
             setMessage({
               type: "error",
               text: getErrorMessage(err),
             });
           }
         }}
       />
       
             {/* Role Change Modal */}
       <ChangeRoleForm
         open={roleChangeModal.open}
         currentRole={roleChangeModal.currentRole}
         loading={updatingRoleLoading}
         apiError={message.type === "error" ? message.text : ""}
         onClose={() =>
           setRoleChangeModal({
             open: false,
             memberId: null,
             currentRole: "",
           })
         }
         onSubmit={async (values) => {
           await handleUpdateRole(roleChangeModal.memberId, values.role);
         }}
       />
    </div>
  );
}