import { Button, LinearProgress, Stack } from '@mui/material'
import { useStore } from '@nanostores/react'
import { useIsFetching } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import { ImportFormDialog } from '~/components/ImportFormDialog'
import { Sidebar } from '~/components/Sidebar'
import { MODE } from '~/constants'
import { NodeList } from '~/pages/Node'
import { modeAtom } from '~/store'

export const Home = () => {
  const { t } = useTranslation()
  const fetching = useIsFetching()
  const [showImportModal, setShowImportModal] = useState(false)
  const mode = useStore(modeAtom)

  return (
    <Stack direction="row" height="100dvh" p={2} gap={2} position="relative">
      {fetching > 0 && <LinearProgress sx={{ position: 'absolute', top: 4, insetInline: 16 }} />}

      <Sidebar />

      <Stack flex={1}>
        <Stack alignItems="end">
          <Button variant="outlined" onClick={() => setShowImportModal(true)}>
            {t('actions.import')}
          </Button>
        </Stack>

        {mode === MODE.simple ? <NodeList /> : <Outlet />}
      </Stack>

      <ImportFormDialog open={showImportModal} close={() => setShowImportModal(false)} />
    </Stack>
  )
}
