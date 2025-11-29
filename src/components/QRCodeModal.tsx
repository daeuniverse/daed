import { Check, Copy } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useImperativeHandle, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Badge } from '~/components/ui/badge'
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

export function QRCodeModal({ ref, opened, onClose }) {
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
        <div className="flex flex-col items-center justify-center gap-4 py-4 mx-auto">
          <QRCodeCanvas size={240} value={props.link} />

          <div className="flex items-center gap-2">
            <Badge className="max-w-[240px] truncate" size="lg">
              {props.link}
            </Badge>

            <CopyToClipboard text={props.link} onCopy={() => setCopied(true)}>
              <Button variant="ghost" size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
