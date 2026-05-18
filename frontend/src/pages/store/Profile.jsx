import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiCalendar,
  FiCamera,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiSave,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import axios from '../../api/axios';
import AccountLayout from '../../components/common/AccountLayout';
import UserAvatar from '../../components/common/UserAvatar';
import { updateUser } from '../../features/auth/authSlice';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [user, navigate]);

  useEffect(() => {
    document.title = 'My Profile - Aureva Beauty';
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, []);

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently joined';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const isProfileChanged = formData.name.trim() !== (user.name || '') || formData.email.trim() !== (user.email || '');
    const isPasswordChange = Boolean(formData.newPassword);

    if (!isProfileChanged && !isPasswordChange) {
      toast.error('No changes to update');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      toast.error('Current password is required to set a new password');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put('/users/profile', updateData);
      const updatedUser = response.data?.user || updateData;
      dispatch(updateUser(updatedUser));
      toast.success('Profile updated successfully');
      setEditing(false);
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please choose a JPG or PNG image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Profile picture must be under 2MB');
      return;
    }

    try {
      setAvatarUploading(true);
      const avatarData = new FormData();
      avatarData.append('avatar', file);

      const response = await axios.put('/users/avatar', avatarData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = response.data?.user;
      if (updatedUser) {
        dispatch(updateUser(updatedUser));
      }
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <AccountLayout
      user={user}
      title="Profile"
      subtitle="Manage your personal details, login email, and account security."
      action={!editing && (
        <button type="button" onClick={() => setEditing(true)} className="btn-primary inline-flex items-center gap-2">
          <FiEdit2 className="h-4 w-4" />
          Edit profile
        </button>
      )}
    >
      <div className="space-y-6">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar user={user} size="xl" />
                <label
                  className="absolute bottom-0 right-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-plum-900 text-white shadow-sm transition hover:bg-plum-950"
                  title="Change profile picture"
                  aria-label="Change profile picture"
                >
                  {avatarUploading ? <BiLoaderAlt className="h-4 w-4 animate-spin" /> : <FiCamera className="h-4 w-4" />}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                    className="sr-only"
                  />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-stone-950">{user.name}</h2>
                <p className="mt-1 text-sm text-stone-500">{user.email}</p>
                <span className="mt-3 inline-flex rounded-full bg-ivory-100 px-3 py-1 text-xs font-semibold capitalize text-plum-900">
                  {user.role || 'customer'}
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-600">
              <span className="block text-xs font-semibold uppercase tracking-normal text-stone-500">Member since</span>
              <span className="mt-1 block font-semibold text-stone-900">{memberSince}</span>
            </div>
          </div>
        </section>

        {!editing ? (
          <section className="grid gap-4 md:grid-cols-2">
            <InfoTile icon={FiUser} label="Full name" value={user.name} />
            <InfoTile icon={FiMail} label="Email address" value={user.email} />
            <InfoTile icon={FiShield} label="Account role" value={user.role || 'customer'} capitalize />
            <InfoTile icon={FiCalendar} label="Member since" value={memberSince} />
          </section>
        ) : (
          <form onSubmit={handleUpdateProfile} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" icon={FiUser}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input pl-12"
                  required
                />
              </Field>
              <Field label="Email address" icon={FiMail}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-12"
                  required
                />
              </Field>
            </div>

            <div className="mt-8 border-t border-stone-200 pt-6">
              <h3 className="text-lg font-semibold text-stone-950">Change password</h3>
              <p className="mt-1 text-sm text-stone-500">Leave these fields blank if you only want to update profile details.</p>

              <div className="mt-5 grid gap-5">
                <PasswordField
                  label="Current password"
                  value={formData.currentPassword}
                  visible={showCurrentPassword}
                  setVisible={setShowCurrentPassword}
                  onChange={(value) => setFormData({ ...formData, currentPassword: value })}
                />
                <PasswordField
                  label="New password"
                  value={formData.newPassword}
                  visible={showNewPassword}
                  setVisible={setShowNewPassword}
                  onChange={(value) => setFormData({ ...formData, newPassword: value })}
                />
                <PasswordField
                  label="Confirm new password"
                  value={formData.confirmPassword}
                  visible={showConfirmPassword}
                  setVisible={setShowConfirmPassword}
                  onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={loading} className="btn-primary inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <BiLoaderAlt className="h-5 w-5 animate-spin" /> : <FiSave className="h-4 w-4" />}
                Save changes
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary inline-flex flex-1 items-center justify-center gap-2">
                <FiX className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </AccountLayout>
  );
}

function InfoTile({ icon, label, value, capitalize = false }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
          {icon({ className: 'h-5 w-5' })}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className={`mt-1 truncate text-base font-semibold text-stone-950 ${capitalize ? 'capitalize' : ''}`}>
            {value || 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <span className="relative block">
        {icon({ className: 'absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400' })}
        {children}
      </span>
    </label>
  );
}

function PasswordField({ label, value, visible, setVisible, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <span className="relative block">
        <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-12 pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-plum-900"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </span>
    </label>
  );
}
