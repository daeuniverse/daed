import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useImportNodesMutation } from '~/apis'
import { Dialog, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  ScrollableDialogBody,
  ScrollableDialogContent,
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

const schema = z.object({ tag: z.string().min(1) })

export function ConfigureNodeFormModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const importNodesMutation = useImportNodesMutation()
  const [formData, setFormData] = useState({ tag: '' })
  const [errors, setErrors] = useState<{ tag?: string }>({})

  const onLinkGeneration = async (link: string) => {
    const result = schema.safeParse(formData)

    if (!result.success) {
      setErrors({ tag: result.error.issues[0]?.message })

      return
    }

    await importNodesMutation.mutateAsync([
      {
        link,
        tag: formData.tag,
      },
    ])

    onClose()
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <ScrollableDialogContent size="lg">
        <ScrollableDialogHeader>
          <DialogTitle>{t('configureNode.title')}</DialogTitle>
        </ScrollableDialogHeader>
        <ScrollableDialogBody className="space-y-4">
          <Input
            label={t('tag')}
            withAsterisk
            value={formData.tag}
            onChange={(e) => setFormData({ tag: e.target.value })}
            error={errors.tag}
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
              <V2rayForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="ss" className="space-y-2 pt-2">
              <SSForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="ssr" className="space-y-2 pt-2">
              <SSRForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="trojan" className="space-y-2 pt-2">
              <TrojanForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="juicity" className="space-y-2 pt-2">
              <JuicityForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="hysteria2" className="space-y-2 pt-2">
              <Hysteria2Form onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="tuic" className="space-y-2 pt-2">
              <TuicForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="http" className="space-y-2 pt-2">
              <HTTPForm onLinkGeneration={onLinkGeneration} />
            </TabsContent>

            <TabsContent value="socks5" className="space-y-2 pt-2">
              <Socks5Form onLinkGeneration={onLinkGeneration} />
            </TabsContent>
          </Tabs>
        </ScrollableDialogBody>
      </ScrollableDialogContent>
    </Dialog>
  )
}
