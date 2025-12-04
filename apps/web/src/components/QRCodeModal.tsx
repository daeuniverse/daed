import { Check, Copy } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useImperativeHandle, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

interface Props {
  name: string
  link: string
}

export interface QRCodeModalRef {
  props: Props
  setProps: (props: Props) => void
}

export function QRCodeModal({
  ref,
  opened,
  onClose,
}: {
  ref: React.Ref<QRCodeModalRef>
  opened: boolean
  onClose: () => void
}) {
  const [props, setProps] = useState<Props>({
    name: '',
    link: '',
  })

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [copied])

  useImperativeHandle(ref, () => ({
    props,
    setProps,
  }))

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4 mx-auto w-full">
          <QRCodeCanvas size={240} value={props.link} />

          <div className="flex items-start gap-2 w-full max-w-full">
            <div className="flex-1 min-w-0 p-3 bg-muted rounded-md">
              <p className="text-sm font-mono break-all whitespace-pre-wrap">{props.link}</p>
            </div>

            <CopyToClipboard text={props.link} onCopy={() => setCopied(true)}>
              <Button variant="ghost" size="icon" className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
