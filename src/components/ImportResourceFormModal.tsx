import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormActions } from '~/components/FormActions'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

const schema = z.object({
  resources: z
    .array(
      z.object({
        id: z.string(),
        link: z.string(),
        tag: z.string().min(1),
      }),
    )
    .min(1),
})

const randomId = () => Math.random().toString(36).substring(2, 15)

export function ImportResourceFormModal({
  title,
  opened,
  onClose,
  handleSubmit,
}: {
  title: string
  opened: boolean
  onClose: () => void
  handleSubmit: (values: z.infer<typeof schema>) => Promise<void>
}) {
  const { t } = useTranslation()
  const [resources, setResources] = useState([{ id: randomId(), link: '', tag: '' }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = schema.safeParse({ resources })

    if (!result.success) {
      const newErrors: Record<string, string> = {}

      result.error.issues.forEach((err) => {
        const path = err.path.join('.')
        newErrors[path] = err.message
      })
      setErrors(newErrors)

      return
    }

    await handleSubmit({ resources })
    onClose()
    setResources([{ id: randomId(), link: '', tag: '' }])
  }

  const addResource = () => {
    setResources([...resources, { id: randomId(), link: '', tag: '' }])
  }

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index))
  }

  const updateResource = (index: number, field: 'link' | 'tag', value: string) => {
    const newResources = [...resources]
    newResources[index] = { ...newResources[index], [field]: value }
    setResources(newResources)
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-5">
            {resources.map(({ id, link, tag }, i) => (
              <div key={id} className="flex gap-2.5">
                <div className="flex-1 flex items-start gap-2.5">
                  <Input
                    className="flex-1"
                    withAsterisk
                    label={t('link')}
                    value={link}
                    onChange={e => updateResource(i, 'link', e.target.value)}
                    error={errors[`resources.${i}.link`]}
                  />
                  <Input
                    className="w-24"
                    withAsterisk
                    label={t('tag')}
                    value={tag}
                    onChange={e => updateResource(i, 'tag', e.target.value)}
                    error={errors[`resources.${i}.tag`]}
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-8 h-8 w-8"
                  onClick={() => removeResource(i)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-5">
            <Button
              type="button"
              variant="default"
              size="icon"
              className="bg-green-600 hover:bg-green-700"
              onClick={addResource}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <FormActions reset={() => setResources([{ id: randomId(), link: '', tag: '' }])} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
