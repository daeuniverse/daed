import { useColorMode } from '@daed/components'
import { i18n } from '@daed/i18n'
import { graphql } from '@daed/schemas/gql'
import { Clear, Cloud, CloudOff, DarkMode, LightMode, Translate } from '@mui/icons-material'
import { Button, IconButton, Stack, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { QUERY_KEY_RUNNING } from '~/constants'
import { useQGLQueryClient } from '~/contexts'
import { endpointURLAtom } from '~/store'

export const Sidebar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const gqlClient = useQGLQueryClient()
  const { colorMode, toggleColorMode } = useColorMode()

  const isRunningQuery = useQuery({
    queryKey: QUERY_KEY_RUNNING,
    queryFn: async () =>
      gqlClient.request(
        graphql(`
          query Running {
            general {
              dae {
                running
              }
            }
          }
        `)
      ),
  })

  const switchLanguage = () => {
    if (i18n.language.startsWith('zh')) {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('zh-Hans')
    }
  }

  const platform = useRef<HTMLDivElement>(null)
  const dae = useRef<HTMLImageElement>(null)
  const [showSave, setShowSave] = useState(false)
  const x = useMotionValue(0)
  const y = useSpring(0)

  useMotionValueEvent(y, 'change', (latest) => {
    const platformBottomLimit = platform.current?.clientHeight
    const daeHeight = dae.current?.clientHeight

    if (!platformBottomLimit || !daeHeight) {
      return
    }

    setShowSave(latest >= platformBottomLimit - daeHeight)
  })

  return (
    <Stack ref={platform} height="100%" alignItems="center" justifyContent="center" overflow="hidden">
      <motion.div
        drag
        style={{
          x,
          y,
          width: '100%',
          height: showSave ? 0 : 'auto',
          zIndex: 1,
          lineHeight: 0,
          touchAction: 'none',
          cursor: 'pointer',
        }}
        dragConstraints={{ left: 0, right: 0, top: 0 }}
        onClick={() => navigate('/')}
      >
        <img ref={dae} draggable={false} src="/logo.svg" alt="logo" />
      </motion.div>

      <Stack spacing={2}>
        <Button size="large" variant="contained" onClick={() => navigate('/node')}>
          {t('node')}
        </Button>

        <Button size="large" variant="contained" onClick={() => navigate('/config')}>
          {t('config')}
        </Button>

        <Button size="large" variant="contained" onClick={() => navigate('/routing')}>
          {t('routing')}
        </Button>

        <Button size="large" variant="contained" onClick={() => navigate('/dns')}>
          {t('dns')}
        </Button>
      </Stack>

      <Stack spacing={2} flex={1} justifyContent="end">
        <Tooltip title={t('actions.change endpoint')} placement="right">
          <IconButton
            onClick={() => {
              endpointURLAtom.set('')
            }}
          >
            <Clear />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('actions.switchRunning')} placement="right">
          <IconButton
            onClick={() => {
              //
            }}
          >
            {isRunningQuery.data?.general.dae.running ? <Cloud /> : <CloudOff />}
          </IconButton>
        </Tooltip>

        <Tooltip title={t('actions.switchLanguage')} placement="right">
          <IconButton onClick={switchLanguage}>
            <Translate />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('actions.switchTheme')} placement="right">
          <IconButton onClick={toggleColorMode}>{colorMode === 'dark' ? <DarkMode /> : <LightMode />}</IconButton>
        </Tooltip>

        {showSave && <Button onClick={() => y.jump(0)}>{t('actions.save dae')}</Button>}
      </Stack>
    </Stack>
  )
}
