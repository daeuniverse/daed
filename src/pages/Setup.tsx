import { useStore } from '@nanostores/react'
import request from 'graphql-request'
import { Link2, LockKeyhole, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { DEFAULT_ENDPOINT_URL } from '~/constants'
import { cn } from '~/lib/utils'
import { graphql } from '~/schemas/gql'
import { endpointURLAtom, tokenAtom } from '~/store'

const endpointURLSchema = z.object({
  endpointURL: z.string().url().min(1),
})

const signupSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
})

const loginSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
})

async function getNumberUsers(endpointURL: string) {
  const { numberUsers } = await request(
    endpointURL,
    graphql(`
      query NumberUsers {
        numberUsers
      }
    `),
  )

  return numberUsers
}

export function SetupPage() {
  const { t } = useTranslation()

  const [active, setActive] = useState(0)
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const [numberUsers, setNumberUsers] = useState(0)

  const defaultEndpointURL = useStore(endpointURLAtom)

  const [endpointFormData, setEndpointFormData] = useState({ endpointURL: defaultEndpointURL })
  const [endpointFormErrors, setEndpointFormErrors] = useState<{ endpointURL?: string }>({})

  const [signupFormData, setSignupFormData] = useState({ username: '', password: '' })
  const [signupFormErrors, setSignupFormErrors] = useState<{ username?: string; password?: string }>({})

  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' })
  const [loginFormErrors, setLoginFormErrors] = useState<{ username?: string; password?: string }>({})

  const handleEndpointURLSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = endpointURLSchema.safeParse(endpointFormData)

    if (!result.success) {
      const errors: { endpointURL?: string } = {}

      result.error.issues.forEach((err) => {
        errors[err.path[0] as 'endpointURL'] = err.message
      })
      setEndpointFormErrors(errors)

      return
    }

    endpointURLAtom.set(endpointFormData.endpointURL)

    try {
      const numberUsers = await getNumberUsers(endpointFormData.endpointURL)

      setNumberUsers(numberUsers)

      nextStep()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = signupSchema.safeParse(signupFormData)

    if (!result.success) {
      const errors: { username?: string; password?: string } = {}

      result.error.issues.forEach((err) => {
        errors[err.path[0] as 'username' | 'password'] = err.message
      })
      setSignupFormErrors(errors)

      return
    }

    const { username, password } = signupFormData

    try {
      await request(
        endpointFormData.endpointURL,
        graphql(`
          mutation CreateUser($username: String!, $password: String!) {
            createUser(username: $username, password: $password)
          }
        `),
        {
          username,
          password,
        },
      )

      const numberUsers = await getNumberUsers(endpointFormData.endpointURL)

      setNumberUsers(numberUsers)
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = loginSchema.safeParse(loginFormData)

    if (!result.success) {
      const errors: { username?: string; password?: string } = {}

      result.error.issues.forEach((err) => {
        errors[err.path[0] as 'username' | 'password'] = err.message
      })
      setLoginFormErrors(errors)

      return
    }

    const { username, password } = loginFormData

    try {
      const { token } = await request(
        endpointFormData.endpointURL,
        graphql(`
          query Token($username: String!, $password: String!) {
            token(username: $username, password: $password)
          }
        `),
        {
          username,
          password,
        },
      )

      toast.success(t('notifications.login succeeded'))

      tokenAtom.set(token)

      nextStep()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const steps: { label: string; description: string }[] = [
    { label: `${t('step')} 1`, description: t('setup endpoint') },
    { label: `${t('step')} 2`, description: t('login account') },
    { label: t('actions.confirm'), description: '' },
  ]

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <h1 className="text-center text-3xl font-bold">{t('welcome to', { name: 'daed' })}</h1>
        <p className="text-center text-muted-foreground">
          {t('what for')}{' '}
          <a
            target="_blank"
            href="https://github.com/daeuniverse/dae"
            className="text-primary hover:underline"
            rel="noreferrer"
          >
            dae
          </a>
        </p>

        <div className="h-5" />

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex w-28 flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium',
                    index < active && 'border-primary bg-primary text-primary-foreground',
                    index === active && 'border-primary text-primary',
                    index > active && 'border-muted text-muted-foreground',
                  )}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium">{step.label}</div>
                  <div className="h-4 text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn('mb-8 h-0.5 w-8', index < active ? 'bg-primary' : 'bg-muted')} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {active === 0 && (
          <form onSubmit={handleEndpointURLSubmit}>
            <div className="mx-auto w-full max-w-md space-y-4">
              <Input
                label={t('endpointURL')}
                placeholder={DEFAULT_ENDPOINT_URL}
                withAsterisk
                value={endpointFormData.endpointURL}
                onChange={(e) => setEndpointFormData({ endpointURL: e.target.value })}
                error={endpointFormErrors.endpointURL}
                icon={<Link2 className="h-4 w-4" />}
              />

              <Button type="submit" className="w-full" uppercase>
                {t('actions.continue')}
              </Button>
            </div>
          </form>
        )}

        {active === 1 && numberUsers === 0 && (
          <form onSubmit={handleSignupSubmit}>
            <div className="mx-auto w-full max-w-md space-y-4">
              <Input
                label={t('username')}
                placeholder="admin"
                withAsterisk
                value={signupFormData.username}
                onChange={(e) => setSignupFormData({ ...signupFormData, username: e.target.value })}
                error={signupFormErrors.username}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                type="password"
                label={t('password')}
                placeholder="password"
                withAsterisk
                value={signupFormData.password}
                onChange={(e) => setSignupFormData({ ...signupFormData, password: e.target.value })}
                error={signupFormErrors.password}
                icon={<LockKeyhole className="h-4 w-4" />}
              />
              <Button type="submit" className="w-full" uppercase>
                {t('actions.create account')}
              </Button>
            </div>
          </form>
        )}

        {active === 1 && numberUsers > 0 && (
          <form onSubmit={handleLoginSubmit}>
            <div className="mx-auto w-full max-w-md space-y-4">
              <Input
                label={t('username')}
                placeholder="admin"
                withAsterisk
                value={loginFormData.username}
                onChange={(e) => setLoginFormData({ ...loginFormData, username: e.target.value })}
                error={loginFormErrors.username}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                type="password"
                label={t('password')}
                placeholder="password"
                withAsterisk
                value={loginFormData.password}
                onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
                error={loginFormErrors.password}
                icon={<LockKeyhole className="h-4 w-4" />}
              />
              <Button type="submit" className="w-full" uppercase>
                {t('actions.login')}
              </Button>
            </div>
          </form>
        )}

        {active === 2 && (
          <>
            <div className="h-5" />

            <div className="flex justify-center">
              <Button asChild>
                <Link to="/">
                  <h3 className="text-lg font-semibold">{t('actions.start your journey')}</h3>
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
