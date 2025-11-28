import { useStore } from '@nanostores/react'
import {
  ChevronDown,
  CloudOff,
  Github,
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

import { useGeneralQuery, useRunMutation, useUpdateAvatarMutation, useUpdateNameMutation, useUserQuery } from '~/apis'
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
import { Sheet, SheetContent } from '~/components/ui/sheet'
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

export const HeaderWithActions = () => {
  const { t } = useTranslation()
  const endpointURL = useStore(endpointURLAtom)
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [userMenuOpened, setUserMenuOpened] = useState(false)
  const [openedBurger, { toggle: toggleBurger, close: closeBurger }] = useDisclosure(false)
  const [openedAccountSettingsFormModal, { open: openAccountSettingsFormModal, close: closeAccountSettingsFormModal }] =
    useDisclosure(false)
  const { data: userQuery } = useUserQuery()
  const { data: generalQuery } = useGeneralQuery()
  const runMutation = useRunMutation()
  const updateNameMutation = useUpdateNameMutation()
  const updateAvatarMutation = useUpdateAvatarMutation()
  const [uploadingAvatarBase64, setUploadingAvatarBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({ name: '' })
  const [formErrors, setFormErrors] = useState<{ name?: string }>({})

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

  return (
    <header className="sticky top-0 z-50 h-[60px] border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <img src="/logo.webp" alt="daed" className="w-8 h-8 rounded-sm" />
            <h1 className={cn('font-bold', matchSmallScreen ? 'text-lg' : 'text-2xl')}>daed</h1>
          </Link>

          {!matchSmallScreen && (
            <SimpleTooltip label={endpointURL}>
              <Code className="text-xs font-bold">{generalQuery?.general.dae.version}</Code>
            </SimpleTooltip>
          )}
        </div>

        <div className={cn('flex items-center', matchSmallScreen ? 'gap-1' : 'gap-3')}>
          <DropdownMenu open={userMenuOpened} onOpenChange={setUserMenuOpened}>
            <DropdownMenuTrigger asChild>
              <button
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
              checked={generalQuery?.general.dae.running}
              onCheckedChange={(checked) => {
                runMutation.mutateAsync(!checked)
              }}
            />
          </SimpleTooltip>
        </div>
      </div>

      <Sheet open={openedBurger} onOpenChange={closeBurger}>
        <SheetContent side="right" size="full">
          <div className="grid grid-cols-3 gap-4 mt-8">
            <a href="https://github.com/daeuniverse/daed" target="_blank" rel="noopener noreferrer">
              <Button className="w-full uppercase">Github</Button>
            </a>

            <Button
              className="w-full uppercase"
              onClick={() => {
                if (i18n.language.startsWith('zh')) {
                  i18n.changeLanguage('en')
                } else {
                  i18n.changeLanguage('zh-Hans')
                }
              }}
            >
              {t('actions.switchLanguage')}
            </Button>

            <Button className="w-full uppercase" onClick={() => toggleColorScheme()}>
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
                  {uploadingAvatarBase64 ? (
                    <img src={uploadingAvatarBase64} alt={t('avatar')} className="w-full h-full object-cover" />
                  ) : (
                    <Avatar className="w-full h-full" />
                  )}
                </button>
              </div>

              <FormActions
                reset={() => {
                  setUploadingAvatarBase64(null)

                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}
