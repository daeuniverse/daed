/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Duration: any
  Time: any
}

export type AndFunctions = {
  __typename?: 'AndFunctions'
  and: Array<Function>
}

export type AndFunctionsOrPlaintext = AndFunctions | Plaintext

export type Config = {
  __typename?: 'Config'
  global: Global
  id: Scalars['ID']
  name: Scalars['String']
  selected: Scalars['Boolean']
}

export type ConfigFlatDesc = {
  __typename?: 'ConfigFlatDesc'
  defaultValue: Scalars['String']
  desc: Scalars['String']
  isArray: Scalars['Boolean']
  mapping: Scalars['String']
  name: Scalars['String']
  required: Scalars['Boolean']
  type: Scalars['String']
}

export type Dae = {
  __typename?: 'Dae'
  /** modified indicates whether the running config has been modified. */
  modified: Scalars['Boolean']
  running: Scalars['Boolean']
}

export type DaeDns = {
  __typename?: 'DaeDns'
  routing: DnsRouting
  string: Scalars['String']
  upstream: Array<Param>
}

export type DaeRouting = {
  __typename?: 'DaeRouting'
  fallback: FunctionOrPlaintext
  rules: Array<RoutingRule>
  string: Scalars['String']
}

export type DefaultRoute = {
  __typename?: 'DefaultRoute'
  gateway?: Maybe<Scalars['String']>
  ipVersion: Scalars['String']
  source?: Maybe<Scalars['String']>
}

export type Dns = {
  __typename?: 'Dns'
  dns: DaeDns
  id: Scalars['ID']
  name: Scalars['String']
  selected: Scalars['Boolean']
}

export type DnsRouting = {
  __typename?: 'DnsRouting'
  request: DaeRouting
  response: DaeRouting
}

export type Function = {
  __typename?: 'Function'
  name: Scalars['String']
  not: Scalars['Boolean']
  params: Array<Param>
}

export type FunctionOrPlaintext = Function | Plaintext

export type General = {
  __typename?: 'General'
  dae: Dae
  interfaces: Array<Interface>
}

export type GeneralInterfacesArgs = {
  up?: InputMaybe<Scalars['Boolean']>
}

export type Global = {
  __typename?: 'Global'
  allowInsecure: Scalars['Boolean']
  checkInterval: Scalars['Duration']
  checkTolerance: Scalars['Duration']
  dialMode: Scalars['String']
  dnsUpstream: Scalars['String']
  lanInterface: Array<Scalars['String']>
  lanNatDirect: Scalars['Boolean']
  logLevel: Scalars['String']
  tcpCheckUrl: Scalars['String']
  tproxyPort: Scalars['Int']
  udpCheckDns: Scalars['String']
  wanInterface: Array<Scalars['String']>
}

export type Group = {
  __typename?: 'Group'
  id: Scalars['ID']
  name: Scalars['String']
  nodes: Array<Node>
  policy: Policy
  policyParams: Array<Param>
  subscriptions: Array<Subscription>
}

export type ImportArgument = {
  link: Scalars['String']
  tag?: InputMaybe<Scalars['String']>
}

export type Interface = {
  __typename?: 'Interface'
  flag: InterfaceFlag
  ifindex: Scalars['Int']
  ip: Array<Scalars['String']>
  name: Scalars['String']
}

export type InterfaceIpArgs = {
  onlyGlobalScope?: InputMaybe<Scalars['Boolean']>
}

export type InterfaceFlag = {
  __typename?: 'InterfaceFlag'
  default?: Maybe<Array<DefaultRoute>>
  up: Scalars['Boolean']
}

export type Mutation = {
  __typename?: 'Mutation'
  /** createConfig creates a global config. Null arguments will be converted to default value. */
  createConfig: Config
  /** createConfig creates a dns config. Null arguments will be converted to default value. */
  createDns: Dns
  /** createGroup is to create a group. */
  createGroup: Group
  /** createConfig creates a routing config. Null arguments will be converted to default value. */
  createRouting: Routing
  /** createUser creates a user if there is no user. */
  createUser: Scalars['String']
  /** groupAddNodes is to add nodes to the group. Nodes will not be removed from its subscription when subscription update. */
  groupAddNodes: Scalars['Int']
  /** groupAddSubscriptions is to add subscriptions to the group. */
  groupAddSubscriptions: Scalars['Int']
  /** groupDelNodes is to remove nodes from the group. */
  groupDelNodes: Scalars['Int']
  /** groupDelSubscriptions is to remove subscriptions from the group. */
  groupDelSubscriptions: Scalars['Int']
  /** groupSetPolicy is to set the group a new policy. */
  groupSetPolicy: Scalars['Int']
  /** importNodes is to import nodes with no subscription ID. rollbackError means abort the import on error. */
  importNodes: Array<NodeImportResult>
  /** importSubscription is to fetch and resolve the subscription into nodes. */
  importSubscription: SubscriptionImportResult
  /** removeConfig is to remove a config with given config ID. */
  removeConfig: Scalars['Int']
  /** removeDns is to remove a dns config with given dns ID. */
  removeDns: Scalars['Int']
  /** removeGroup is to remove a group. */
  removeGroup: Scalars['Int']
  /** removeJsonStorage remove given paths from user related json storage. Empty paths is to clear json storage. Refer to https://github.com/tidwall/sjson */
  removeJsonStorage: Scalars['Int']
  /** removeNodes is to remove nodes that have no subscription ID. */
  removeNodes: Scalars['Int']
  /** removeRouting is to remove a routing config with given routing ID. */
  removeRouting: Scalars['Int']
  /** removeSubscriptions is to remove subscriptions with given ID list. */
  removeSubscriptions: Scalars['Int']
  /** renameConfig is to give the config a new name. */
  renameConfig: Scalars['Int']
  /** renameDns is to give the dns config a new name. */
  renameDns: Scalars['Int']
  /** renameGroup is to rename a group. */
  renameGroup: Scalars['Int']
  /** renameRouting is to give the routing config a new name. */
  renameRouting: Scalars['Int']
  /** run proxy with selected config+dns+routing. Dry-run can be used to stop the proxy. */
  run: Scalars['Int']
  /** selectConfig is to select a config as the current config. */
  selectConfig: Scalars['Int']
  /** selectConfig is to select a dns config as the current dns. */
  selectDns: Scalars['Int']
  /** selectConfig is to select a routing config as the current routing. */
  selectRouting: Scalars['Int']
  /** setJsonStorage set given paths to values in user related json storage. Refer to https://github.com/tidwall/sjson */
  setJsonStorage: Scalars['Int']
  /** tagNode is to give the node a new tag. */
  tagNode: Scalars['Int']
  /** tagSubscription is to give the subscription a new tag. */
  tagSubscription: Scalars['Int']
  /** updateConfig allows to partially update global config with given id. */
  updateConfig: Config
  /** updateDns is to update dns config with given id. */
  updateDns: Dns
  /** updateRouting is to update routing config with given id. */
  updateRouting: Routing
  /** updateSubscription is to re-fetch subscription and resolve subscription into nodes. Old nodes that independently belong to any groups will not be removed. */
  updateSubscription: Subscription
}

export type MutationCreateConfigArgs = {
  global?: InputMaybe<GlobalInput>
  name?: InputMaybe<Scalars['String']>
}

export type MutationCreateDnsArgs = {
  dns?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
}

export type MutationCreateGroupArgs = {
  name: Scalars['String']
  policy: Policy
  policyParams?: InputMaybe<Array<PolicyParam>>
}

export type MutationCreateRoutingArgs = {
  name?: InputMaybe<Scalars['String']>
  routing?: InputMaybe<Scalars['String']>
}

export type MutationCreateUserArgs = {
  password: Scalars['String']
  username: Scalars['String']
}

export type MutationGroupAddNodesArgs = {
  id: Scalars['ID']
  nodeIDs: Array<Scalars['ID']>
}

export type MutationGroupAddSubscriptionsArgs = {
  id: Scalars['ID']
  subscriptionIDs: Array<Scalars['ID']>
}

export type MutationGroupDelNodesArgs = {
  id: Scalars['ID']
  nodeIDs: Array<Scalars['ID']>
}

export type MutationGroupDelSubscriptionsArgs = {
  id: Scalars['ID']
  subscriptionIDs: Array<Scalars['ID']>
}

export type MutationGroupSetPolicyArgs = {
  id: Scalars['ID']
  policy: Policy
  policyParams?: InputMaybe<Array<PolicyParam>>
}

export type MutationImportNodesArgs = {
  args: Array<ImportArgument>
  rollbackError: Scalars['Boolean']
}

export type MutationImportSubscriptionArgs = {
  arg: ImportArgument
  rollbackError: Scalars['Boolean']
}

export type MutationRemoveConfigArgs = {
  id: Scalars['ID']
}

export type MutationRemoveDnsArgs = {
  id: Scalars['ID']
}

export type MutationRemoveGroupArgs = {
  id: Scalars['ID']
}

export type MutationRemoveJsonStorageArgs = {
  paths?: InputMaybe<Array<Scalars['String']>>
}

export type MutationRemoveNodesArgs = {
  ids: Array<Scalars['ID']>
}

export type MutationRemoveRoutingArgs = {
  id: Scalars['ID']
}

export type MutationRemoveSubscriptionsArgs = {
  ids: Array<Scalars['ID']>
}

export type MutationRenameConfigArgs = {
  id: Scalars['ID']
  name: Scalars['String']
}

export type MutationRenameDnsArgs = {
  id: Scalars['ID']
  name: Scalars['String']
}

export type MutationRenameGroupArgs = {
  id: Scalars['ID']
  name: Scalars['String']
}

export type MutationRenameRoutingArgs = {
  id: Scalars['ID']
  name: Scalars['String']
}

export type MutationRunArgs = {
  dry: Scalars['Boolean']
}

export type MutationSelectConfigArgs = {
  id: Scalars['ID']
}

export type MutationSelectDnsArgs = {
  id: Scalars['ID']
}

export type MutationSelectRoutingArgs = {
  id: Scalars['ID']
}

export type MutationSetJsonStorageArgs = {
  paths: Array<Scalars['String']>
  values: Array<Scalars['String']>
}

export type MutationTagNodeArgs = {
  id: Scalars['ID']
  tag: Scalars['String']
}

export type MutationTagSubscriptionArgs = {
  id: Scalars['ID']
  tag: Scalars['String']
}

export type MutationUpdateConfigArgs = {
  global: GlobalInput
  id: Scalars['ID']
}

export type MutationUpdateDnsArgs = {
  dns: Scalars['String']
  id: Scalars['ID']
}

export type MutationUpdateRoutingArgs = {
  id: Scalars['ID']
  routing: Scalars['String']
}

export type MutationUpdateSubscriptionArgs = {
  id: Scalars['ID']
}

export type Node = {
  __typename?: 'Node'
  address: Scalars['String']
  id: Scalars['ID']
  link: Scalars['String']
  name: Scalars['String']
  protocol: Scalars['String']
  subscriptionID?: Maybe<Scalars['ID']>
  tag?: Maybe<Scalars['String']>
}

export type NodeImportResult = {
  __typename?: 'NodeImportResult'
  error?: Maybe<Scalars['String']>
  link: Scalars['String']
  node?: Maybe<Node>
}

export type NodesConnection = {
  __typename?: 'NodesConnection'
  edges: Array<Node>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['ID']>
  hasNextPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['ID']>
}

export type Param = {
  __typename?: 'Param'
  key: Scalars['String']
  val: Scalars['String']
}

export type Plaintext = {
  __typename?: 'Plaintext'
  val: Scalars['String']
}

export enum Policy {
  Fixed = 'fixed',
  Min = 'min',
  MinAvg10 = 'min_avg10',
  MinMovingAvg = 'min_moving_avg',
  Random = 'random',
}

export type PolicyParam = {
  key?: InputMaybe<Scalars['String']>
  val: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  configFlatDesc: Array<ConfigFlatDesc>
  configs: Array<Config>
  dnss: Array<Dns>
  general: General
  group: Group
  groups: Array<Group>
  healthCheck: Scalars['Int']
  /** jsonStorage get given paths from user related json storage. Empty paths is to get all. Refer to https://github.com/tidwall/gjson */
  jsonStorage: Array<Scalars['String']>
  nodes: NodesConnection
  numberUsers: Scalars['Int']
  parsedDns: DaeDns
  parsedRouting: DaeRouting
  routings: Array<Routing>
  subscriptions: Array<Subscription>
  token: Scalars['String']
}

export type QueryConfigsArgs = {
  id?: InputMaybe<Scalars['ID']>
  selected?: InputMaybe<Scalars['Boolean']>
}

export type QueryDnssArgs = {
  id?: InputMaybe<Scalars['ID']>
  selected?: InputMaybe<Scalars['Boolean']>
}

export type QueryGroupArgs = {
  name: Scalars['String']
}

export type QueryGroupsArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryJsonStorageArgs = {
  paths?: InputMaybe<Array<Scalars['String']>>
}

export type QueryNodesArgs = {
  after?: InputMaybe<Scalars['ID']>
  first?: InputMaybe<Scalars['Int']>
  id?: InputMaybe<Scalars['ID']>
  subscriptionId?: InputMaybe<Scalars['ID']>
}

export type QueryParsedDnsArgs = {
  raw: Scalars['String']
}

export type QueryParsedRoutingArgs = {
  raw: Scalars['String']
}

export type QueryRoutingsArgs = {
  id?: InputMaybe<Scalars['ID']>
  selected?: InputMaybe<Scalars['Boolean']>
}

export type QuerySubscriptionsArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryTokenArgs = {
  password: Scalars['String']
  username: Scalars['String']
}

export enum Role {
  Admin = 'admin',
}

export type Routing = {
  __typename?: 'Routing'
  id: Scalars['ID']
  name: Scalars['String']
  referenceGroups: Array<Scalars['String']>
  routing: DaeRouting
  selected: Scalars['Boolean']
}

export type RoutingRule = {
  __typename?: 'RoutingRule'
  conditions: AndFunctions
  outbound: Function
}

export type Subscription = {
  __typename?: 'Subscription'
  id: Scalars['ID']
  info: Scalars['String']
  link: Scalars['String']
  nodes: NodesConnection
  status: Scalars['String']
  tag?: Maybe<Scalars['String']>
  updatedAt: Scalars['Time']
}

export type SubscriptionNodesArgs = {
  after?: InputMaybe<Scalars['ID']>
  first?: InputMaybe<Scalars['Int']>
}

export type SubscriptionImportResult = {
  __typename?: 'SubscriptionImportResult'
  link: Scalars['String']
  nodeImportResult: Array<NodeImportResult>
  sub: Subscription
}

export type _Service = {
  __typename?: '_Service'
  sdl: Scalars['String']
}

export type GlobalInput = {
  allowInsecure?: InputMaybe<Scalars['Boolean']>
  checkInterval?: InputMaybe<Scalars['Duration']>
  checkTolerance?: InputMaybe<Scalars['Duration']>
  dialMode?: InputMaybe<Scalars['String']>
  dnsUpstream?: InputMaybe<Scalars['String']>
  lanInterface?: InputMaybe<Array<Scalars['String']>>
  lanNatDirect?: InputMaybe<Scalars['Boolean']>
  logLevel?: InputMaybe<Scalars['String']>
  tcpCheckUrl?: InputMaybe<Scalars['String']>
  tproxyPort?: InputMaybe<Scalars['Int']>
  udpCheckDns?: InputMaybe<Scalars['String']>
  wanInterface?: InputMaybe<Array<Scalars['String']>>
}

export type NumberUsersQueryVariables = Exact<{ [key: string]: never }>

export type NumberUsersQuery = { __typename?: 'Query'; numberUsers: number }

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']
  password: Scalars['String']
}>

export type CreateUserMutation = { __typename?: 'Mutation'; createUser: string }

export type TokenQueryVariables = Exact<{
  username: Scalars['String']
  password: Scalars['String']
}>

export type TokenQuery = { __typename?: 'Query'; token: string }

export type SetJsonStorageMutationVariables = Exact<{
  paths: Array<Scalars['String']> | Scalars['String']
  values: Array<Scalars['String']> | Scalars['String']
}>

export type SetJsonStorageMutation = { __typename?: 'Mutation'; setJsonStorage: number }

export type JsonStorageQueryVariables = Exact<{
  paths?: InputMaybe<Array<Scalars['String']> | Scalars['String']>
}>

export type JsonStorageQuery = { __typename?: 'Query'; jsonStorage: Array<string> }

export type ImportNodesMutationVariables = Exact<{
  rollbackError: Scalars['Boolean']
  args: Array<ImportArgument> | ImportArgument
}>

export type ImportNodesMutation = {
  __typename?: 'Mutation'
  importNodes: Array<{ __typename?: 'NodeImportResult'; link: string; error?: string | null }>
}

export type ImportSubscriptionMutationVariables = Exact<{
  rollbackError: Scalars['Boolean']
  arg: ImportArgument
}>

export type ImportSubscriptionMutation = {
  __typename?: 'Mutation'
  importSubscription: { __typename?: 'SubscriptionImportResult'; link: string }
}

export type RunningQueryVariables = Exact<{ [key: string]: never }>

export type RunningQuery = {
  __typename?: 'Query'
  general: { __typename?: 'General'; dae: { __typename?: 'Dae'; running: boolean } }
}

export type NodesQueryVariables = Exact<{ [key: string]: never }>

export type NodesQuery = {
  __typename?: 'Query'
  nodes: { __typename?: 'NodesConnection'; edges: Array<{ __typename?: 'Node'; id: string; name: string }> }
}

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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImportNodesMutation, ImportNodesMutationVariables>
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
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'link' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImportSubscriptionMutation, ImportSubscriptionMutationVariables>
export const RunningDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Running' },
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
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'running' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RunningQuery, RunningQueryVariables>
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
