/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Duration: { input: any; output: any }
  Time: { input: any; output: any }
}

export type AndFunctions = {
  __typename?: 'AndFunctions'
  and: Array<Function>
}

export type AndFunctionsOrPlaintext = AndFunctions | Plaintext

export type Config = {
  __typename?: 'Config'
  global: Global
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  selected: Scalars['Boolean']['output']
}

export type ConfigFlatDesc = {
  __typename?: 'ConfigFlatDesc'
  defaultValue: Scalars['String']['output']
  desc: Scalars['String']['output']
  isArray: Scalars['Boolean']['output']
  mapping: Scalars['String']['output']
  name: Scalars['String']['output']
  required: Scalars['Boolean']['output']
  type: Scalars['String']['output']
}

export type Dae = {
  __typename?: 'Dae'
  modified: Scalars['Boolean']['output']
  running: Scalars['Boolean']['output']
  version: Scalars['String']['output']
}

export type DaeDns = {
  __typename?: 'DaeDns'
  routing: DnsRouting
  string: Scalars['String']['output']
  upstream: Array<Param>
}

export type DaeRouting = {
  __typename?: 'DaeRouting'
  fallback: FunctionOrPlaintext
  rules: Array<RoutingRule>
  string: Scalars['String']['output']
}

export type DefaultRoute = {
  __typename?: 'DefaultRoute'
  gateway?: Maybe<Scalars['String']['output']>
  ipVersion: Scalars['String']['output']
  source?: Maybe<Scalars['String']['output']>
}

export type Dns = {
  __typename?: 'Dns'
  dns: DaeDns
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  selected: Scalars['Boolean']['output']
}

export type DnsRouting = {
  __typename?: 'DnsRouting'
  request: DaeRouting
  response: DaeRouting
}

export type Function = {
  __typename?: 'Function'
  name: Scalars['String']['output']
  not: Scalars['Boolean']['output']
  params: Array<Param>
}

export type FunctionOrPlaintext = Function | Plaintext

export type General = {
  __typename?: 'General'
  dae: Dae
  interfaces: Array<Interface>
  schema: Scalars['String']['output']
}

export type GeneralInterfacesArgs = {
  up?: InputMaybe<Scalars['Boolean']['input']>
}

export type Global = {
  __typename?: 'Global'
  allowInsecure: Scalars['Boolean']['output']
  autoConfigFirewallRule: Scalars['Boolean']['output']
  autoConfigKernelParameter: Scalars['Boolean']['output']
  bandwidthMaxRx: Scalars['String']['output']
  bandwidthMaxTx: Scalars['String']['output']
  checkInterval: Scalars['Duration']['output']
  checkTolerance: Scalars['Duration']['output']
  dialMode: Scalars['String']['output']
  disableWaitingNetwork: Scalars['Boolean']['output']
  enableLocalTcpFastRedirect: Scalars['Boolean']['output']
  lanInterface: Array<Scalars['String']['output']>
  logLevel: Scalars['String']['output']
  mptcp: Scalars['Boolean']['output']
  pprofPort: Scalars['Int']['output']
  sniffingTimeout: Scalars['Duration']['output']
  soMarkFromDae: Scalars['Int']['output']
  tcpCheckHttpMethod: Scalars['String']['output']
  tcpCheckUrl: Array<Scalars['String']['output']>
  tlsImplementation: Scalars['String']['output']
  tproxyPort: Scalars['Int']['output']
  tproxyPortProtect: Scalars['Boolean']['output']
  udpCheckDns: Array<Scalars['String']['output']>
  utlsImitate: Scalars['String']['output']
  wanInterface: Array<Scalars['String']['output']>
}

export type Group = {
  __typename?: 'Group'
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  nodes: Array<Node>
  policy: Policy
  policyParams: Array<Param>
  subscriptions: Array<Subscription>
}

export type ImportArgument = {
  link: Scalars['String']['input']
  tag?: InputMaybe<Scalars['String']['input']>
}

export type Interface = {
  __typename?: 'Interface'
  flag: InterfaceFlag
  ifindex: Scalars['Int']['output']
  ip: Array<Scalars['String']['output']>
  name: Scalars['String']['output']
}

export type InterfaceIpArgs = {
  onlyGlobalScope?: InputMaybe<Scalars['Boolean']['input']>
}

export type InterfaceFlag = {
  __typename?: 'InterfaceFlag'
  default?: Maybe<Array<DefaultRoute>>
  up: Scalars['Boolean']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  createConfig: Config
  createDns: Dns
  createGroup: Group
  createRouting: Routing
  createUser: Scalars['String']['output']
  groupAddNodes: Scalars['Int']['output']
  groupAddSubscriptions: Scalars['Int']['output']
  groupDelNodes: Scalars['Int']['output']
  groupDelSubscriptions: Scalars['Int']['output']
  groupSetPolicy: Scalars['Int']['output']
  importNodes: Array<NodeImportResult>
  importSubscription: SubscriptionImportResult
  removeConfig: Scalars['Int']['output']
  removeDns: Scalars['Int']['output']
  removeGroup: Scalars['Int']['output']
  removeJsonStorage: Scalars['Int']['output']
  removeNodes: Scalars['Int']['output']
  removeRouting: Scalars['Int']['output']
  removeSubscriptions: Scalars['Int']['output']
  renameConfig: Scalars['Int']['output']
  renameDns: Scalars['Int']['output']
  renameGroup: Scalars['Int']['output']
  renameRouting: Scalars['Int']['output']
  run: Scalars['Int']['output']
  selectConfig: Scalars['Int']['output']
  selectDns: Scalars['Int']['output']
  selectRouting: Scalars['Int']['output']
  setJsonStorage: Scalars['Int']['output']
  tagNode: Scalars['Int']['output']
  tagSubscription: Scalars['Int']['output']
  updateAvatar: Scalars['Int']['output']
  updateConfig: Config
  updateDns: Dns
  updateName: Scalars['Int']['output']
  updateNode: Node
  updatePassword: Scalars['String']['output']
  updateRouting: Routing
  updateSubscription: Subscription
  updateUsername: Scalars['Int']['output']
}

export type MutationCreateConfigArgs = {
  global?: InputMaybe<GlobalInput>
  name?: InputMaybe<Scalars['String']['input']>
}

export type MutationCreateDnsArgs = {
  dns?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
}

export type MutationCreateGroupArgs = {
  name: Scalars['String']['input']
  policy: Policy
  policyParams?: InputMaybe<Array<PolicyParam>>
}

export type MutationCreateRoutingArgs = {
  name?: InputMaybe<Scalars['String']['input']>
  routing?: InputMaybe<Scalars['String']['input']>
}

export type MutationCreateUserArgs = {
  password: Scalars['String']['input']
  username: Scalars['String']['input']
}

export type MutationGroupAddNodesArgs = {
  id: Scalars['ID']['input']
  nodeIDs: Array<Scalars['ID']['input']>
}

export type MutationGroupAddSubscriptionsArgs = {
  id: Scalars['ID']['input']
  subscriptionIDs: Array<Scalars['ID']['input']>
}

export type MutationGroupDelNodesArgs = {
  id: Scalars['ID']['input']
  nodeIDs: Array<Scalars['ID']['input']>
}

export type MutationGroupDelSubscriptionsArgs = {
  id: Scalars['ID']['input']
  subscriptionIDs: Array<Scalars['ID']['input']>
}

export type MutationGroupSetPolicyArgs = {
  id: Scalars['ID']['input']
  policy: Policy
  policyParams?: InputMaybe<Array<PolicyParam>>
}

export type MutationImportNodesArgs = {
  args: Array<ImportArgument>
  rollbackError: Scalars['Boolean']['input']
}

export type MutationImportSubscriptionArgs = {
  arg: ImportArgument
  rollbackError: Scalars['Boolean']['input']
}

export type MutationRemoveConfigArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveDnsArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveGroupArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveJsonStorageArgs = {
  paths?: InputMaybe<Array<Scalars['String']['input']>>
}

export type MutationRemoveNodesArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationRemoveRoutingArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveSubscriptionsArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationRenameConfigArgs = {
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}

export type MutationRenameDnsArgs = {
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}

export type MutationRenameGroupArgs = {
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}

export type MutationRenameRoutingArgs = {
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}

export type MutationRunArgs = {
  dry: Scalars['Boolean']['input']
}

export type MutationSelectConfigArgs = {
  id: Scalars['ID']['input']
}

export type MutationSelectDnsArgs = {
  id: Scalars['ID']['input']
}

export type MutationSelectRoutingArgs = {
  id: Scalars['ID']['input']
}

export type MutationSetJsonStorageArgs = {
  paths: Array<Scalars['String']['input']>
  values: Array<Scalars['String']['input']>
}

export type MutationTagNodeArgs = {
  id: Scalars['ID']['input']
  tag: Scalars['String']['input']
}

export type MutationTagSubscriptionArgs = {
  id: Scalars['ID']['input']
  tag: Scalars['String']['input']
}

export type MutationUpdateAvatarArgs = {
  avatar?: InputMaybe<Scalars['String']['input']>
}

export type MutationUpdateConfigArgs = {
  global: GlobalInput
  id: Scalars['ID']['input']
}

export type MutationUpdateDnsArgs = {
  dns: Scalars['String']['input']
  id: Scalars['ID']['input']
}

export type MutationUpdateNameArgs = {
  name?: InputMaybe<Scalars['String']['input']>
}

export type MutationUpdateNodeArgs = {
  id: Scalars['ID']['input']
  newLink: Scalars['String']['input']
}

export type MutationUpdatePasswordArgs = {
  currentPassword: Scalars['String']['input']
  newPassword: Scalars['String']['input']
}

export type MutationUpdateRoutingArgs = {
  id: Scalars['ID']['input']
  routing: Scalars['String']['input']
}

export type MutationUpdateSubscriptionArgs = {
  id: Scalars['ID']['input']
}

export type MutationUpdateUsernameArgs = {
  username: Scalars['String']['input']
}

export type Node = {
  __typename?: 'Node'
  address: Scalars['String']['output']
  id: Scalars['ID']['output']
  link: Scalars['String']['output']
  name: Scalars['String']['output']
  protocol: Scalars['String']['output']
  subscriptionID?: Maybe<Scalars['ID']['output']>
  tag?: Maybe<Scalars['String']['output']>
}

export type NodeImportResult = {
  __typename?: 'NodeImportResult'
  error?: Maybe<Scalars['String']['output']>
  link: Scalars['String']['output']
  node?: Maybe<Node>
}

export type NodesConnection = {
  __typename?: 'NodesConnection'
  edges: Array<Node>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['ID']['output']>
  hasNextPage: Scalars['Boolean']['output']
  startCursor?: Maybe<Scalars['ID']['output']>
}

export type Param = {
  __typename?: 'Param'
  key: Scalars['String']['output']
  val: Scalars['String']['output']
}

export type Plaintext = {
  __typename?: 'Plaintext'
  val: Scalars['String']['output']
}

export enum Policy {
  Fixed = 'fixed',
  Min = 'min',
  MinAvg10 = 'min_avg10',
  MinMovingAvg = 'min_moving_avg',
  Random = 'random',
}

export type PolicyParam = {
  key?: InputMaybe<Scalars['String']['input']>
  val: Scalars['String']['input']
}

export type Query = {
  __typename?: 'Query'
  configFlatDesc: Array<ConfigFlatDesc>
  configs: Array<Config>
  dnss: Array<Dns>
  general: General
  group: Group
  groups: Array<Group>
  healthCheck: Scalars['Int']['output']
  jsonStorage: Array<Scalars['String']['output']>
  nodes: NodesConnection
  numberUsers: Scalars['Int']['output']
  parsedDns: DaeDns
  parsedRouting: DaeRouting
  routings: Array<Routing>
  subscriptions: Array<Subscription>
  token: Scalars['String']['output']
  user: User
}

export type QueryConfigsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  selected?: InputMaybe<Scalars['Boolean']['input']>
}

export type QueryDnssArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  selected?: InputMaybe<Scalars['Boolean']['input']>
}

export type QueryGroupArgs = {
  name: Scalars['String']['input']
}

export type QueryGroupsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
}

export type QueryJsonStorageArgs = {
  paths?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryNodesArgs = {
  after?: InputMaybe<Scalars['ID']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['ID']['input']>
  subscriptionId?: InputMaybe<Scalars['ID']['input']>
}

export type QueryParsedDnsArgs = {
  raw: Scalars['String']['input']
}

export type QueryParsedRoutingArgs = {
  raw: Scalars['String']['input']
}

export type QueryRoutingsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  selected?: InputMaybe<Scalars['Boolean']['input']>
}

export type QuerySubscriptionsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
}

export type QueryTokenArgs = {
  password: Scalars['String']['input']
  username: Scalars['String']['input']
}

export enum Role {
  Admin = 'ADMIN',
}

export type Routing = {
  __typename?: 'Routing'
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  referenceGroups: Array<Scalars['String']['output']>
  routing: DaeRouting
  selected: Scalars['Boolean']['output']
}

export type RoutingRule = {
  __typename?: 'RoutingRule'
  conditions: AndFunctions
  outbound: Function
}

export type Subscription = {
  __typename?: 'Subscription'
  id: Scalars['ID']['output']
  info: Scalars['String']['output']
  link: Scalars['String']['output']
  nodes: NodesConnection
  status: Scalars['String']['output']
  tag?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Time']['output']
}

export type SubscriptionNodesArgs = {
  after?: InputMaybe<Scalars['ID']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
}

export type SubscriptionImportResult = {
  __typename?: 'SubscriptionImportResult'
  link: Scalars['String']['output']
  nodeImportResult: Array<NodeImportResult>
  sub: Subscription
}

export type User = {
  __typename?: 'User'
  avatar?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  username: Scalars['String']['output']
}

export type GlobalInput = {
  allowInsecure?: InputMaybe<Scalars['Boolean']['input']>
  autoConfigFirewallRule?: InputMaybe<Scalars['Boolean']['input']>
  autoConfigKernelParameter?: InputMaybe<Scalars['Boolean']['input']>
  bandwidthMaxRx?: InputMaybe<Scalars['String']['input']>
  bandwidthMaxTx?: InputMaybe<Scalars['String']['input']>
  checkInterval?: InputMaybe<Scalars['Duration']['input']>
  checkTolerance?: InputMaybe<Scalars['Duration']['input']>
  dialMode?: InputMaybe<Scalars['String']['input']>
  disableWaitingNetwork?: InputMaybe<Scalars['Boolean']['input']>
  enableLocalTcpFastRedirect?: InputMaybe<Scalars['Boolean']['input']>
  lanInterface?: InputMaybe<Array<Scalars['String']['input']>>
  logLevel?: InputMaybe<Scalars['String']['input']>
  mptcp?: InputMaybe<Scalars['Boolean']['input']>
  pprofPort?: InputMaybe<Scalars['Int']['input']>
  sniffingTimeout?: InputMaybe<Scalars['Duration']['input']>
  soMarkFromDae?: InputMaybe<Scalars['Int']['input']>
  tcpCheckHttpMethod?: InputMaybe<Scalars['String']['input']>
  tcpCheckUrl?: InputMaybe<Array<Scalars['String']['input']>>
  tlsImplementation?: InputMaybe<Scalars['String']['input']>
  tproxyPort?: InputMaybe<Scalars['Int']['input']>
  tproxyPortProtect?: InputMaybe<Scalars['Boolean']['input']>
  udpCheckDns?: InputMaybe<Array<Scalars['String']['input']>>
  utlsImitate?: InputMaybe<Scalars['String']['input']>
  wanInterface?: InputMaybe<Array<Scalars['String']['input']>>
}

export type SetJsonStorageMutationVariables = Exact<{
  paths: Array<Scalars['String']['input']> | Scalars['String']['input']
  values: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type SetJsonStorageMutation = { __typename?: 'Mutation'; setJsonStorage: number }

export type SetModeMutationVariables = Exact<{
  paths: Array<Scalars['String']['input']> | Scalars['String']['input']
  values: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type SetModeMutation = { __typename?: 'Mutation'; setJsonStorage: number }

export type CreateConfigMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>
  global?: InputMaybe<GlobalInput>
}>

export type CreateConfigMutation = { __typename?: 'Mutation'; createConfig: { __typename?: 'Config'; id: string } }

export type UpdateConfigMutationVariables = Exact<{
  id: Scalars['ID']['input']
  global: GlobalInput
}>

export type UpdateConfigMutation = { __typename?: 'Mutation'; updateConfig: { __typename?: 'Config'; id: string } }

export type RemoveConfigMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveConfigMutation = { __typename?: 'Mutation'; removeConfig: number }

export type SelectConfigMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type SelectConfigMutation = { __typename?: 'Mutation'; selectConfig: number }

export type RenameConfigMutationVariables = Exact<{
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}>

export type RenameConfigMutation = { __typename?: 'Mutation'; renameConfig: number }

export type CreateRoutingMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>
  routing?: InputMaybe<Scalars['String']['input']>
}>

export type CreateRoutingMutation = { __typename?: 'Mutation'; createRouting: { __typename?: 'Routing'; id: string } }

export type UpdateRoutingMutationVariables = Exact<{
  id: Scalars['ID']['input']
  routing: Scalars['String']['input']
}>

export type UpdateRoutingMutation = { __typename?: 'Mutation'; updateRouting: { __typename?: 'Routing'; id: string } }

export type RemoveRoutingMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveRoutingMutation = { __typename?: 'Mutation'; removeRouting: number }

export type SelectRoutingMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type SelectRoutingMutation = { __typename?: 'Mutation'; selectRouting: number }

export type RenameRoutingMutationVariables = Exact<{
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}>

export type RenameRoutingMutation = { __typename?: 'Mutation'; renameRouting: number }

export type CreateDnsMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>
  dns?: InputMaybe<Scalars['String']['input']>
}>

export type CreateDnsMutation = { __typename?: 'Mutation'; createDns: { __typename?: 'Dns'; id: string } }

export type UpdateDnsMutationVariables = Exact<{
  id: Scalars['ID']['input']
  dns: Scalars['String']['input']
}>

export type UpdateDnsMutation = { __typename?: 'Mutation'; updateDns: { __typename?: 'Dns'; id: string } }

export type RemoveDnsMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveDnsMutation = { __typename?: 'Mutation'; removeDns: number }

export type SelectDnsMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type SelectDnsMutation = { __typename?: 'Mutation'; selectDns: number }

export type RenameDnsMutationVariables = Exact<{
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}>

export type RenameDnsMutation = { __typename?: 'Mutation'; renameDns: number }

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String']['input']
  policy: Policy
  policyParams?: InputMaybe<Array<PolicyParam> | PolicyParam>
}>

export type CreateGroupMutation = { __typename?: 'Mutation'; createGroup: { __typename?: 'Group'; id: string } }

export type RemoveGroupMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RemoveGroupMutation = { __typename?: 'Mutation'; removeGroup: number }

export type GroupSetPolicyMutationVariables = Exact<{
  id: Scalars['ID']['input']
  policy: Policy
  policyParams?: InputMaybe<Array<PolicyParam> | PolicyParam>
}>

export type GroupSetPolicyMutation = { __typename?: 'Mutation'; groupSetPolicy: number }

export type RenameGroupMutationVariables = Exact<{
  id: Scalars['ID']['input']
  name: Scalars['String']['input']
}>

export type RenameGroupMutation = { __typename?: 'Mutation'; renameGroup: number }

export type GroupAddNodesMutationVariables = Exact<{
  id: Scalars['ID']['input']
  nodeIDs: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type GroupAddNodesMutation = { __typename?: 'Mutation'; groupAddNodes: number }

export type GroupDelNodesMutationVariables = Exact<{
  id: Scalars['ID']['input']
  nodeIDs: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type GroupDelNodesMutation = { __typename?: 'Mutation'; groupDelNodes: number }

export type GroupAddSubscriptionsMutationVariables = Exact<{
  id: Scalars['ID']['input']
  subscriptionIDs: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type GroupAddSubscriptionsMutation = { __typename?: 'Mutation'; groupAddSubscriptions: number }

export type GroupDelSubscriptionsMutationVariables = Exact<{
  id: Scalars['ID']['input']
  subscriptionIDs: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type GroupDelSubscriptionsMutation = { __typename?: 'Mutation'; groupDelSubscriptions: number }

export type ImportNodesMutationVariables = Exact<{
  rollbackError: Scalars['Boolean']['input']
  args: Array<ImportArgument> | ImportArgument
}>

export type ImportNodesMutation = {
  __typename?: 'Mutation'
  importNodes: Array<{
    __typename?: 'NodeImportResult'
    link: string
    error?: string | null
    node?: { __typename?: 'Node'; id: string } | null
  }>
}

export type RemoveNodesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type RemoveNodesMutation = { __typename?: 'Mutation'; removeNodes: number }

export type ImportSubscriptionMutationVariables = Exact<{
  rollbackError: Scalars['Boolean']['input']
  arg: ImportArgument
}>

export type ImportSubscriptionMutation = {
  __typename?: 'Mutation'
  importSubscription: {
    __typename?: 'SubscriptionImportResult'
    link: string
    sub: { __typename?: 'Subscription'; id: string }
    nodeImportResult: Array<{ __typename?: 'NodeImportResult'; node?: { __typename?: 'Node'; id: string } | null }>
  }
}

export type UpdateSubscriptionMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type UpdateSubscriptionMutation = {
  __typename?: 'Mutation'
  updateSubscription: { __typename?: 'Subscription'; id: string }
}

export type RemoveSubscriptionsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type RemoveSubscriptionsMutation = { __typename?: 'Mutation'; removeSubscriptions: number }

export type RunMutationVariables = Exact<{
  dry: Scalars['Boolean']['input']
}>

export type RunMutation = { __typename?: 'Mutation'; run: number }

export type UpdateAvatarMutationVariables = Exact<{
  avatar?: InputMaybe<Scalars['String']['input']>
}>

export type UpdateAvatarMutation = { __typename?: 'Mutation'; updateAvatar: number }

export type UpdateNameMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>
}>

export type UpdateNameMutation = { __typename?: 'Mutation'; updateName: number }

export type ModeQueryVariables = Exact<{
  paths?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
}>

export type ModeQuery = { __typename?: 'Query'; jsonStorage: Array<string> }

export type DefaultsQueryVariables = Exact<{
  paths?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
}>

export type DefaultsQuery = { __typename?: 'Query'; jsonStorage: Array<string> }

export type InterfacesQueryVariables = Exact<{
  up?: InputMaybe<Scalars['Boolean']['input']>
}>

export type InterfacesQuery = {
  __typename?: 'Query'
  general: {
    __typename?: 'General'
    interfaces: Array<{
      __typename?: 'Interface'
      name: string
      ifindex: number
      ip: Array<string>
      flag: {
        __typename?: 'InterfaceFlag'
        default?: Array<{ __typename?: 'DefaultRoute'; gateway?: string | null }> | null
      }
    }>
  }
}

export type JsonStorageQueryVariables = Exact<{
  paths?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>
}>

export type JsonStorageQuery = { __typename?: 'Query'; jsonStorage: Array<string> }

export type GeneralQueryVariables = Exact<{
  up?: InputMaybe<Scalars['Boolean']['input']>
}>

export type GeneralQuery = {
  __typename?: 'Query'
  general: {
    __typename?: 'General'
    dae: { __typename?: 'Dae'; running: boolean; modified: boolean; version: string }
    interfaces: Array<{
      __typename?: 'Interface'
      name: string
      ifindex: number
      ip: Array<string>
      flag: {
        __typename?: 'InterfaceFlag'
        default?: Array<{ __typename?: 'DefaultRoute'; gateway?: string | null }> | null
      }
    }>
  }
}

export type NodesQueryVariables = Exact<{ [key: string]: never }>

export type NodesQuery = {
  __typename?: 'Query'
  nodes: {
    __typename?: 'NodesConnection'
    edges: Array<{
      __typename?: 'Node'
      id: string
      name: string
      link: string
      address: string
      protocol: string
      tag?: string | null
    }>
  }
}

export type SubscriptionsQueryVariables = Exact<{ [key: string]: never }>

export type SubscriptionsQuery = {
  __typename?: 'Query'
  subscriptions: Array<{
    __typename?: 'Subscription'
    id: string
    tag?: string | null
    status: string
    link: string
    info: string
    updatedAt: any
    nodes: {
      __typename?: 'NodesConnection'
      edges: Array<{ __typename?: 'Node'; id: string; name: string; protocol: string; link: string }>
    }
  }>
}

export type ConfigsQueryVariables = Exact<{ [key: string]: never }>

export type ConfigsQuery = {
  __typename?: 'Query'
  configs: Array<{
    __typename?: 'Config'
    id: string
    name: string
    selected: boolean
    global: {
      __typename?: 'Global'
      logLevel: string
      tproxyPort: number
      allowInsecure: boolean
      checkInterval: any
      checkTolerance: any
      lanInterface: Array<string>
      wanInterface: Array<string>
      udpCheckDns: Array<string>
      tcpCheckUrl: Array<string>
      dialMode: string
      tcpCheckHttpMethod: string
      disableWaitingNetwork: boolean
      autoConfigKernelParameter: boolean
      sniffingTimeout: any
      tlsImplementation: string
      utlsImitate: string
      tproxyPortProtect: boolean
      soMarkFromDae: number
      pprofPort: number
      enableLocalTcpFastRedirect: boolean
      mptcp: boolean
      bandwidthMaxTx: string
      bandwidthMaxRx: string
    }
  }>
}

export type GroupsQueryVariables = Exact<{ [key: string]: never }>

export type GroupsQuery = {
  __typename?: 'Query'
  groups: Array<{
    __typename?: 'Group'
    id: string
    name: string
    policy: Policy
    nodes: Array<{
      __typename?: 'Node'
      id: string
      link: string
      name: string
      address: string
      protocol: string
      tag?: string | null
      subscriptionID?: string | null
    }>
    subscriptions: Array<{
      __typename?: 'Subscription'
      id: string
      updatedAt: any
      tag?: string | null
      link: string
      status: string
      info: string
      nodes: {
        __typename?: 'NodesConnection'
        edges: Array<{
          __typename?: 'Node'
          id: string
          link: string
          name: string
          address: string
          protocol: string
          tag?: string | null
          subscriptionID?: string | null
        }>
      }
    }>
    policyParams: Array<{ __typename?: 'Param'; key: string; val: string }>
  }>
}

export type RoutingsQueryVariables = Exact<{ [key: string]: never }>

export type RoutingsQuery = {
  __typename?: 'Query'
  routings: Array<{
    __typename?: 'Routing'
    id: string
    name: string
    selected: boolean
    routing: { __typename?: 'DaeRouting'; string: string }
  }>
}

export type DnSsQueryVariables = Exact<{ [key: string]: never }>

export type DnSsQuery = {
  __typename?: 'Query'
  dnss: Array<{
    __typename?: 'Dns'
    id: string
    name: string
    selected: boolean
    dns: {
      __typename?: 'DaeDns'
      string: string
      routing: {
        __typename?: 'DnsRouting'
        request: { __typename?: 'DaeRouting'; string: string }
        response: { __typename?: 'DaeRouting'; string: string }
      }
    }
  }>
}

export type UserQueryVariables = Exact<{ [key: string]: never }>

export type UserQuery = {
  __typename?: 'Query'
  user: { __typename?: 'User'; username: string; name?: string | null; avatar?: string | null }
}

export type NumberUsersQueryVariables = Exact<{ [key: string]: never }>

export type NumberUsersQuery = { __typename?: 'Query'; numberUsers: number }

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']['input']
  password: Scalars['String']['input']
}>

export type CreateUserMutation = { __typename?: 'Mutation'; createUser: string }

export type TokenQueryVariables = Exact<{
  username: Scalars['String']['input']
  password: Scalars['String']['input']
}>

export type TokenQuery = { __typename?: 'Query'; token: string }

export const SetJsonStorageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetJsonStorage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'values' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setJsonStorage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paths' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'values' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'values' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SetJsonStorageMutation, SetJsonStorageMutationVariables>
export const SetModeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SetMode' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'values' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'setJsonStorage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paths' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'values' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'values' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SetModeMutation, SetModeMutationVariables>
export const CreateConfigDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'global' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'globalInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'global' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'global' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateConfigMutation, CreateConfigMutationVariables>
export const UpdateConfigDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'global' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'globalInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'global' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'global' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateConfigMutation, UpdateConfigMutationVariables>
export const RemoveConfigDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveConfigMutation, RemoveConfigMutationVariables>
export const SelectConfigDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SelectConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'selectConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SelectConfigMutation, SelectConfigMutationVariables>
export const RenameConfigDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RenameConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'renameConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RenameConfigMutation, RenameConfigMutationVariables>
export const CreateRoutingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateRouting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'routing' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createRouting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'routing' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'routing' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateRoutingMutation, CreateRoutingMutationVariables>
export const UpdateRoutingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateRouting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'routing' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateRouting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'routing' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'routing' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateRoutingMutation, UpdateRoutingMutationVariables>
export const RemoveRoutingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveRouting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeRouting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveRoutingMutation, RemoveRoutingMutationVariables>
export const SelectRoutingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SelectRouting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'selectRouting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SelectRoutingMutation, SelectRoutingMutationVariables>
export const RenameRoutingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RenameRouting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'renameRouting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RenameRoutingMutation, RenameRoutingMutationVariables>
export const CreateDnsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateDNS' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dns' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createDns' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dns' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dns' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateDnsMutation, CreateDnsMutationVariables>
export const UpdateDnsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateDNS' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dns' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateDns' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dns' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dns' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateDnsMutation, UpdateDnsMutationVariables>
export const RemoveDnsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveDNS' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeDns' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveDnsMutation, RemoveDnsMutationVariables>
export const SelectDnsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SelectDNS' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'selectDns' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SelectDnsMutation, SelectDnsMutationVariables>
export const RenameDnsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RenameDNS' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'renameDns' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RenameDnsMutation, RenameDnsMutationVariables>
export const CreateGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'policy' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Policy' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'policyParams' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'PolicyParam' } } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGroup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'policy' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'policy' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'policyParams' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'policyParams' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>
export const RemoveGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeGroup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveGroupMutation, RemoveGroupMutationVariables>
export const GroupSetPolicyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GroupSetPolicy' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'policy' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Policy' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'policyParams' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'PolicyParam' } } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groupSetPolicy' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'policy' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'policy' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'policyParams' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'policyParams' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupSetPolicyMutation, GroupSetPolicyMutationVariables>
export const RenameGroupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RenameGroup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'renameGroup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RenameGroupMutation, RenameGroupMutationVariables>
export const GroupAddNodesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GroupAddNodes' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'nodeIDs' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groupAddNodes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'nodeIDs' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'nodeIDs' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupAddNodesMutation, GroupAddNodesMutationVariables>
export const GroupDelNodesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GroupDelNodes' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'nodeIDs' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groupDelNodes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'nodeIDs' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'nodeIDs' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupDelNodesMutation, GroupDelNodesMutationVariables>
export const GroupAddSubscriptionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GroupAddSubscriptions' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'subscriptionIDs' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groupAddSubscriptions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'subscriptionIDs' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'subscriptionIDs' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupAddSubscriptionsMutation, GroupAddSubscriptionsMutationVariables>
export const GroupDelSubscriptionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GroupDelSubscriptions' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'subscriptionIDs' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groupDelSubscriptions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'subscriptionIDs' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'subscriptionIDs' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupDelSubscriptionsMutation, GroupDelSubscriptionsMutationVariables>
export const ImportNodesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ImportNodes' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'rollbackError' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'args' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'ImportArgument' } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'importNodes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'rollbackError' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'rollbackError' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'args' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'args' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'node' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImportNodesMutation, ImportNodesMutationVariables>
export const RemoveNodesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveNodes' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeNodes' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ids' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveNodesMutation, RemoveNodesMutationVariables>
export const ImportSubscriptionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ImportSubscription' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'rollbackError' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'arg' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ImportArgument' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'importSubscription' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'rollbackError' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'rollbackError' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'arg' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'arg' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sub' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodeImportResult' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImportSubscriptionMutation, ImportSubscriptionMutationVariables>
export const UpdateSubscriptionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSubscription' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSubscription' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateSubscriptionMutation, UpdateSubscriptionMutationVariables>
export const RemoveSubscriptionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveSubscriptions' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeSubscriptions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ids' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'ids' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveSubscriptionsMutation, RemoveSubscriptionsMutationVariables>
export const RunDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Run' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dry' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'run' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dry' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dry' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RunMutation, RunMutationVariables>
export const UpdateAvatarDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateAvatar' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'avatar' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateAvatar' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'avatar' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'avatar' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateAvatarMutation, UpdateAvatarMutationVariables>
export const UpdateNameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateName' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateName' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateNameMutation, UpdateNameMutationVariables>
export const ModeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Mode' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'jsonStorage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paths' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ModeQuery, ModeQueryVariables>
export const DefaultsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Defaults' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'jsonStorage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paths' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DefaultsQuery, DefaultsQueryVariables>
export const InterfacesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Interfaces' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'up' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'general' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'interfaces' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'up' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'up' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'ifindex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'ip' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flag' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'default' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'gateway' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InterfacesQuery, InterfacesQueryVariables>
export const JsonStorageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'JsonStorage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'jsonStorage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paths' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'paths' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<JsonStorageQuery, JsonStorageQueryVariables>
export const GeneralDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'General' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'up' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'general' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dae' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'running' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'modified' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'version' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'interfaces' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'up' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'up' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'ifindex' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'ip' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'flag' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'default' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'gateway' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GeneralQuery, GeneralQueryVariables>
export const NodesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Nodes' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nodes' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'protocol' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NodesQuery, NodesQueryVariables>
export const SubscriptionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Subscriptions' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'subscriptions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                { kind: 'Field', name: { kind: 'Name', value: 'info' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'edges' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'protocol' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SubscriptionsQuery, SubscriptionsQueryVariables>
export const ConfigsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Configs' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'configs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'selected' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'global' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'logLevel' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tproxyPort' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'allowInsecure' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'checkInterval' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'checkTolerance' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lanInterface' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'wanInterface' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'udpCheckDns' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tcpCheckUrl' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'dialMode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tcpCheckHttpMethod' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'disableWaitingNetwork' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'autoConfigKernelParameter' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sniffingTimeout' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tlsImplementation' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'utlsImitate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tproxyPortProtect' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'soMarkFromDae' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'pprofPort' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enableLocalTcpFastRedirect' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'mptcp' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'bandwidthMaxTx' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'bandwidthMaxRx' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConfigsQuery, ConfigsQueryVariables>
export const GroupsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Groups' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'groups' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'protocol' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subscriptionID' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'subscriptions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'info' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nodes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'edges' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'link' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'protocol' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'subscriptionID' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'policy' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'policyParams' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'val' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>
export const RoutingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Routings' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'routings' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'selected' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'routing' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'string' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RoutingsQuery, RoutingsQueryVariables>
export const DnSsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'DNSs' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'dnss' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'dns' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'string' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'routing' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'request' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'string' } }],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'response' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'string' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'selected' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DnSsQuery, DnSsQueryVariables>
export const UserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'User' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'username' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'avatar' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserQuery, UserQueryVariables>
export const NumberUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'NumberUsers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'numberUsers' } }],
      },
    },
  ],
} as unknown as DocumentNode<NumberUsersQuery, NumberUsersQueryVariables>
export const CreateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'username' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>
export const TokenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Token' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'token' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'username' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TokenQuery, TokenQueryVariables>
