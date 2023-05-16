import { Flex, Group, Image, NavLink, Navbar } from '@mantine/core'
import { useStore } from '@nanostores/react'
import {
  IconLanguage,
  IconLogout,
  IconMap,
  IconRoute,
  IconSubtask,
  IconTable,
  IconUsersGroup,
} from '@tabler/icons-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { ColorSchemeToggle } from '~/components/ColorSchemeToggle'
import { i18n } from '~/i18n'
import { endpointURLAtom, tokenAtom } from '~/store'

export const MainLayout = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = useStore(tokenAtom)
  const endpointURL = useStore(endpointURLAtom)

  const navLinks = [
    { link: '/node', label: t('node'), icon: <IconSubtask /> },
    { link: '/subscription', label: t('subscription'), icon: <IconTable /> },
    { link: '/dns', label: t('dns'), icon: <IconRoute /> },
    { link: '/routing', label: t('routing'), icon: <IconMap /> },
    { link: '/group', label: t('group'), icon: <IconUsersGroup /> },
  ]

  useEffect(() => {
    if (!endpointURL || !token) {
      navigate('/setup')
    }
  }, [endpointURL, navigate, token])

  return (
    <Flex h="100%">
      <Navbar h="100%" w={240}>
        <Navbar.Section py={20} px={10} className="border-b border-gray-300">
          <Group position="apart">
            <Link to="/">
              <Image width={40} radius={4} src="/logo.svg" alt="logo" />
            </Link>

            <ColorSchemeToggle />
          </Group>
        </Navbar.Section>

        <Navbar.Section grow>
          {navLinks.map((navLink) => (
            <NavLink
              component={Link}
              key={navLink.label}
              label={navLink.label}
              icon={navLink.icon}
              to={navLink.link}
              active={location.pathname === navLink.link}
            />
          ))}
        </Navbar.Section>

        <Navbar.Section py={20} px={10} className="border-t border-gray-300">
          <NavLink
            label={t('actions.switchLanguage')}
            icon={<IconLanguage />}
            onClick={() => {
              if (i18n.language.startsWith('zh')) {
                i18n.changeLanguage('en')
              } else {
                i18n.changeLanguage('zh-Hans')
              }
            }}
          />
          <NavLink
            label={t('actions.logout')}
            icon={<IconLogout />}
            onClick={() => {
              endpointURLAtom.set('')
              tokenAtom.set('')

              navigate('/setup')
            }}
          />
        </Navbar.Section>
      </Navbar>

      <main className="flex-1 overflow-hidden p-4">
        <Outlet />
      </main>
    </Flex>
  )
}
