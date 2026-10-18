import { useState } from 'react'
import { User, ImagePlus, Sun, Moon, Trash2, ChevronRight } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { applyTheme, getStoredTheme } from '../utils/theme'

const Section = ({ title, children }) => (
    <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
        }}
    >
        <p
            className="text-sm font-semibold"
            style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
            }}
        >
            {title}
        </p>
        {children}
    </div>
)

const CURRENCIES = [
    { label: 'Pakistani Rupee (PKR)', value: 'PKR' },
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'UAE Dirham (AED)', value: 'AED' },
]

const MAX_PROFILE_IMAGE_BYTES = 500 * 1024

const Settings = () => {
    const { user, updateProfile, changePassword, logout, loading } = useAuthStore()
    const [theme, setTheme] = useState(getStoredTheme)

    // Profile form
    const [profile, setProfile] = useState({
        name: user?.name || '',
        currency: user?.currency || 'PKR',
        monthlyBudget: user?.monthlyBudget || '',
    })
    const [profileImage, setProfileImage] = useState(user?.profileImage || '')
    const [profileImageError, setProfileImageError] = useState('')

    // Password form
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [passwordError, setPasswordError] = useState('')

    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false)

    // ── Handlers ─────────────────────────────────────────

    const handleProfileSave = async (e) => {
        e.preventDefault()
        await updateProfile({
            name: profile.name,
            currency: profile.currency,
            monthlyBudget: Number(profile.monthlyBudget) || 0,
            profileImage,
        })
    }

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return

        if (file.size > MAX_PROFILE_IMAGE_BYTES) {
            setProfileImageError('Choose an image that is 500 KB or smaller.')
            return
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setProfileImageError('Choose a JPEG, PNG, or WebP image.')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setProfileImage(reader.result)
            setProfileImageError('')
        }
        reader.onerror = () => {
            setProfileImageError('Could not read this image. Please try another file.')
        }
        reader.readAsDataURL(file)
    }

    const handleThemeChange = (nextTheme) => {
        applyTheme(nextTheme)
        setTheme(nextTheme)
    }

    const handlePasswordSave = async (e) => {
        e.preventDefault()
        setPasswordError('')

        if (!passwords.currentPassword || !passwords.newPassword) {
            return setPasswordError('All fields are required')
        }
        if (passwords.newPassword.length < 6) {
            return setPasswordError('New password must be at least 6 characters')
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setPasswordError('Passwords do not match')
        }

        const ok = await changePassword({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
        })

        if (ok) {
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">

            {/* Header */}
            <div>
                <h1
                    className="text-2xl font-bold tracking-tight"
                    style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-text)',
                    }}
                >
                    Settings
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    Manage your account preferences
                </p>
            </div>

            {/* Profile */}
            <Section title="Profile">
                <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                            style={{
                                background: 'var(--color-accent-soft)',
                                color: 'var(--color-accent)',
                            }}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={26} />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer hover:opacity-80"
                                style={{ color: 'var(--color-accent)' }}
                            >
                                <ImagePlus size={16} />
                                Choose profile image
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleProfileImageChange}
                                    className="sr-only"
                                />
                            </label>
                            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                JPEG, PNG, or WebP; maximum 500 KB.
                            </span>
                            {profileImage && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileImage('')
                                        setProfileImageError('')
                                    }}
                                    className="text-left text-xs cursor-pointer hover:opacity-80"
                                    style={{ color: 'var(--color-red)' }}
                                >
                                    Remove image
                                </button>
                            )}
                        </div>
                    </div>
                    {profileImageError && (
                        <p className="text-xs" role="alert" style={{ color: 'var(--color-red)' }}>
                            {profileImageError}
                        </p>
                    )}
                    <Input
                        label="Full name"
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <div className="flex flex-col gap-1.5">
                        <label
                            className="text-sm font-medium"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none opacity-50 cursor-not-allowed"
                            style={{
                                background: 'var(--color-surface-2)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-muted)',
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        loading={loading}
                        className="self-start px-6"
                    >
                        Save Profile
                    </Button>
                </form>
            </Section>

            <Section title="Appearance">
                <div className="flex flex-col gap-3">
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        Choose the theme for Finora.
                    </p>
                    <div className="flex gap-3" role="group" aria-label="Color theme">
                        {[
                            { value: 'light', label: 'Light', Icon: Sun },
                            { value: 'dark', label: 'Dark', Icon: Moon },
                        ].map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={theme === value}
                                onClick={() => handleThemeChange(value)}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                                style={{
                                    background: theme === value
                                        ? 'var(--color-accent-soft)'
                                        : 'var(--color-surface-2)',
                                    border: `1px solid ${theme === value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                    color: theme === value
                                        ? 'var(--color-accent)'
                                        : 'var(--color-text)',
                                }}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Finance Preferences */}
            <Section title="Finance Preferences">
                <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label
                            className="text-sm font-medium"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            Currency
                        </label>
                        <select
                            value={profile.currency}
                            onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={{
                                background: 'var(--color-surface-2)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)',
                            }}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Monthly Budget"
                        type="number"
                        placeholder="0"
                        value={profile.monthlyBudget}
                        onChange={(e) =>
                            setProfile({ ...profile, monthlyBudget: e.target.value })
                        }
                    />
                    <Button
                        type="submit"
                        loading={loading}
                        className="self-start px-6"
                    >
                        Save Preferences
                    </Button>
                </form>
            </Section>

            {/* Change Password */}
            <Section title="Change Password">
                <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
                    <Input
                        label="Current password"
                        type="password"
                        placeholder="••••••••"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                            setPasswords({ ...passwords, currentPassword: e.target.value })
                        }
                    />
                    <Input
                        label="New password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={passwords.newPassword}
                        onChange={(e) =>
                            setPasswords({ ...passwords, newPassword: e.target.value })
                        }
                    />
                    <Input
                        label="Confirm new password"
                        type="password"
                        placeholder="••••••••"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                            setPasswords({ ...passwords, confirmPassword: e.target.value })
                        }
                        error={passwordError}
                    />
                    <Button
                        type="submit"
                        loading={loading}
                        className="self-start px-6"
                    >
                        Update Password
                    </Button>
                </form>
            </Section>

            {/* Danger Zone */}
            <Section title="Account">
                <div className="flex flex-col gap-3">
                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity w-full"
                        style={{
                            background: 'var(--color-surface-2)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(124,110,245,0.1)' }}
                            >
                                <User size={15} style={{ color: 'var(--color-accent)' }} />
                            </div>
                            <span className="text-sm font-medium"
                                style={{ color: 'var(--color-text)' }}>
                                Log out
                            </span>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--color-muted)' }} />
                    </button>

                    {/* Delete Account */}
                    <button
                        onClick={() => setDeleteModal(true)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity w-full"
                        style={{
                            background: 'rgba(242,92,92,0.06)',
                            border: '1px solid rgba(242,92,92,0.2)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(242,92,92,0.1)' }}
                            >
                                <Trash2 size={15} style={{ color: 'var(--color-red)' }} />
                            </div>
                            <span className="text-sm font-medium"
                                style={{ color: 'var(--color-red)' }}>
                                Delete account
                            </span>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--color-red)' }} />
                    </button>
                </div>
            </Section>

            {/* Delete Confirm Modal */}
            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Delete Account"
            >
                <div className="flex flex-col gap-5">
                    <p className="text-sm leading-relaxed"
                        style={{ color: 'var(--color-muted)' }}>
                        This will permanently delete your account and all your data
                        including expenses and budgets. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-1"
                            onClick={() => {
                                setDeleteModal(false)
                                logout()
                            }}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Settings