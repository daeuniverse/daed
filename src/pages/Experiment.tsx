import type { UniqueIdentifier } from '@dnd-kit/core'
import type { RenameFormModalRef } from '~/components'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, snapCenterToCursor } from '@dnd-kit/modifiers'
import { arrayMove, rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable'
import { faker } from '@faker-js/faker'
import Editor from '@monaco-editor/react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { FileInput, Pencil } from 'lucide-react'
import { useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import {
  useCreateDNSMutation,
  useCreateRoutingMutation,
  useImportNodesMutation,
  useImportSubscriptionsMutation,
} from '~/apis'
import {
  ConfigFormDrawer,
  ConfigureNodeFormModal,
  DraggableResourceCard,
  DroppableGroupCard,
  GroupFormModal,
  ImportResourceFormModal,
  PlainTextFormModal,
  RenameFormModal,
  Section,
  SimpleCard,
  SortableResourceBadge,
} from '~/components'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Code,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui'
import { DialMode, DraggableResourceType, EDITOR_OPTIONS, LogLevel, RuleType } from '~/constants'
import { useDisclosure } from '~/hooks'
import { handleEditorBeforeMount } from '~/monaco'
import { Policy } from '~/schemas/gql/graphql'

export function ExperimentPage() {
  const { t } = useTranslation()

  const [fakeConfigs, setFakeConfigs] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        selected: faker.datatype.boolean(),
        global: {
          tproxyPort: faker.internet.port(),
          logLevel: faker.helpers.enumValue(LogLevel),
          tcpCheckUrl: faker.helpers.multiple(() => faker.internet.url(), { count: { min: 1, max: 4 } }),
          udpCheckDns: faker.helpers.multiple(() => faker.internet.url(), { count: { min: 1, max: 4 } }),
          checkInterval: faker.number.int(),
          checkTolerence: faker.number.int(),
          sniffingTimeout: faker.number.int(),
          lanInterface: faker.helpers.multiple(() => faker.system.networkInterface(), { count: { min: 1, max: 4 } }),
          wanInterface: faker.helpers.multiple(() => faker.system.networkInterface(), { count: { min: 1, max: 4 } }),
          allowInsecure: faker.datatype.boolean(),
          dialMode: faker.helpers.enumValue(DialMode),
          disableWaitingNetwork: faker.datatype.boolean(),
          autoConfigKernelParameter: faker.datatype.boolean(),
        },
      }),
      {
        count: 2,
      },
    ),
  )

  const [fakeDnss, setFakeDnss] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        selected: faker.datatype.boolean(),
        dns: faker.lorem.paragraph(),
      }),
      {
        count: 2,
      },
    ),
  )

  const [fakeRoutings, setFakeRoutings] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        selected: faker.datatype.boolean(),
        routing: {
          string: faker.lorem.paragraph(),
          rules: [],
        },
        referenceGroups: [],
      }),
      {
        count: 2,
      },
    ),
  )

  const [fakeGroups, setFakeGroups] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        nodes: faker.helpers.multiple(
          () => ({
            id: faker.string.uuid(),
            name: faker.lorem.word(),
          }),
          {
            count: faker.number.int({ min: 5, max: 10 }),
          },
        ),
        subscriptions: faker.helpers.multiple(
          () => ({
            id: faker.string.uuid(),
            name: faker.lorem.word(),
          }),
          {
            count: 5,
          },
        ),
        policy: faker.helpers.enumValue(Policy),
      }),
      {
        count: 2,
      },
    ),
  )

  const [fakeNodes, setFakeNodes] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        protocol: faker.helpers.arrayElement([
          'vmess',
          'vless',
          'shadowsocks',
          'trojan',
          'hysteria',
          'socks5',
          'direct',
          'http',
        ]),
        tag: faker.lorem.word(),
        link: faker.internet.url(),
      }),
      {
        count: 3,
      },
    ),
  )

  const [fakeSubscriptions, setFakeSubscriptions] = useState(
    faker.helpers.multiple(
      () => ({
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        tag: faker.lorem.word(),
        link: faker.internet.url(),
        updatedAt: dayjs(faker.date.recent()).format('YYYY-MM-DD HH:mm:ss'),
        nodes: faker.helpers.multiple(
          () => ({
            id: faker.string.uuid(),
            name: faker.lorem.word(),
            protocol: faker.helpers.arrayElement([
              'vmess',
              'vless',
              'shadowsocks',
              'trojan',
              'hysteria',
              'socks5',
              'direct',
              'http',
            ]),
            tag: faker.lorem.word(),
            link: faker.internet.url(),
          }),
          {
            count: { min: 5, max: 10 },
          },
        ),
      }),
      {
        count: 2,
      },
    ),
  )

  const [draggingResource, setDraggingResource] = useState<{
    id: UniqueIdentifier
    type: DraggableResourceType
    rect?: { width: number; height: number }
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  )

  const [openedRenameModal, { open: openRenameModal, close: closeRenameModal }] = useDisclosure(false)
  const [openedCreateConfigModal, { open: openCreateConfigModal, close: closeCreateConfigModal }] = useDisclosure(false)
  const [openedCreateDnsModal, { open: openCreateDnsModal, close: closeCreateDnsModal }] = useDisclosure(false)
  const [openedCreateRoutingModal, { open: openCreateRoutingModal, close: closeCreateRoutingModal }] =
    useDisclosure(false)
  const [openedCreateGroupModal, { open: openCreateGroupModal, close: closeCreateGroupModal }] = useDisclosure(false)
  const [openedImportNodeModal, { open: openImportNodeModal, close: closeImportNodeModal }] = useDisclosure(false)
  const [openedConfigureNodeFormModal, { open: openConfigureNodeFormModal, close: closeConfigureNodeFormModal }] =
    useDisclosure(false)
  const [openedImportSubscriptionModal, { open: openImportSubscriptionModal, close: closeImportSubscriptionModal }] =
    useDisclosure(false)

  const createDNSMutation = useCreateDNSMutation()
  const createRoutingMutation = useCreateRoutingMutation()
  const importNodesMutation = useImportNodesMutation()
  const importSubscriptionsMutation = useImportSubscriptionsMutation()

  const renameModalRef = useRef<RenameFormModalRef>(null)

  return (
    <div className="flex flex-col gap-4">
      <Editor
        height={500}
        defaultValue="hello world"
        theme="vs-dark"
        options={EDITOR_OPTIONS}
        beforeMount={handleEditorBeforeMount}
      />

      <div className="grid grid-cols-3 gap-4">
        <Section title={t('config')} onCreate={openCreateConfigModal}>
          <div className="flex flex-col gap-4">
            {fakeConfigs.map((config) => (
              <SimpleCard
                key={config.id}
                name={config.name}
                selected={false}
                actions={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      if (renameModalRef.current) {
                        renameModalRef.current.setProps({
                          id: config.id,
                          type: RuleType.config,
                          oldName: config.name,
                        })
                      }

                      openRenameModal()
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                }
                onRemove={() => setFakeConfigs((configs) => configs.filter((c) => c.id !== config.id))}
              >
                <Code>{JSON.stringify(config, null, 2)}</Code>
              </SimpleCard>
            ))}
          </div>
        </Section>

        <Section title={t('dns')} onCreate={openCreateDnsModal}>
          <div className="flex flex-col gap-4">
            {fakeDnss.map((dns) => (
              <SimpleCard
                key={dns.id}
                name={dns.name}
                selected={false}
                actions={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      if (renameModalRef.current) {
                        renameModalRef.current.setProps({
                          id: dns.id,
                          type: RuleType.dns,
                          oldName: dns.name,
                        })
                      }

                      openRenameModal()
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                }
                onRemove={() => setFakeDnss((dnss) => dnss.filter((c) => c.id !== dns.id))}
              >
                <Code>{dns.dns}</Code>
              </SimpleCard>
            ))}
          </div>
        </Section>

        <Section title={t('routing')} onCreate={openCreateRoutingModal}>
          <div className="flex flex-col gap-4">
            {fakeRoutings.map((routing) => (
              <SimpleCard
                key={routing.id}
                name={routing.name}
                selected={false}
                actions={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      if (renameModalRef.current) {
                        renameModalRef.current.setProps({
                          id: routing.id,
                          type: RuleType.routing,
                          oldName: routing.name,
                        })
                      }

                      openRenameModal()
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                }
                onRemove={() => setFakeRoutings((routings) => routings.filter((c) => c.id !== routing.id))}
              >
                <Code>{routing.routing.string}</Code>
              </SimpleCard>
            ))}
          </div>
        </Section>
      </div>

      <Separator />

      <h3 id="resource" className="scroll-m-20 text-2xl font-semibold tracking-tight">
        <a href="#resource" className="text-primary hover:underline">
          {t('resource')}
        </a>
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <DndContext
          sensors={sensors}
          onDragStart={(e) => {
            const rect = e.active.rect.current.initial
            setDraggingResource({
              id: e.active.id,
              type: (
                e.active.data.current as {
                  type: DraggableResourceType
                }
              ).type,
              rect: rect ? { width: rect.width, height: rect.height } : undefined,
            })
          }}
          onDragEnd={(e) => {
            const { active, over } = e

            if (draggingResource?.type === DraggableResourceType.node) {
              const activeNode = fakeNodes.find((node) => node.id === active.id)

              if (activeNode) {
                const updatedFakeGrups = produce(fakeGroups, (groups) => {
                  const group = groups.find((group) => group.id === over?.id)

                  if (!group?.nodes.find((node) => node.id === active.id)) {
                    group?.nodes.push(activeNode)
                  }
                })

                setFakeGroups(updatedFakeGrups)
              }
            }

            if (draggingResource?.type === DraggableResourceType.subscription) {
              const activeSubscription = fakeSubscriptions.find((subscription) => subscription.id === active.id)

              if (activeSubscription) {
                const updatedFakeGrups = produce(fakeGroups, (groups) => {
                  const group = groups.find((group) => group.id === over?.id)

                  if (!group?.subscriptions.find((subscription) => subscription.id === active.id)) {
                    group?.subscriptions.push(activeSubscription)
                  }
                })

                setFakeGroups(updatedFakeGrups)
              }
            }

            setDraggingResource(null)
          }}
        >
          <Section title={t('group')} onCreate={openCreateGroupModal} bordered>
            <div className="flex flex-col gap-4">
              {fakeGroups.map(({ id: groupId, name, policy, nodes, subscriptions }) => (
                <DroppableGroupCard
                  key={groupId}
                  id={groupId}
                  name={name}
                  onRemove={() => {
                    setFakeGroups((groups) => groups.filter((group) => group.id !== groupId))
                  }}
                >
                  <p className="font-semibold">{policy}</p>

                  <div className="h-2.5" />

                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="node">
                      <AccordionTrigger className="text-xs px-2">{t('node')}</AccordionTrigger>

                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          <DndContext
                            sensors={sensors}
                            modifiers={[restrictToParentElement]}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                              if (active && over && active.id !== over.id) {
                                const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                  const group = groups.find((group) => group.id === groupId)

                                  if (group) {
                                    const from = group?.nodes.findIndex((node) => node.id === active.id)
                                    const to = group?.nodes.findIndex((node) => node.id === over.id)

                                    group.nodes = arrayMove(group.nodes, from, to)
                                  }
                                })

                                setFakeGroups(updatedFakeGrups)
                              }
                            }}
                          >
                            <SortableContext items={nodes} strategy={rectSwappingStrategy}>
                              {nodes.map(({ id: nodeId, name }) => (
                                <SortableResourceBadge
                                  key={nodeId}
                                  type={DraggableResourceType.node}
                                  id={nodeId}
                                  name={name}
                                  onRemove={() => {
                                    const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                      const group = groups.find((group) => group.id === groupId)

                                      if (group) {
                                        group.nodes = group.nodes.filter((node) => node.id !== nodeId)
                                      }
                                    })

                                    setFakeGroups(updatedFakeGrups)
                                  }}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="subscription">
                      <AccordionTrigger className="text-xs px-2">{t('subscription')}</AccordionTrigger>

                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                          <DndContext
                            sensors={sensors}
                            modifiers={[restrictToParentElement]}
                            collisionDetection={closestCenter}
                            onDragEnd={({ active, over }) => {
                              if (active && over && active.id !== over.id) {
                                const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                  const group = groups.find((group) => group.id === groupId)

                                  if (group) {
                                    const from = group?.subscriptions.findIndex((s) => s.id === active.id)
                                    const to = group?.subscriptions.findIndex((s) => s.id === over.id)

                                    group.subscriptions = arrayMove(group.subscriptions, from, to)
                                  }
                                })

                                setFakeGroups(updatedFakeGrups)
                              }
                            }}
                          >
                            <SortableContext items={subscriptions} strategy={rectSwappingStrategy}>
                              {subscriptions.map(({ id: subscriptionId, name }) => (
                                <SortableResourceBadge
                                  key={subscriptionId}
                                  type={DraggableResourceType.subscription}
                                  id={subscriptionId}
                                  name={name}
                                  onRemove={() => {
                                    const updatedFakeGrups = produce(fakeGroups, (groups) => {
                                      const group = groups.find((group) => group.id === groupId)

                                      if (group) {
                                        group.subscriptions = group.subscriptions.filter(
                                          (subscription) => subscription.id !== subscriptionId,
                                        )
                                      }
                                    })

                                    setFakeGroups(updatedFakeGrups)
                                  }}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </DroppableGroupCard>
              ))}
            </div>
          </Section>

          <Section
            title={t('node')}
            onCreate={openConfigureNodeFormModal}
            actions={
              <Button variant="ghost" size="icon" onClick={openImportNodeModal}>
                <FileInput className="h-4 w-4" />
              </Button>
            }
            bordered
          >
            <div className="flex flex-col gap-4">
              {fakeNodes.map(({ id, name, tag, protocol, link }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={DraggableResourceType.node}
                  name={name}
                  onRemove={() => {
                    setFakeNodes((nodes) => nodes.filter((node) => node.id !== id))
                  }}
                >
                  <p className="font-semibold text-primary">{tag}</p>
                  <p className="font-semibold">{protocol}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="truncate">{link}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link}</p>
                    </TooltipContent>
                  </Tooltip>
                </DraggableResourceCard>
              ))}
            </div>
          </Section>

          <Section title={t('subscription')} onCreate={openImportSubscriptionModal} bordered>
            <div className="flex flex-col gap-4">
              {fakeSubscriptions.map(({ id, name, tag, link, updatedAt, nodes }) => (
                <DraggableResourceCard
                  key={id}
                  id={id}
                  type={DraggableResourceType.subscription}
                  name={name}
                  onRemove={() => {
                    setFakeSubscriptions((subscriptions) =>
                      subscriptions.filter((subscription) => subscription.id !== id),
                    )
                  }}
                >
                  <p className="font-semibold text-primary">{tag}</p>
                  <p className="font-semibold">{updatedAt}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="truncate">{link}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link}</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="h-2.5" />

                  <div className="flex flex-wrap gap-2">
                    {nodes.map(({ id, name }) => (
                      <Badge key={id}>{name}</Badge>
                    ))}
                  </div>
                </DraggableResourceCard>
              ))}
            </div>
          </Section>

          <DragOverlay zIndex={9999} modifiers={[snapCenterToCursor]}>
            {draggingResource ? (
              <Badge className="cursor-grabbing shadow-lg text-sm px-3 py-1">
                <span className="truncate">
                  {draggingResource?.type === DraggableResourceType.node
                    ? fakeNodes.find((node) => node.id === draggingResource.id)?.name
                    : fakeSubscriptions.find((subscription) => subscription.id === draggingResource.id)?.name}
                </span>
              </Badge>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <ConfigFormDrawer opened={openedCreateConfigModal} onClose={closeCreateConfigModal} />

      <PlainTextFormModal
        title={t('dns')}
        opened={openedCreateDnsModal}
        onClose={closeCreateDnsModal}
        handleSubmit={async (values) => {
          await createDNSMutation.mutateAsync({
            name: values.name,
            dns: values.text,
          })
        }}
      />

      <PlainTextFormModal
        title={t('routing')}
        opened={openedCreateRoutingModal}
        onClose={closeCreateRoutingModal}
        handleSubmit={async (values) => {
          await createRoutingMutation.mutateAsync({
            name: values.name,
            routing: values.text,
          })
        }}
      />

      <GroupFormModal opened={openedCreateGroupModal} onClose={closeCreateGroupModal} />

      <ImportResourceFormModal
        title={t('node')}
        opened={openedImportNodeModal}
        onClose={closeImportNodeModal}
        handleSubmit={async (values) => {
          await importNodesMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
          closeImportNodeModal()
        }}
      />

      <ImportResourceFormModal
        title={t('subscription')}
        opened={openedImportSubscriptionModal}
        onClose={closeImportSubscriptionModal}
        handleSubmit={async (values) => {
          await importSubscriptionsMutation.mutateAsync(values.resources.map(({ link, tag }) => ({ link, tag })))
          closeImportNodeModal()
        }}
      />

      <RenameFormModal ref={renameModalRef} opened={openedRenameModal} onClose={closeRenameModal} />

      <ConfigureNodeFormModal opened={openedConfigureNodeFormModal} onClose={closeConfigureNodeFormModal} />
    </div>
  )
}
