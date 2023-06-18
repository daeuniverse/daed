import { Anchor, Card, Container, Group, Image, Stack, Text, Title } from '@mantine/core'

import logo from '~/assets/logo.svg'

// const SimpleMode = () => {
//   const { t } = useTranslation()

//   const [openedImportNodeFormModal, { open: openImportNodeFormModal, close: closeImportNodeFormModal }] =
//     useDisclosure(false)
//   const [
//     openedImportSubscriptionFormModal,
//     { open: openImportSubscriptionFormModal, close: closeImportSubscriptionFormModal },
//   ] = useDisclosure(false)
//   const importNodesMutation = useImportNodesMutation()
//   const importSubscriptionsMutation = useImportSubscriptionsMutation()

//   const gqlClient = useGQLQueryClient()
//   const groupAddNodesMutation = useGroupAddNodesMutation()
//   const groupAddSubscriptionsMutation = useGroupAddSubscriptionsMutation()
//   const groupDelNodesMutation = useGroupDelNodesMutation()
//   const groupDelSubscriptionsMutation = useGroupDelSubscriptionsMutation()
//   const queryClient = useQueryClient()

//   const { data: groupQuery } = useQuery({
//     queryKey: ['defaultGroup'],
//     queryFn: async () =>
//       gqlClient.request(
//         graphql(`
//           query Group($name: String!) {
//             group(name: $name) {
//               id
//               name
//               nodes {
//                 id
//                 name
//                 tag
//                 link
//               }
//               subscriptions {
//                 id
//                 tag
//                 link
//               }
//             }
//           }
//         `),
//         {
//           name: 'default',
//         }
//       ),
//   })

//   if (!groupQuery) {
//     return
//   }

//   return (
//     <Fragment>
//       <Card withBorder shadow="sm">
//         <Card.Section p="sm">
//           <Group position="apart">
//             <Title order={3}>{groupQuery?.group.name}</Title>

//             <Group>
//               <Button onClick={openImportNodeFormModal}>{t('actions.import resource', { name: t('node') })}</Button>
//               <Button onClick={openImportSubscriptionFormModal}>
//                 {t('actions.import resource', { name: t('subscription') })}
//               </Button>
//             </Group>
//           </Group>
//         </Card.Section>

//         <Card.Section p="sm">
//           <Stack>
//             <Title order={4}>
//               {t('node')} ({groupQuery?.group.nodes.length || 0})
//             </Title>

//             <Flex gap="sm" wrap="wrap">
//               {groupQuery?.group.nodes.map((node) => (
//                 <SortableResourceBadge
//                   key={node.id}
//                   id={node.id}
//                   name={node.name ?? node.tag}
//                   onRemove={async () => {
//                     await groupDelNodesMutation.mutateAsync({
//                       id: groupQuery.group.id,
//                       nodeIDs: [node.id],
//                     })

//                     queryClient.invalidateQueries({ queryKey: ['defaultGroup'] })
//                   }}
//                   dragDisabled
//                 />
//               ))}
//             </Flex>
//           </Stack>
//         </Card.Section>

//         <Card.Section p="sm">
//           <Stack>
//             <Title order={4}>
//               {t('subscription')} ({groupQuery?.group.subscriptions.length || 0})
//             </Title>

//             <Flex gap="sm" wrap="wrap">
//               {groupQuery?.group.subscriptions.map((subscription) => (
//                 <SortableResourceBadge
//                   key={subscription.id}
//                   id={subscription.id}
//                   name={subscription.tag || subscription.link}
//                   onRemove={async () => {
//                     await groupDelSubscriptionsMutation.mutateAsync({
//                       id: groupQuery.group.id,
//                       subscriptionIDs: [subscription.id],
//                     })

//                     queryClient.invalidateQueries({ queryKey: ['defaultGroup'] })
//                   }}
//                   dragDisabled
//                 />
//               ))}
//             </Flex>
//           </Stack>
//         </Card.Section>
//       </Card>

//       <ImportResourceFormModal
//         title={t('node')}
//         opened={openedImportNodeFormModal}
//         onClose={closeImportNodeFormModal}
//         handleSubmit={async (values) => {
//           const { importNodes } = await importNodesMutation.mutateAsync(
//             values.resources.map(({ link, tag }) => ({ link, tag }))
//           )

//           await groupAddNodesMutation.mutateAsync({
//             id: groupQuery.group.id as string,
//             nodeIDs: importNodes.map(({ node }) => node?.id).filter(Boolean) as string[],
//           })

//           queryClient.invalidateQueries({ queryKey: ['defaultGroup'] })
//         }}
//       />

//       <ImportResourceFormModal
//         title={t('subscription')}
//         opened={openedImportSubscriptionFormModal}
//         onClose={closeImportSubscriptionFormModal}
//         handleSubmit={async (values) => {
//           const importSubscriptions = await importSubscriptionsMutation.mutateAsync(
//             values.resources.map(({ link, tag }) => ({ link, tag }))
//           )

//           await groupAddSubscriptionsMutation.mutateAsync({
//             id: groupQuery.group.id,
//             subscriptionIDs: importSubscriptions.map(
//               ({
//                 importSubscription: {
//                   sub: { id },
//                 },
//               }) => id
//             ),
//           })

//           queryClient.invalidateQueries({ queryKey: ['defaultGroup'] })
//         }}
//       />
//     </Fragment>
//   )
// }

export const HomePage = () => {
  return (
    <Container>
      <Stack>
        <Card shadow="sm" withBorder>
          <Group>
            <Image width={120} radius="md" src={logo} />

            <Stack>
              <Title>daed</Title>
              <Text>daed, A Modern Dashboard For dae</Text>
              <Anchor fw={600} href="https://github.com/daeuniverse/daed" target="_blank">
                https://github.com/daeuniverse/daed
              </Anchor>
            </Stack>
          </Group>
        </Card>
      </Stack>
    </Container>
  )
}
