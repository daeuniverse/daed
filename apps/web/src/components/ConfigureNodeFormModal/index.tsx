import type { FieldValues } from 'react-hook-form'
import type { ProtocolConfig } from './protocols/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportNodesMutation } from '~/apis'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  ScrollableDialogHeader,
} from '~/components/ui/scrollable-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

import { GenericNodeForm, getProtocols } from './protocols'

const schema = z.object({ tag: z.string().min(1, 'This field is required') })

type FormValues = z.infer<typeof schema>

/**
 * Renders the form component for a protocol
 * Uses custom FormComponent if provided, otherwise falls back to GenericNodeForm
 */
function ProtocolFormRenderer({
  protocol,
  onLinkGeneration,
  actionsPortal,
}: {
  protocol: ProtocolConfig<FieldValues>
  onLinkGeneration: (link: string) => Promise<void>
  actionsPortal: HTMLDivElement | null
}) {
  // If protocol has a custom form component, use it
  if (protocol.FormComponent) {
    const FormComponent = protocol.FormComponent
    return <FormComponent onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
  }

  // Otherwise use the generic form with field configurations
  return <GenericNodeForm config={protocol} onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
}

export function ConfigureNodeFormModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const importNodesMutation = useImportNodesMutation()
  const [actionsPortal, setActionsPortal] = useState<HTMLDivElement | null>(null)

  // Get all registered protocols
  const protocols = getProtocols()

  const {
    setValue,
    reset,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tag: '' },
  })

  const tag = useWatch({ control, name: 'tag' })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
      onClose()
    }
  }

  const onLinkGeneration = async (link: string) => {
    const isValid = await trigger()

    if (!isValid) return

    const { tag } = getValues()

    await importNodesMutation.mutateAsync([
      {
        link,
        tag,
      },
    ])

    handleOpenChange(false)
  }

  // Default to first protocol if available
  const defaultProtocol = protocols[0]?.id ?? 'v2ray'

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <ScrollableDialogContent size="lg">
        <ScrollableDialogHeader>
          <DialogTitle>{t('configureNode.title')}</DialogTitle>
        </ScrollableDialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollableDialogBody className="flex-1 space-y-4">
            <Input
              label={t('tag')}
              withAsterisk
              value={tag}
              onChange={(e) => setValue('tag', e.target.value)}
              error={errors.tag?.message}
            />

            <Tabs defaultValue={defaultProtocol} className="w-full min-w-0">
              <div className="overflow-x-auto -mx-1 px-1">
                <TabsList className="inline-flex w-max gap-1">
                  {protocols.map((protocol) => (
                    <TabsTrigger key={protocol.id} value={protocol.id}>
                      {protocol.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {protocols.map((protocol) => (
                <TabsContent key={protocol.id} value={protocol.id} className="space-y-2 pt-2">
                  <ProtocolFormRenderer
                    protocol={protocol}
                    onLinkGeneration={onLinkGeneration}
                    actionsPortal={actionsPortal}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </ScrollableDialogBody>
          <ScrollableDialogFooter>
            <div ref={setActionsPortal} className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end w-full" />
          </ScrollableDialogFooter>
        </div>
      </ScrollableDialogContent>
    </Dialog>
  )
}
