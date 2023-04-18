import { FormDialog, GrowableInputListHandle } from '@daed/components'
import { ImportArgument } from '@daed/schemas/gql/graphql'
import { Add, Remove } from '@mui/icons-material'
import { Avatar, Button, IconButton, Stack, Tab, Tabs, TextField, TextFieldProps } from '@mui/material'
import { useStore } from '@nanostores/react'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useGroupAddNodesMutation, useImportNodesMutation, useImportSubscriptionsMutation } from '~/apis'
import { TabPanel } from '~/components/TabPanel'
import { MODE } from '~/constants'
import { defaultResourcesAtom, modeAtom } from '~/store'

export type FormValues = {
  nodes: ImportArgument[]
  subscriptions: ImportArgument[]
}

const GrowableArgumentsInput = ({
  inc,
  dec,
  linkProps,
  tagProps,
}: {
  inc: () => void
  dec: () => void
  linkProps: TextFieldProps
  tagProps: TextFieldProps
}) => {
  const { t } = useTranslation()

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        sx={{
          flex: 1,
        }}
        autoFocus
        InputProps={{
          endAdornment: (
            <Stack direction="row">
              <IconButton onClick={inc}>
                <Add />
              </IconButton>
              <IconButton onClick={dec}>
                <Remove />
              </IconButton>
            </Stack>
          ),
        }}
        label={t('link')}
        required
        {...linkProps}
      />

      <TextField
        sx={{
          flexBasis: 100,
        }}
        label={t('tag')}
        {...tagProps}
      />
    </Stack>
  )
}

export const ImportFormDialog = ({ open, close }: { open: boolean; close: () => void }) => {
  const { t } = useTranslation()
  const mode = useStore(modeAtom)
  const form = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      nodes: [],
      subscriptions: [],
    },
  })
  const {
    register,
    control,
    formState: { isSubmitSuccessful },
  } = form

  const nodeArgumentsForm = useFieldArray({
    name: 'nodes',
    control,
  })

  const subscriptionArgumentsForm = useFieldArray({
    name: 'subscriptions',
    control,
  })

  const subscriptionsGrowableInputListRef = useRef<GrowableInputListHandle>(null)

  useEffect(() => {
    if (isSubmitSuccessful) {
      subscriptionsGrowableInputListRef.current && subscriptionsGrowableInputListRef.current.reset()
    }
  }, [isSubmitSuccessful])

  const importNodesMutation = useImportNodesMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()
  const groupAddNodesMutation = useGroupAddNodesMutation()
  const defaultGroupID = useStore(defaultResourcesAtom).defaultGroupID

  const [curTab, setCurTab] = useState<'node' | 'subscription'>('node')

  return (
    <FormDialog
      form={form}
      title={t('actions.import')}
      open={open}
      close={close}
      onSubmit={async (form) => {
        const values = form.getValues()

        try {
          const [{ importNodes }, importSubscriptions] = await Promise.all([
            importNodesMutation.mutateAsync(values.nodes),
            importSubscriptionsMutation.mutateAsync(values.subscriptions),
          ])

          if (mode === MODE.simple) {
            const nodeIDSet = new Set<string>()
            importNodes.forEach(({ node }) => node?.id && nodeIDSet.add(node.id))
            importSubscriptions.forEach(({ importSubscription }) =>
              importSubscription.nodeImportResult.forEach(({ node }) => node?.id && nodeIDSet.add(node.id))
            )

            const nodeIDs = Array.from(nodeIDSet.values())
            await groupAddNodesMutation.mutateAsync({ id: defaultGroupID, nodeIDs })
          }

          enqueueSnackbar(t('success'))
        } catch {
          //
        }
      }}
    >
      <Tabs variant="fullWidth" value={curTab} onChange={(_, curTab) => setCurTab(curTab)}>
        <Tab value="node" label={t('node')} />
        <Tab value="subscription" label={t('subscription')} />
      </Tabs>

      <TabPanel active={curTab === 'node'}>
        <Stack spacing={2}>
          {nodeArgumentsForm.fields.map((field, i) => (
            <GrowableArgumentsInput
              key={field.id}
              inc={() =>
                nodeArgumentsForm.insert(i + 1, {
                  link: '',
                  tag: '',
                })
              }
              dec={() => nodeArgumentsForm.remove(i)}
              linkProps={register(`nodes.${i}.link`, {
                required: true,
              })}
              tagProps={register(`nodes.${i}.tag`)}
            />
          ))}

          <Button onClick={() => nodeArgumentsForm.append({ link: '', tag: '' })}>
            <Avatar>
              <Add />
            </Avatar>
          </Button>
        </Stack>
      </TabPanel>

      <TabPanel active={curTab === 'subscription'}>
        <Stack spacing={2}>
          {subscriptionArgumentsForm.fields.map((field, i) => (
            <GrowableArgumentsInput
              key={field.id}
              inc={() =>
                subscriptionArgumentsForm.insert(i + 1, {
                  link: '',
                  tag: '',
                })
              }
              dec={() => subscriptionArgumentsForm.remove(i)}
              linkProps={register(`subscriptions.${i}.link`, {
                required: true,
              })}
              tagProps={register(`subscriptions.${i}.tag`)}
            />
          ))}

          <Button onClick={() => subscriptionArgumentsForm.append({ link: '', tag: '' })}>
            <Avatar>
              <Add />
            </Avatar>
          </Button>
        </Stack>
      </TabPanel>
    </FormDialog>
  )
}
