import { useStore } from '@nanostores/react'
import {
  ChevronDown,
  CloudOff,
  Github,
  KeyRound,
  Languages,
  LogOut,
  Menu,
  Moon,
  RefreshCw,
  Sun,
  UserPen,
  Wifi,
} from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import {
  useGeneralQuery,
  useRunMutation,
  useUpdateAvatarMutation,
  useUpdateNameMutation,
  useUpdatePasswordMutation,
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
import { useDisclosure, useMediaQuery } from '~/hooks'
import { i18n } from '~/i18n'
import { cn } from '~/lib/utils'
import { endpointURLAtom, tokenAtom } from '~/store'
import { fileToBase64 } from '~/utils'

import { FormActions } from './FormActions'

const accountSettingsSchema = z.object({
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
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [openedBurger, { toggle: toggleBurger, close: closeBurger }] = useDisclosure(false)
  const [openedAccountSettingsFormModal, { open: openAccountSettingsFormModal, close: closeAccountSettingsFormModal }] =
    useDisclosure(false)
  const [openedPasswordChangeModal, { open: openPasswordChangeModal, close: closePasswordChangeModal }] =
    useDisclosure(false)
  const { data: userQuery } = useUserQuery()
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()
  const updateNameMutation = useUpdateNameMutation()
  const updatePasswordMutation = useUpdatePasswordMutation()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const [uploadingAvatarBase64, setUploadingAvatarBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ name: '' })
  const [formErrors, setFormErrors] = useState<{ name?: string }>({})
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = accountSettingsSchema.safeParse(formData)

    if (!result.success) {
      setFormErrors({ name: result.error.issues[0]?.message })

      return
    }

    if (formData.name !== userQuery?.user.name) {
      await updateNameMutation.mutateAsync(formData.name)
    }

    if (uploadingAvatarBase64 && uploadingAvatarBase64 !== userQuery?.user.avatar) {
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
                  src={userQuery?.user.avatar || 'https://avatars.githubusercontent.com/u/126714249?s=200&v=4'}
                  alt="avatar"
                  size={20}
                />
                <span className="text-sm font-medium leading-none">
                  {userQuery?.user.name || userQuery?.user.username || 'unknown'}
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
                  setFormData({ name: userQuery?.user.name || '' })
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
            <Button variant="ghost" size="icon" onClick={toggleBurger}>
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <Fragment>
              <a href="https://github.com/daeuniverse/daed" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </a>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (i18n.language.startsWith('zh')) {
                    i18n.changeLanguage('en')
                  } else {
                    i18n.changeLanguage('zh-Hans')
                  }
                }}
              >
                <Languages className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => toggleColorScheme()}>
                {colorScheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </Fragment>
          )}

          {generalQuery?.general.dae.modified && (
            <SimpleTooltip label={t('actions.reload')}>
              <Button
                variant="ghost"
                size="icon"
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
                if (i18n.language.startsWith('zh')) {
                  i18n.changeLanguage('en')
                } else {
                  i18n.changeLanguage('zh-Hans')
                }
              }}
            >
              <Languages className="h-5 w-5" />
              {t('actions.switchLanguage')}
            </Button>

            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => toggleColorScheme()}>
              {colorScheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {t('actions.switchTheme')}
            </Button>
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
                  {uploadingAvatarBase64 || userQuery?.user.avatar ? (
                    <img
                      src={uploadingAvatarBase64 || userQuery?.user.avatar || undefined}
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
                  setFormData({ name: userQuery?.user.name || '' })

                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                isDirty={
                  formData.name !== (userQuery?.user.name || '') ||
                  (uploadingAvatarBase64 !== null && uploadingAvatarBase64 !== userQuery?.user.avatar)
                }
                isValid={formData.name.length >= 1}
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
    </header>
  )
}
