import type { HTTPFormValues } from './ConfigureNodeFormModal/HTTPForm.tsx'
import type { Hysteria2FormValues } from './ConfigureNodeFormModal/Hysteria2Form.tsx'

import type { JuicityFormValues } from './ConfigureNodeFormModal/JuicityForm.tsx'
import type { Socks5FormValues } from './ConfigureNodeFormModal/Socks5Form.tsx'
import type { SSFormValues } from './ConfigureNodeFormModal/SSForm.tsx'
import type { SSRFormValues } from './ConfigureNodeFormModal/SSRForm.tsx'
import type { TrojanFormValues } from './ConfigureNodeFormModal/TrojanForm.tsx'
import type { TuicFormValues } from './ConfigureNodeFormModal/TuicForm.tsx'
import type { V2rayFormValues } from './ConfigureNodeFormModal/V2rayForm.tsx'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateNodeMutation } from '../apis/index.ts'
import { parseNodeUrl } from '../utils/node-parser.ts'
import { HTTPForm } from './ConfigureNodeFormModal/HTTPForm.tsx'
import { Hysteria2Form } from './ConfigureNodeFormModal/Hysteria2Form.tsx'
import { JuicityForm } from './ConfigureNodeFormModal/JuicityForm.tsx'
import { Socks5Form } from './ConfigureNodeFormModal/Socks5Form.tsx'
import { SSForm } from './ConfigureNodeFormModal/SSForm.tsx'
import { SSRForm } from './ConfigureNodeFormModal/SSRForm.tsx'
import { TrojanForm } from './ConfigureNodeFormModal/TrojanForm.tsx'
import { TuicForm } from './ConfigureNodeFormModal/TuicForm.tsx'
import { V2rayForm } from './ConfigureNodeFormModal/V2rayForm.tsx'
import { Dialog, DialogTitle } from './ui/dialog.tsx'
import { Input } from './ui/input.tsx'
import { ScrollableDialogBody, ScrollableDialogContent, ScrollableDialogHeader } from './ui/scrollable-dialog.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.tsx'

type NodeType = 'v2ray' | 'ss' | 'ssr' | 'trojan' | 'juicity' | 'hysteria2' | 'tuic' | 'http' | 'socks5' | 'unknown'

export interface EditNodeFormModalProps {
  opened: boolean
  onClose: () => void
  node?: {
    id: string
    link: string
    tag: string
    name: string
  }
}

// Helper function to parse node link
function parseNode(link: string | undefined): { nodeType: NodeType; initialValues: unknown } {
  if (!link) {
    return { nodeType: 'unknown', initialValues: null }
  }

  const parsed = parseNodeUrl(link)

  if (!parsed) {
    return { nodeType: 'unknown', initialValues: null }
  }

  return {
    nodeType: parsed.type as NodeType,
    initialValues: parsed.data,
  }
}

export function EditNodeFormModal({ opened, onClose, node }: EditNodeFormModalProps) {
  const { t } = useTranslation()
  const updateNodeMutation = useUpdateNodeMutation()

  // Parse the node link to detect protocol and get initial values
  const { nodeType, initialValues } = useMemo(() => parseNode(node?.link), [node?.link])

  // Track user's manual tab selection separately from detected type
  const [manualTab, setManualTab] = useState<NodeType | null>(null)

  // Use manual selection if user switched tabs, otherwise use detected type
  const activeTab = manualTab ?? (nodeType !== 'unknown' ? nodeType : 'v2ray')

  const handleTabChange = (val: string) => {
    setManualTab(val as NodeType)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  const onLinkGeneration = async (link: string) => {
    if (node) {
      await updateNodeMutation.mutateAsync({
        id: node.id,
        newLink: link,
      })
      onClose()
    }
  }

  if (!node) return null

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <ScrollableDialogContent size="lg">
        <ScrollableDialogHeader>
          <DialogTitle>{t('editNode')}</DialogTitle>
        </ScrollableDialogHeader>
        <ScrollableDialogBody className="space-y-4">
          <Input label={t('tag')} value={node.tag} disabled />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full min-w-0">
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
              <V2rayForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'v2ray' ? (initialValues as V2rayFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="ss" className="space-y-2 pt-2">
              <SSForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'ss' ? (initialValues as SSFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="ssr" className="space-y-2 pt-2">
              <SSRForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'ssr' ? (initialValues as SSRFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="trojan" className="space-y-2 pt-2">
              <TrojanForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'trojan' ? (initialValues as TrojanFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="juicity" className="space-y-2 pt-2">
              <JuicityForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'juicity' ? (initialValues as JuicityFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="hysteria2" className="space-y-2 pt-2">
              <Hysteria2Form
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'hysteria2' ? (initialValues as Hysteria2FormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="tuic" className="space-y-2 pt-2">
              <TuicForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'tuic' ? (initialValues as TuicFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="http" className="space-y-2 pt-2">
              <HTTPForm
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'http' ? (initialValues as HTTPFormValues) : undefined}
              />
            </TabsContent>

            <TabsContent value="socks5" className="space-y-2 pt-2">
              <Socks5Form
                onLinkGeneration={onLinkGeneration}
                initialValues={nodeType === 'socks5' ? (initialValues as Socks5FormValues) : undefined}
              />
            </TabsContent>
          </Tabs>
        </ScrollableDialogBody>
      </ScrollableDialogContent>
    </Dialog>
  )
}
