import type { Profile } from '~/store'
import { useStore } from '@nanostores/react'
import { BookmarkPlus, Check, ChevronDown, Layers, Pencil, RefreshCw, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import {
  useConfigsQuery,
  useDNSsQuery,
  useRoutingsQuery,
  useSelectConfigMutation,
  useSelectDNSMutation,
  useSelectRoutingMutation,
} from '~/apis'
import { cn } from '~/lib/utils'
import { profilesAtom } from '~/store'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'

function generateProfileId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function ProfileSwitcher() {
  const { t } = useTranslation()
  const profilesState = useStore(profilesAtom)
  const { profiles, currentProfileID } = profilesState

  const { data: configsQuery } = useConfigsQuery()
  const { data: routingsQuery } = useRoutingsQuery()
  const { data: dnssQuery } = useDNSsQuery()

  const selectConfigMutation = useSelectConfigMutation()
  const selectRoutingMutation = useSelectRoutingMutation()
  const selectDNSMutation = useSelectDNSMutation()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)

  // Get current selected resources
  const selectedConfig = configsQuery?.configs.find((c) => c.selected)
  const selectedRouting = routingsQuery?.routings.find((r) => r.selected)
  const selectedDNS = dnssQuery?.dnss.find((d) => d.selected)

  const currentProfile = profiles.find((p) => p.id === currentProfileID)

  const handleSaveProfile = () => {
    if (!profileName.trim()) return
    if (!selectedConfig || !selectedRouting || !selectedDNS) {
      toast.error(t('please select a config first'))
      return
    }

    const now = Date.now()
    const newProfile: Profile = {
      id: generateProfileId(),
      name: profileName.trim(),
      configID: selectedConfig.id,
      routingID: selectedRouting.id,
      dnsID: selectedDNS.id,
      createdAt: now,
      updatedAt: now,
    }

    profilesAtom.set({
      profiles: [...profiles, newProfile],
      currentProfileID: newProfile.id,
    })

    setProfileName('')
    setSaveDialogOpen(false)
    toast.success(t('profile.saveSuccess'))
  }

  const handleSwitchProfile = async (profile: Profile) => {
    setIsSwitching(true)
    setDropdownOpen(false)

    try {
      // Check if the resources still exist
      const configExists = configsQuery?.configs.some((c) => c.id === profile.configID)
      const routingExists = routingsQuery?.routings.some((r) => r.id === profile.routingID)
      const dnsExists = dnssQuery?.dnss.some((d) => d.id === profile.dnsID)

      if (!configExists || !routingExists || !dnsExists) {
        toast.error('Some resources in this profile no longer exist')
        return
      }

      // Switch to the profile's resources
      await Promise.all([
        selectConfigMutation.mutateAsync({ id: profile.configID }),
        selectRoutingMutation.mutateAsync({ id: profile.routingID }),
        selectDNSMutation.mutateAsync({ id: profile.dnsID }),
      ])

      profilesAtom.set({
        ...profilesState,
        currentProfileID: profile.id,
      })

      toast.success(t('profile.switchSuccess'))
    } catch {
      toast.error('Failed to switch profile')
    } finally {
      setIsSwitching(false)
    }
  }

  const handleUpdateProfile = () => {
    if (!currentProfile) return
    if (!selectedConfig || !selectedRouting || !selectedDNS) return

    const updatedProfiles = profiles.map((p) =>
      p.id === currentProfile.id
        ? {
            ...p,
            configID: selectedConfig.id,
            routingID: selectedRouting.id,
            dnsID: selectedDNS.id,
            updatedAt: Date.now(),
          }
        : p,
    )

    profilesAtom.set({
      ...profilesState,
      profiles: updatedProfiles,
    })

    toast.success(t('profile.updateSuccess'))
  }

  const handleRenameProfile = () => {
    if (!editingProfile || !profileName.trim()) return

    const updatedProfiles = profiles.map((p) =>
      p.id === editingProfile.id
        ? {
            ...p,
            name: profileName.trim(),
            updatedAt: Date.now(),
          }
        : p,
    )

    profilesAtom.set({
      ...profilesState,
      profiles: updatedProfiles,
    })

    setProfileName('')
    setEditingProfile(null)
    setRenameDialogOpen(false)
    toast.success(t('profile.updateSuccess'))
  }

  const handleDeleteProfile = () => {
    if (!editingProfile) return

    const updatedProfiles = profiles.filter((p) => p.id !== editingProfile.id)
    const newCurrentID = currentProfileID === editingProfile.id ? null : currentProfileID

    profilesAtom.set({
      profiles: updatedProfiles,
      currentProfileID: newCurrentID,
    })

    setEditingProfile(null)
    setDeleteDialogOpen(false)
    toast.success(t('profile.deleteSuccess'))
  }

  const openRenameDialog = (profile: Profile) => {
    setEditingProfile(profile)
    setProfileName(profile.name)
    setRenameDialogOpen(true)
    setDropdownOpen(false)
  }

  const openDeleteDialog = (profile: Profile) => {
    setEditingProfile(profile)
    setDeleteDialogOpen(true)
    setDropdownOpen(false)
  }

  // Check if current settings match the current profile
  const isCurrentSettingsModified =
    currentProfile &&
    (currentProfile.configID !== selectedConfig?.id ||
      currentProfile.routingID !== selectedRouting?.id ||
      currentProfile.dnsID !== selectedDNS?.id)

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'gap-2 min-w-[140px] justify-between',
              isCurrentSettingsModified && 'border-amber-500/50 text-amber-500',
            )}
            disabled={isSwitching}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="truncate max-w-[100px]">{currentProfile?.name || t('profile.default')}</span>
              {isCurrentSettingsModified && <span className="text-xs">*</span>}
            </div>
            {isSwitching ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            {t('profile.title')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {profiles.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">{t('profile.noProfiles')}</div>
          ) : (
            profiles.map((profile) => (
              <DropdownMenuItem
                key={profile.id}
                className="flex items-center justify-between group cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 flex-1 text-left"
                  onClick={() => handleSwitchProfile(profile)}
                >
                  {profile.id === currentProfileID ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <div className="w-4" />
                  )}
                  <span className="truncate">{profile.name}</span>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      openRenameDialog(profile)
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteDialog(profile)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />

          {currentProfile && isCurrentSettingsModified && (
            <DropdownMenuItem onClick={handleUpdateProfile}>
              <Save className="h-4 w-4 mr-2" />
              {t('profile.update')}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              setProfileName('')
              setSaveDialogOpen(true)
              setDropdownOpen(false)
            }}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            {t('profile.save')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Profile Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.save')}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveProfile()
            }}
          >
            <div className="space-y-4">
              <Input
                label={t('profile.name')}
                placeholder={t('profile.namePlaceholder')}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                autoFocus
              />
              <div className="text-sm text-muted-foreground">
                {t('profile.saveCurrentAs')}:
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  <li>Config: {selectedConfig?.name || '-'}</li>
                  <li>Routing: {selectedRouting?.name || '-'}</li>
                  <li>DNS: {selectedDNS?.name || '-'}</li>
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={!profileName.trim()}>
                  {t('actions.save dae')}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Profile Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.rename')}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleRenameProfile()
            }}
          >
            <div className="space-y-4">
              <Input
                label={t('profile.name')}
                placeholder={t('profile.namePlaceholder')}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setRenameDialogOpen(false)}>
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={!profileName.trim()}>
                  {t('actions.confirm')}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('profile.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('profile.confirmDelete')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('confirmModal.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile}>{t('confirmModal.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
