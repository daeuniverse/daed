/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Duration: any;
  Time: any;
};

export type AndFunctions = {
  __typename?: "AndFunctions";
  and: Array<Function>;
};

export type AndFunctionsOrPlaintext = AndFunctions | Plaintext;

export type Config = {
  __typename?: "Config";
  dns: Dns;
  global: Global;
  id: Scalars["ID"];
  routing: Routing;
  selected: Scalars["Boolean"];
};

export type Dns = {
  __typename?: "Dns";
  routing: DnsRouting;
  upstream: Array<Param>;
};

export type DnsRouting = {
  __typename?: "DnsRouting";
  request: Routing;
  response: Routing;
};

export type Function = {
  __typename?: "Function";
  name: Scalars["String"];
  not: Scalars["Boolean"];
  params: Array<Param>;
};

export type FunctionOrPlaintext = Function | Plaintext;

export type Global = {
  __typename?: "Global";
  allowInsecure: Scalars["Boolean"];
  checkInterval: Scalars["Duration"];
  checkTolerance: Scalars["Duration"];
  dialMode: Scalars["String"];
  dnsUpstream: Scalars["String"];
  lanInterface: Array<Scalars["String"]>;
  lanNatDirect: Scalars["Boolean"];
  logLevel: Scalars["String"];
  tcpCheckUrl: Scalars["String"];
  tproxyPort: Scalars["Int"];
  udpCheckDns: Scalars["String"];
  wanInterface: Array<Scalars["String"]>;
};

export type Group = {
  __typename?: "Group";
  id: Scalars["ID"];
  name: Scalars["String"];
  nodes: Array<Node>;
  policy: Policy;
  policyParams: Array<Param>;
  subscriptions: Array<Subscription>;
};

export type ImportArgument = {
  link: Scalars["String"];
  tag?: InputMaybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  /** createConfig create a config. Null arguments will be converted to default value. */
  createConfig: Config;
  /** createGroup is to create a group. */
  createGroup: Group;
  /** groupAddNodes is to add nodes to the group. Nodes will not be removed from its subscription when subscription update. */
  groupAddNodes: Scalars["Int"];
  /** groupAddSubscriptions is to add subscriptions to the group. */
  groupAddSubscriptions: Scalars["Int"];
  /** groupDelNodes is to remove nodes from the group. */
  groupDelNodes: Scalars["Int"];
  /** groupDelSubscriptions is to remove subscriptions from the group. */
  groupDelSubscriptions: Scalars["Int"];
  /** importNodes is to import nodes with no subscription ID. rollbackError means abort the import on error. */
  importNodes: Array<NodeImportResult>;
  /** importSubscription is to fetch and resolve the subscription into nodes. */
  importSubscription: SubscriptionImportResult;
  /** removeConfig is to remove a config with given config ID. */
  removeConfig: Scalars["Int"];
  /** removeGroup is to remove a group. */
  removeGroup: Scalars["Int"];
  /** removeNodes is to remove nodes that have no subscription ID. */
  removeNodes: Scalars["Int"];
  /** removeSubscriptions is to remove subscriptions with given ID list. */
  removeSubscriptions: Scalars["Int"];
  /** renameGroup is to rename a group. */
  renameGroup: Scalars["Int"];
  /** run proxy with the current config. Dry-run can be used to stop the proxy. */
  run: Scalars["Int"];
  /** selectConfig is to select a config as the current config. */
  selectConfig: Scalars["Int"];
  /** tagNode is to give the node a tag. */
  tagNode: Scalars["Int"];
  /** tagNode is to give the subscription a tag. */
  tagSubscription: Scalars["Int"];
  /** updateConfig allows to partially update "global". */
  updateConfig: Config;
  /** updateSubscription is to re-fetch subscription and resolve subscription into nodes. Old nodes that independently belong to any groups will not be removed. */
  updateSubscription: Subscription;
};

export type MutationCreateConfigArgs = {
  dns?: InputMaybe<Scalars["String"]>;
  global?: InputMaybe<GlobalInput>;
  routing?: InputMaybe<Scalars["String"]>;
};

export type MutationCreateGroupArgs = {
  name: Scalars["String"];
  policy: Policy;
  policyParams?: InputMaybe<Array<PolicyParam>>;
};

export type MutationGroupAddNodesArgs = {
  id: Scalars["ID"];
  nodeIDs: Array<Scalars["ID"]>;
};

export type MutationGroupAddSubscriptionsArgs = {
  id: Scalars["ID"];
  subscriptionIDs: Array<Scalars["ID"]>;
};

export type MutationGroupDelNodesArgs = {
  id: Scalars["ID"];
  nodeIDs: Array<Scalars["ID"]>;
};

export type MutationGroupDelSubscriptionsArgs = {
  id: Scalars["ID"];
  subscriptionIDs: Array<Scalars["ID"]>;
};

export type MutationImportNodesArgs = {
  args: Array<ImportArgument>;
  rollbackError: Scalars["Boolean"];
};

export type MutationImportSubscriptionArgs = {
  arg: ImportArgument;
  rollbackError: Scalars["Boolean"];
};

export type MutationRemoveConfigArgs = {
  id: Scalars["ID"];
};

export type MutationRemoveGroupArgs = {
  id: Scalars["ID"];
};

export type MutationRemoveNodesArgs = {
  ids: Array<Scalars["ID"]>;
};

export type MutationRemoveSubscriptionsArgs = {
  ids: Array<Scalars["ID"]>;
};

export type MutationRenameGroupArgs = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type MutationRunArgs = {
  dry: Scalars["Boolean"];
};

export type MutationSelectConfigArgs = {
  id: Scalars["ID"];
};

export type MutationTagNodeArgs = {
  id: Scalars["ID"];
  tag: Scalars["String"];
};

export type MutationTagSubscriptionArgs = {
  id: Scalars["ID"];
  tag: Scalars["String"];
};

export type MutationUpdateConfigArgs = {
  dns?: InputMaybe<Scalars["String"]>;
  global?: InputMaybe<GlobalInput>;
  id: Scalars["ID"];
  routing?: InputMaybe<Scalars["String"]>;
};

export type MutationUpdateSubscriptionArgs = {
  id: Scalars["ID"];
};

export type Node = {
  __typename?: "Node";
  address: Scalars["String"];
  id: Scalars["ID"];
  link: Scalars["String"];
  name: Scalars["String"];
  protocol: Scalars["String"];
  subscriptionID?: Maybe<Scalars["ID"]>;
  tag?: Maybe<Scalars["String"]>;
};

export type NodeImportResult = {
  __typename?: "NodeImportResult";
  error?: Maybe<Scalars["String"]>;
  link: Scalars["String"];
  node?: Maybe<Node>;
};

export type NodesConnection = {
  __typename?: "NodesConnection";
  edges: Array<Node>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["ID"]>;
  hasNextPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["ID"]>;
};

export type Param = {
  __typename?: "Param";
  key: Scalars["String"];
  val: Scalars["String"];
};

export type Plaintext = {
  __typename?: "Plaintext";
  val: Scalars["String"];
};

export enum Policy {
  Fixed = "fixed",
  Min = "min",
  MinAvg10 = "min_avg10",
  MinMovingAvg = "min_moving_avg",
  Random = "random",
}

export type PolicyParam = {
  key: Scalars["String"];
  val: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  configs: Array<Config>;
  group: Group;
  groups: Array<Group>;
  healthCheck: Scalars["Int"];
  nodes: NodesConnection;
  subscriptions: Array<Subscription>;
};

export type QueryConfigsArgs = {
  id?: InputMaybe<Scalars["ID"]>;
  selected?: InputMaybe<Scalars["Boolean"]>;
};

export type QueryGroupArgs = {
  name: Scalars["String"];
};

export type QueryGroupsArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type QueryNodesArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  id?: InputMaybe<Scalars["ID"]>;
  subscriptionId?: InputMaybe<Scalars["ID"]>;
};

export type QuerySubscriptionsArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type Routing = {
  __typename?: "Routing";
  fallback: FunctionOrPlaintext;
  rules: Array<RoutingRule>;
};

export type RoutingRule = {
  __typename?: "RoutingRule";
  conditions: AndFunctions;
  outbound: Function;
};

export type Subscription = {
  __typename?: "Subscription";
  id: Scalars["ID"];
  info: Scalars["String"];
  link: Scalars["String"];
  nodes: NodesConnection;
  status: Scalars["String"];
  tag?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["Time"];
};

export type SubscriptionNodesArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
};

export type SubscriptionImportResult = {
  __typename?: "SubscriptionImportResult";
  link: Scalars["String"];
  nodeImportResult: Array<NodeImportResult>;
  sub: Subscription;
};

export type _Service = {
  __typename?: "_Service";
  sdl: Scalars["String"];
};

export type GlobalInput = {
  allowInsecure?: InputMaybe<Scalars["Boolean"]>;
  checkInterval?: InputMaybe<Scalars["Duration"]>;
  checkTolerance?: InputMaybe<Scalars["Duration"]>;
  dialMode?: InputMaybe<Scalars["String"]>;
  dnsUpstream?: InputMaybe<Scalars["String"]>;
  lanInterface?: InputMaybe<Array<Scalars["String"]>>;
  lanNatDirect?: InputMaybe<Scalars["Boolean"]>;
  logLevel?: InputMaybe<Scalars["String"]>;
  tcpCheckUrl?: InputMaybe<Scalars["String"]>;
  tproxyPort?: InputMaybe<Scalars["Int"]>;
  udpCheckDns?: InputMaybe<Scalars["String"]>;
  wanInterface?: InputMaybe<Array<Scalars["String"]>>;
};

export type QueryQueryVariables = Exact<{ [key: string]: never }>;

export type QueryQuery = {
  __typename?: "Query";
  configs: Array<{
    __typename?: "Config";
    id: string;
    selected: boolean;
    global: {
      __typename?: "Global";
      tproxyPort: number;
      logLevel: string;
      tcpCheckUrl: string;
      udpCheckDns: string;
      checkInterval: any;
      checkTolerance: any;
      lanInterface: Array<string>;
      wanInterface: Array<string>;
      allowInsecure: boolean;
      dialMode: string;
    };
  }>;
};

export type SelectConfigMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type SelectConfigMutation = { __typename?: "Mutation"; selectConfig: number };

export type RemoveConfigMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RemoveConfigMutation = { __typename?: "Mutation"; removeConfig: number };

export type CreateConfigMutationVariables = Exact<{
  global?: InputMaybe<GlobalInput>;
  dns?: InputMaybe<Scalars["String"]>;
  routing?: InputMaybe<Scalars["String"]>;
}>;

export type CreateConfigMutation = { __typename?: "Mutation"; createConfig: { __typename?: "Config"; id: string } };

export const QueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Query" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "configs" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "selected" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "global" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "tproxyPort" } },
                      { kind: "Field", name: { kind: "Name", value: "logLevel" } },
                      { kind: "Field", name: { kind: "Name", value: "tcpCheckUrl" } },
                      { kind: "Field", name: { kind: "Name", value: "udpCheckDns" } },
                      { kind: "Field", name: { kind: "Name", value: "checkInterval" } },
                      { kind: "Field", name: { kind: "Name", value: "checkTolerance" } },
                      { kind: "Field", name: { kind: "Name", value: "lanInterface" } },
                      { kind: "Field", name: { kind: "Name", value: "wanInterface" } },
                      { kind: "Field", name: { kind: "Name", value: "allowInsecure" } },
                      { kind: "Field", name: { kind: "Name", value: "dialMode" } },
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
} as unknown as DocumentNode<QueryQuery, QueryQueryVariables>;
export const SelectConfigDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "selectConfig" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "selectConfig" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SelectConfigMutation, SelectConfigMutationVariables>;
export const RemoveConfigDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "removeConfig" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeConfig" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveConfigMutation, RemoveConfigMutationVariables>;
export const CreateConfigDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createConfig" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "global" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "globalInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "dns" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "routing" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createConfig" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "global" },
                value: { kind: "Variable", name: { kind: "Name", value: "global" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dns" },
                value: { kind: "Variable", name: { kind: "Name", value: "dns" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "routing" },
                value: { kind: "Variable", name: { kind: "Name", value: "routing" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateConfigMutation, CreateConfigMutationVariables>;
