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

import { HTTPForm } from './HTTPForm'
import { Hysteria2Form } from './Hysteria2Form'
import { JuicityForm } from './JuicityForm'
import { Socks5Form } from './Socks5Form'
import { SSForm } from './SSForm'
import { SSRForm } from './SSRForm'
import { TrojanForm } from './TrojanForm'
import { TuicForm } from './TuicForm'
import { V2rayForm } from './V2rayForm'

const schema = z.object({ tag: z.string().min(1, 'This field is required') })

type FormValues = z.infer<typeof schema>

export function ConfigureNodeFormModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const importNodesMutation = useImportNodesMutation()
  const [actionsPortal, setActionsPortal] = useState<HTMLDivElement | null>(null)

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

            <Tabs defaultValue="v2ray" className="w-full min-w-0">
              <div className="overflow-x-auto -mx-1 px-1">
                <TabsList className="inline-flex w-max gap-1">
                  <TabsTrigger value="v2ray">V2RAY</TabsTrigger>
                  <TabsTrigger value="ss">SS</TabsTrigger>
                  <TabsTrigger value="ssr">SSR</TabsTrigger>
                  <TabsTrigger value="trojan">Trojan</TabsTrigger>
                  <TabsTrigger value="juicity">Juicity</TabsTrigger>
                  <TabsTrigger value="hysteria2">Hysteria2</TabsTrigger>
                  <TabsTrigger value="tuic">Tuic</TabsTrigger>
                  <TabsTrigger value="http">HTTP</TabsTrigger>
                  <TabsTrigger value="socks5">SOCKS5</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="v2ray" className="space-y-2 pt-2">
                <V2rayForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="ss" className="space-y-2 pt-2">
                <SSForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="ssr" className="space-y-2 pt-2">
                <SSRForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="trojan" className="space-y-2 pt-2">
                <TrojanForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="juicity" className="space-y-2 pt-2">
                <JuicityForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="hysteria2" className="space-y-2 pt-2">
                <Hysteria2Form onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="tuic" className="space-y-2 pt-2">
                <TuicForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="http" className="space-y-2 pt-2">
                <HTTPForm onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>

              <TabsContent value="socks5" className="space-y-2 pt-2">
                <Socks5Form onLinkGeneration={onLinkGeneration} actionsPortal={actionsPortal} />
              </TabsContent>
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
