import { useStore } from '@nanostores/react'
import {
  ChevronDown,
  CloudOff,
  Github,
  Keyboard,
  KeyRound,
  Languages,
  LogOut,
  Menu,
  RefreshCw,
  UserPen,
  Wifi,
} from 'lucide-react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import {
  useGeneralQuery,
  useRunMutation,
  useUpdateAvatarMutation,
  useUpdateNameMutation,
  useUpdatePasswordMutation,
  useUpdateUsernameMutation,
  useUserQuery,
} from '~/apis'
import { Avatar } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Code } from '~/components/ui/code'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { Switch } from '~/components/ui/switch'
import { SimpleTooltip } from '~/components/ui/tooltip'
import { useColorScheme } from '~/contexts'
import { useDisclosure, useKeyboardShortcuts, useMediaQuery } from '~/hooks'
import { i18n } from '~/i18n'
import { cn } from '~/lib/utils'
import { endpointURLAtom, tokenAtom } from '~/store'
import { fileToBase64 } from '~/utils'

import { CommandPalette, useCommandPaletteActions } from './CommandPalette'
import { FormActions } from './FormActions'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { ProfileSwitcher } from './ProfileSwitcher'
import { ThemePicker } from './ThemePicker'

const accountSettingsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1),
})

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function HeaderWithActions() {
  const { t } = useTranslation()
  const endpointURL = useStore(endpointURLAtom)
  const { themeMode, setThemeMode } = useColorScheme()

  const cycleThemeMode = () => {
    const modes: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark']
    const currentIndex = modes.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [openedBurger, { toggle: toggleBurger, close: closeBurger }] = useDisclosure(false)
  const [openedAccountSettingsFormModal, { open: openAccountSettingsFormModal, close: closeAccountSettingsFormModal }] =
    useDisclosure(false)
  const [openedPasswordChangeModal, { open: openPasswordChangeModal, close: closePasswordChangeModal }] =
    useDisclosure(false)
  const [openedShortcutsModal, { open: openShortcutsModal, close: closeShortcutsModal }] = useDisclosure(false)
  const [openedCommandPalette, { open: openCommandPalette, close: closeCommandPalette }] = useDisclosure(false)
  const { data: userQuery } = useUserQuery()
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()
  const updateNameMutation = useUpdateNameMutation()
  const updatePasswordMutation = useUpdatePasswordMutation()
  const updateUsernameMutation = useUpdateUsernameMutation()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const [uploadingAvatarBase64, setUploadingAvatarBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ username: '', name: '' })
  const [formErrors, setFormErrors] = useState<{ username?: string; name?: string }>({})
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordFormErrors, setPasswordFormErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const matchSmallScreen = useMediaQuery('(max-width: 640px)')

  // Toggle language function
  const toggleLanguage = useCallback(() => {
    if (i18n.language.startsWith('zh')) {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('zh-Hans')
    }
  }, [])

  // Toggle running state function
  const toggleRunning = useCallback(() => {
    if (generalQuery?.general.dae.running !== undefined) {
      runMutation.mutate(!generalQuery.general.dae.running)
    }
  }, [generalQuery, runMutation])

  // Reload configuration function
  const reloadConfig = useCallback(() => {
    if (generalQuery?.general.dae.modified) {
      runMutation.mutate(false)
    }
  }, [generalQuery, runMutation])

  // Command palette actions
  const commandPaletteActions = useCommandPaletteActions({
    cycleThemeMode,
    toggleLanguage,
    toggleRunning,
    reloadConfig,
    openShortcutsModal,
    themeMode,
    isModified: generalQuery?.general.dae.modified ?? false,
  })

  // Keyboard shortcuts (only for non-command palette shortcuts)
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: '?',
        action: openShortcutsModal,
        description: 'Show keyboard shortcuts',
      },
      {
        key: 'd',
        ctrl: true,
        action: cycleThemeMode,
        description: 'Toggle theme',
      },
      {
        key: 'l',
        ctrl: true,
        action: toggleLanguage,
        description: 'Toggle language',
      },
      {
        key: 's',
        ctrl: true,
        action: toggleRunning,
        description: 'Toggle running state',
      },
      {
        key: 'r',
        ctrl: true,
        action: reloadConfig,
        description: 'Reload configuration',
        disabled: !generalQuery?.general.dae.modified,
      },
      {
        key: 'Escape',
        action: () => {
          closeShortcutsModal()
          closeCommandPalette()
          closeAccountSettingsFormModal()
          closePasswordChangeModal()
          closeBurger()
        },
        description: 'Close modals',
      },
    ],
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = accountSettingsSchema.safeParse(formData)

    if (!result.success) {
      const errors: typeof formErrors = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof formErrors
        errors[path] = issue.message
      })
      setFormErrors(errors)

      return
    }

    if (formData.username !== userQuery?.user?.username) {
      await updateUsernameMutation.mutateAsync(formData.username)
    }

    if (formData.name !== userQuery?.user?.name) {
      await updateNameMutation.mutateAsync(formData.name)
    }

    if (uploadingAvatarBase64 && uploadingAvatarBase64 !== userQuery?.user?.avatar) {
      await updateAvatarMutation.mutateAsync(uploadingAvatarBase64)
    }

    closeAccountSettingsFormModal()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const avatarBase64 = await fileToBase64(file)
      setUploadingAvatarBase64(avatarBase64)
    }
  }

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = passwordChangeSchema.safeParse(passwordFormData)

    if (!result.success) {
      const errors: typeof passwordFormErrors = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof passwordFormErrors
        errors[path] = issue.message
      })
      setPasswordFormErrors(errors)

      return
    }

    try {
      const response = await updatePasswordMutation.mutateAsync({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      })

      // Update token with the new one
      if (response && typeof response === 'object' && 'updatePassword' in response) {
        const token = (response as { updatePassword: string }).updatePassword
        tokenAtom.set(token)
      }

      setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordFormErrors({})
      closePasswordChangeModal()
    } catch {
      setPasswordFormErrors({ currentPassword: t('password.current.incorrect') })
    }
  }

  return (
    <header className="sticky top-0 z-50 h-[60px] border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <img src="/logo.webp" alt="daed" className="w-8 h-8 rounded-sm" />
            <h1 className={cn('font-bold', matchSmallScreen ? 'text-lg' : 'text-2xl')}>daed</h1>
          </Link>

          {!matchSmallScreen && (
            <SimpleTooltip label={endpointURL}>
              <Code className="text-xs font-bold">{import.meta.env.APP_VERSION}</Code>
            </SimpleTooltip>
          )}
        </div>

        <div className={cn('flex items-center', matchSmallScreen ? 'gap-1' : 'gap-3')}>
          {!matchSmallScreen && <ProfileSwitcher />}

          <DropdownMenu open={userMenuOpened} onOpenChange={setUserMenuOpened}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent',
                  userMenuOpened && 'bg-accent',
                )}
              >
                <Avatar
                  src={userQuery?.user?.avatar || 'https://avatars.githubusercontent.com/u/126714249?s=200&v=4'}
                  alt="avatar"
                  size={20}
                />
                <span className="text-sm font-medium leading-none">
                  {userQuery?.user?.name || userQuery?.user?.username || 'unknown'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>{t('debug')}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/graphiql" target="_blank">
                  GraphiQL
                </Link>
              </DropdownMenuItem>

              <DropdownMenuLabel>{t('settings')}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setFormData({
                    username: userQuery?.user?.username || '',
                    name: userQuery?.user?.name || '',
                  })
                  setFormErrors({})
                  openAccountSettingsFormModal()
                }}
              >
                <UserPen className="mr-2 h-4 w-4" />
                {t('account settings')}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordFormErrors({})
                  openPasswordChangeModal()
                }}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {t('password.change')}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => tokenAtom.set('')}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('actions.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {matchSmallScreen ? (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleBurger}>
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <Fragment>
              <SimpleTooltip label="GitHub">
                <a href="https://github.com/daeuniverse/daed" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Github className="h-5 w-5" />
                  </Button>
                </a>
              </SimpleTooltip>

              <SimpleTooltip label={t('shortcuts.title')}>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={openShortcutsModal}>
                  <Keyboard className="h-5 w-5" />
                </Button>
              </SimpleTooltip>

              <SimpleTooltip label={t('actions.switchLanguage')}>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleLanguage}>
                  <Languages className="h-5 w-5" />
                </Button>
              </SimpleTooltip>

              <ThemePicker />
            </Fragment>
          )}

          {generalQuery?.general.dae.modified && (
            <SimpleTooltip label={t('actions.reload')}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                loading={runMutation.isPending}
                onClick={() => runMutation.mutateAsync(false)}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </SimpleTooltip>
          )}

          <SimpleTooltip label={t('actions.switchRunning')}>
            <Switch
              size={matchSmallScreen ? 'xs' : 'md'}
              onLabel={<Wifi className="h-3 w-3" />}
              offLabel={<CloudOff className="h-3 w-3" />}
              disabled={!generalQuery?.general.dae.running && runMutation.isPending}
              checked={generalQuery?.general.dae.running ?? false}
              onCheckedChange={(checked) => {
                runMutation.mutateAsync(!checked)
              }}
            />
          </SimpleTooltip>
        </div>
      </div>

      <Sheet open={openedBurger} onOpenChange={closeBurger}>
        <SheetContent side="right" size="full">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4 mt-8">
            <div className="mb-2">
              <ProfileSwitcher />
            </div>

            <a href="https://github.com/daeuniverse/daed" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Github className="h-5 w-5" />
                GitHub
              </Button>
            </a>

            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => {
                openShortcutsModal()
                closeBurger()
              }}
            >
              <Keyboard className="h-5 w-5" />
              {t('shortcuts.title')}
            </Button>

            <Button variant="outline" className="w-full justify-start gap-3" onClick={toggleLanguage}>
              <Languages className="h-5 w-5" />
              {t('actions.switchLanguage')}
            </Button>

            <ThemePicker variant="button" />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={openedAccountSettingsFormModal} onOpenChange={closeAccountSettingsFormModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('account settings')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <Input
                label={t('username')}
                withAsterisk
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                error={formErrors.username}
              />

              <Input
                label={t('display name')}
                withAsterisk
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
              />

              <div className="flex justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-dashed border-muted-foreground hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingAvatarBase64 || userQuery?.user?.avatar ? (
                    <img
                      src={uploadingAvatarBase64 || userQuery?.user?.avatar || undefined}
                      alt={t('avatar')}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Avatar className="w-full h-full" />
                  )}
                </button>
              </div>

              <FormActions
                reset={() => {
                  setUploadingAvatarBase64(null)
                  setFormData({
                    username: userQuery?.user?.username || '',
                    name: userQuery?.user?.name || '',
                  })

                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                isDirty={
                  formData.username !== (userQuery?.user?.username || '') ||
                  formData.name !== (userQuery?.user?.name || '') ||
                  (uploadingAvatarBase64 !== null && uploadingAvatarBase64 !== userQuery?.user?.avatar)
                }
                isValid={formData.username.length >= 1 && formData.name.length >= 1}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openedPasswordChangeModal} onOpenChange={closePasswordChangeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('password.change')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChangeSubmit}>
            <div className="space-y-4">
              <Input
                type="password"
                label={t('password.current')}
                placeholder={t('password.current.placeholder')}
                value={passwordFormData.currentPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                error={passwordFormErrors.currentPassword}
              />
              <Input
                type="password"
                label={t('password.new')}
                placeholder={t('password.new.placeholder')}
                value={passwordFormData.newPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                error={passwordFormErrors.newPassword}
              />
              <Input
                type="password"
                label={t('password.confirm')}
                placeholder={t('password.confirm.placeholder')}
                value={passwordFormData.confirmPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                error={passwordFormErrors.confirmPassword}
              />
              <Button type="submit" className="w-full" loading={updatePasswordMutation.isPending}>
                {t('password.update')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <KeyboardShortcutsModal opened={openedShortcutsModal} onClose={closeShortcutsModal} />

      <CommandPalette
        open={openedCommandPalette}
        onOpenChange={(open) => (open ? openCommandPalette() : closeCommandPalette())}
        actions={commandPaletteActions}
      />
    </header>
  )
}
