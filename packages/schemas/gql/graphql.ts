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
  global: Global;
  id: Scalars["ID"];
  name: Scalars["String"];
  selected: Scalars["Boolean"];
};

export type ConfigFlatDesc = {
  __typename?: "ConfigFlatDesc";
  defaultValue: Scalars["String"];
  desc: Scalars["String"];
  isArray: Scalars["Boolean"];
  mapping: Scalars["String"];
  name: Scalars["String"];
  required: Scalars["Boolean"];
  type: Scalars["String"];
};

export type Dae = {
  __typename?: "Dae";
  /** modified indicates whether the running config has been modified. */
  modified: Scalars["Boolean"];
  running: Scalars["Boolean"];
};

export type DaeDns = {
  __typename?: "DaeDns";
  routing: DnsRouting;
  string: Scalars["String"];
  upstream: Array<Param>;
};

export type DaeRouting = {
  __typename?: "DaeRouting";
  fallback: FunctionOrPlaintext;
  rules: Array<RoutingRule>;
  string: Scalars["String"];
};

export type DefaultRoute = {
  __typename?: "DefaultRoute";
  gateway?: Maybe<Scalars["String"]>;
  ipVersion: Scalars["String"];
  source?: Maybe<Scalars["String"]>;
};

export type Dns = {
  __typename?: "Dns";
  dns: DaeDns;
  id: Scalars["ID"];
  name: Scalars["String"];
  selected: Scalars["Boolean"];
};

export type DnsRouting = {
  __typename?: "DnsRouting";
  request: DaeRouting;
  response: DaeRouting;
};

export type Function = {
  __typename?: "Function";
  name: Scalars["String"];
  not: Scalars["Boolean"];
  params: Array<Param>;
};

export type FunctionOrPlaintext = Function | Plaintext;

export type General = {
  __typename?: "General";
  dae: Dae;
  interfaces: Array<Interface>;
};

export type GeneralInterfacesArgs = {
  up?: InputMaybe<Scalars["Boolean"]>;
};

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

export type Interface = {
  __typename?: "Interface";
  flag: InterfaceFlag;
  ifindex: Scalars["Int"];
  ip: Array<Scalars["String"]>;
  name: Scalars["String"];
};

export type InterfaceIpArgs = {
  onlyGlobalScope?: InputMaybe<Scalars["Boolean"]>;
};

export type InterfaceFlag = {
  __typename?: "InterfaceFlag";
  default?: Maybe<Array<DefaultRoute>>;
  up: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  /** createConfig create a global config. Null arguments will be converted to default value. */
  createConfig: Config;
  /** createConfig create a dns config. Null arguments will be converted to default value. */
  createDns: Dns;
  /** createGroup is to create a group. */
  createGroup: Group;
  /** createConfig create a routing config. Null arguments will be converted to default value. */
  createRouting: Routing;
  /** groupAddNodes is to add nodes to the group. Nodes will not be removed from its subscription when subscription update. */
  groupAddNodes: Scalars["Int"];
  /** groupAddSubscriptions is to add subscriptions to the group. */
  groupAddSubscriptions: Scalars["Int"];
  /** groupDelNodes is to remove nodes from the group. */
  groupDelNodes: Scalars["Int"];
  /** groupDelSubscriptions is to remove subscriptions from the group. */
  groupDelSubscriptions: Scalars["Int"];
  /** groupSetPolicy is to set the group a new policy. */
  groupSetPolicy: Scalars["Int"];
  /** importNodes is to import nodes with no subscription ID. rollbackError means abort the import on error. */
  importNodes: Array<NodeImportResult>;
  /** importSubscription is to fetch and resolve the subscription into nodes. */
  importSubscription: SubscriptionImportResult;
  /** removeConfig is to remove a config with given config ID. */
  removeConfig: Scalars["Int"];
  /** removeDns is to remove a dns config with given dns ID. */
  removeDns: Scalars["Int"];
  /** removeGroup is to remove a group. */
  removeGroup: Scalars["Int"];
  /** removeNodes is to remove nodes that have no subscription ID. */
  removeNodes: Scalars["Int"];
  /** removeRouting is to remove a routing config with given routing ID. */
  removeRouting: Scalars["Int"];
  /** removeSubscriptions is to remove subscriptions with given ID list. */
  removeSubscriptions: Scalars["Int"];
  /** renameConfig is to give the config a new name. */
  renameConfig: Scalars["Int"];
  /** renameDns is to give the dns config a new name. */
  renameDns: Scalars["Int"];
  /** renameGroup is to rename a group. */
  renameGroup: Scalars["Int"];
  /** renameRouting is to give the routing config a new name. */
  renameRouting: Scalars["Int"];
  /** run proxy with selected config+dns+routing. Dry-run can be used to stop the proxy. */
  run: Scalars["Int"];
  /** selectConfig is to select a config as the current config. */
  selectConfig: Scalars["Int"];
  /** selectConfig is to select a dns config as the current dns. */
  selectDns: Scalars["Int"];
  /** selectConfig is to select a routing config as the current routing. */
  selectRouting: Scalars["Int"];
  /** tagNode is to give the node a new tag. */
  tagNode: Scalars["Int"];
  /** tagSubscription is to give the subscription a new tag. */
  tagSubscription: Scalars["Int"];
  /** updateConfig allows to partially update global config with given id. */
  updateConfig: Config;
  /** updateDns is to update dns config with given id. */
  updateDns: Dns;
  /** updateRouting is to update routing config with given id. */
  updateRouting: Routing;
  /** updateSubscription is to re-fetch subscription and resolve subscription into nodes. Old nodes that independently belong to any groups will not be removed. */
  updateSubscription: Subscription;
};

export type MutationCreateConfigArgs = {
  global?: InputMaybe<GlobalInput>;
  name?: InputMaybe<Scalars["String"]>;
};

export type MutationCreateDnsArgs = {
  dns?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type MutationCreateGroupArgs = {
  name: Scalars["String"];
  policy: Policy;
  policyParams?: InputMaybe<Array<PolicyParam>>;
};

export type MutationCreateRoutingArgs = {
  name?: InputMaybe<Scalars["String"]>;
  routing?: InputMaybe<Scalars["String"]>;
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

export type MutationGroupSetPolicyArgs = {
  id: Scalars["ID"];
  policy: Policy;
  policyParams?: InputMaybe<Array<PolicyParam>>;
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

export type MutationRemoveDnsArgs = {
  id: Scalars["ID"];
};

export type MutationRemoveGroupArgs = {
  id: Scalars["ID"];
};

export type MutationRemoveNodesArgs = {
  ids: Array<Scalars["ID"]>;
};

export type MutationRemoveRoutingArgs = {
  id: Scalars["ID"];
};

export type MutationRemoveSubscriptionsArgs = {
  ids: Array<Scalars["ID"]>;
};

export type MutationRenameConfigArgs = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type MutationRenameDnsArgs = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type MutationRenameGroupArgs = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type MutationRenameRoutingArgs = {
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type MutationRunArgs = {
  dry: Scalars["Boolean"];
};

export type MutationSelectConfigArgs = {
  id: Scalars["ID"];
};

export type MutationSelectDnsArgs = {
  id: Scalars["ID"];
};

export type MutationSelectRoutingArgs = {
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
  global: GlobalInput;
  id: Scalars["ID"];
};

export type MutationUpdateDnsArgs = {
  dns: Scalars["String"];
  id: Scalars["ID"];
};

export type MutationUpdateRoutingArgs = {
  id: Scalars["ID"];
  routing: Scalars["String"];
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
  key?: InputMaybe<Scalars["String"]>;
  val: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  configFlatDesc: Array<ConfigFlatDesc>;
  configs: Array<Config>;
  dnss: Array<Dns>;
  general: General;
  group: Group;
  groups: Array<Group>;
  healthCheck: Scalars["Int"];
  nodes: NodesConnection;
  parsedDns: DaeDns;
  parsedRouting: DaeRouting;
  routings: Array<Routing>;
  subscriptions: Array<Subscription>;
};

export type QueryConfigsArgs = {
  id?: InputMaybe<Scalars["ID"]>;
  selected?: InputMaybe<Scalars["Boolean"]>;
};

export type QueryDnssArgs = {
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

export type QueryParsedDnsArgs = {
  raw: Scalars["String"];
};

export type QueryParsedRoutingArgs = {
  raw: Scalars["String"];
};

export type QueryRoutingsArgs = {
  id?: InputMaybe<Scalars["ID"]>;
  selected?: InputMaybe<Scalars["Boolean"]>;
};

export type QuerySubscriptionsArgs = {
  id?: InputMaybe<Scalars["ID"]>;
};

export type Routing = {
  __typename?: "Routing";
  id: Scalars["ID"];
  name: Scalars["String"];
  referenceGroups: Array<Scalars["String"]>;
  routing: DaeRouting;
  selected: Scalars["Boolean"];
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

export type HealthCheckQueryVariables = Exact<{ [key: string]: never }>;

export type HealthCheckQuery = { __typename?: "Query"; healthCheck: number };

export type NodesQueryVariables = Exact<{ [key: string]: never }>;

export type NodesQuery = {
  __typename?: "Query";
  nodes: {
    __typename?: "NodesConnection";
    edges: Array<{
      __typename?: "Node";
      id: string;
      link: string;
      name: string;
      address: string;
      protocol: string;
      tag?: string | null;
    }>;
  };
};

export type RemoveNodesMutationVariables = Exact<{
  ids: Array<Scalars["ID"]> | Scalars["ID"];
}>;

export type RemoveNodesMutation = { __typename?: "Mutation"; removeNodes: number };

export type SubscriptionsQueryVariables = Exact<{ [key: string]: never }>;

export type SubscriptionsQuery = {
  __typename?: "Query";
  subscriptions: Array<{
    __typename?: "Subscription";
    id: string;
    tag?: string | null;
    link: string;
    nodes: {
      __typename?: "NodesConnection";
      edges: Array<{
        __typename?: "Node";
        id: string;
        link: string;
        name: string;
        protocol: string;
        tag?: string | null;
      }>;
    };
  }>;
};

export type RemoveSubscriptionsMutationVariables = Exact<{
  ids: Array<Scalars["ID"]> | Scalars["ID"];
}>;

export type RemoveSubscriptionsMutation = { __typename?: "Mutation"; removeSubscriptions: number };

export type ConfigsQueryVariables = Exact<{ [key: string]: never }>;

export type ConfigsQuery = {
  __typename?: "Query";
  configs: Array<{
    __typename?: "Config";
    id: string;
    name: string;
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

export type RoutingsQueryVariables = Exact<{ [key: string]: never }>;

export type RoutingsQuery = {
  __typename?: "Query";
  routings: Array<{
    __typename?: "Routing";
    id: string;
    name: string;
    selected: boolean;
    routing: { __typename?: "DaeRouting"; string: string };
  }>;
};

export type SelectRoutingMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type SelectRoutingMutation = { __typename?: "Mutation"; selectRouting: number };

export type RemoveRoutingMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RemoveRoutingMutation = { __typename?: "Mutation"; removeRouting: number };

export type DnssQueryVariables = Exact<{ [key: string]: never }>;

export type DnssQuery = {
  __typename?: "Query";
  dnss: Array<{
    __typename?: "Dns";
    id: string;
    name: string;
    selected: boolean;
    dns: { __typename?: "DaeDns"; string: string };
  }>;
};

export type SelectDnsMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type SelectDnsMutation = { __typename?: "Mutation"; selectDns: number };

export type RemoveDnsMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RemoveDnsMutation = { __typename?: "Mutation"; removeDns: number };

export type GroupsQueryVariables = Exact<{ [key: string]: never }>;

export type GroupsQuery = {
  __typename?: "Query";
  groups: Array<{
    __typename?: "Group";
    id: string;
    name: string;
    policy: Policy;
    policyParams: Array<{ __typename?: "Param"; key: string; val: string }>;
  }>;
};

export type RemoveGroupMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RemoveGroupMutation = { __typename?: "Mutation"; removeGroup: number };

export type InterfacesQueryVariables = Exact<{ [key: string]: never }>;

export type InterfacesQuery = {
  __typename?: "Query";
  general: { __typename?: "General"; interfaces: Array<{ __typename?: "Interface"; name: string }> };
};

export type RunningQueryVariables = Exact<{ [key: string]: never }>;

export type RunningQuery = {
  __typename?: "Query";
  general: { __typename?: "General"; dae: { __typename?: "Dae"; running: boolean } };
};

export type RunMutationVariables = Exact<{
  dry: Scalars["Boolean"];
}>;

export type RunMutation = { __typename?: "Mutation"; run: number };

export type ImportNodesMutationVariables = Exact<{
  rollbackError: Scalars["Boolean"];
  args: Array<ImportArgument> | ImportArgument;
}>;

export type ImportNodesMutation = {
  __typename?: "Mutation";
  importNodes: Array<{ __typename?: "NodeImportResult"; link: string; error?: string | null }>;
};

export type ImportSubscriptionMutationVariables = Exact<{
  rollbackError: Scalars["Boolean"];
  arg: ImportArgument;
}>;

export type ImportSubscriptionMutation = {
  __typename?: "Mutation";
  importSubscription: { __typename?: "SubscriptionImportResult"; link: string };
};

export type CreateConfigMutationVariables = Exact<{
  name?: InputMaybe<Scalars["String"]>;
  global?: InputMaybe<GlobalInput>;
}>;

export type CreateConfigMutation = { __typename?: "Mutation"; createConfig: { __typename?: "Config"; id: string } };

export type CreateRoutingMutationVariables = Exact<{
  name: Scalars["String"];
  routing?: InputMaybe<Scalars["String"]>;
}>;

export type CreateRoutingMutation = { __typename?: "Mutation"; createRouting: { __typename?: "Routing"; id: string } };

export type CreateDnsMutationVariables = Exact<{
  name: Scalars["String"];
  dns?: InputMaybe<Scalars["String"]>;
}>;

export type CreateDnsMutation = { __typename?: "Mutation"; createDns: { __typename?: "Dns"; id: string } };

export type CreateGroupMutationVariables = Exact<{
  name: Scalars["String"];
  policy: Policy;
  policyParams?: InputMaybe<Array<PolicyParam> | PolicyParam>;
}>;

export type CreateGroupMutation = { __typename?: "Mutation"; createGroup: { __typename?: "Group"; id: string } };

export const HealthCheckDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HealthCheck" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{ kind: "Field", name: { kind: "Name", value: "healthCheck" } }],
      },
    },
  ],
} as unknown as DocumentNode<HealthCheckQuery, HealthCheckQueryVariables>;
export const NodesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Nodes" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "nodes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "link" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "address" } },
                      { kind: "Field", name: { kind: "Name", value: "protocol" } },
                      { kind: "Field", name: { kind: "Name", value: "tag" } },
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
} as unknown as DocumentNode<NodesQuery, NodesQueryVariables>;
export const RemoveNodesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveNodes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "ids" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeNodes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "ids" },
                value: { kind: "Variable", name: { kind: "Name", value: "ids" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveNodesMutation, RemoveNodesMutationVariables>;
export const SubscriptionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Subscriptions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "subscriptions" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "tag" } },
                { kind: "Field", name: { kind: "Name", value: "link" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "nodes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "edges" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "link" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "protocol" } },
                            { kind: "Field", name: { kind: "Name", value: "tag" } },
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
} as unknown as DocumentNode<SubscriptionsQuery, SubscriptionsQueryVariables>;
export const RemoveSubscriptionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveSubscriptions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "ids" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "removeSubscriptions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "ids" },
                value: { kind: "Variable", name: { kind: "Name", value: "ids" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveSubscriptionsMutation, RemoveSubscriptionsMutationVariables>;
export const ConfigsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Configs" },
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
                { kind: "Field", name: { kind: "Name", value: "name" } },
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
} as unknown as DocumentNode<ConfigsQuery, ConfigsQueryVariables>;
export const SelectConfigDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SelectConfig" },
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
      name: { kind: "Name", value: "RemoveConfig" },
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
export const RoutingsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Routings" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "routings" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "selected" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "routing" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "string" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RoutingsQuery, RoutingsQueryVariables>;
export const SelectRoutingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SelectRouting" },
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
            name: { kind: "Name", value: "selectRouting" },
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
} as unknown as DocumentNode<SelectRoutingMutation, SelectRoutingMutationVariables>;
export const RemoveRoutingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveRouting" },
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
            name: { kind: "Name", value: "removeRouting" },
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
} as unknown as DocumentNode<RemoveRoutingMutation, RemoveRoutingMutationVariables>;
export const DnssDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Dnss" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "dnss" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "selected" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dns" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "string" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DnssQuery, DnssQueryVariables>;
export const SelectDnsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SelectDNS" },
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
            name: { kind: "Name", value: "selectDns" },
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
} as unknown as DocumentNode<SelectDnsMutation, SelectDnsMutationVariables>;
export const RemoveDnsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveDns" },
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
            name: { kind: "Name", value: "removeDns" },
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
} as unknown as DocumentNode<RemoveDnsMutation, RemoveDnsMutationVariables>;
export const GroupsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Groups" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "groups" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "policy" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "policyParams" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "val" } },
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
} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>;
export const RemoveGroupDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveGroup" },
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
            name: { kind: "Name", value: "removeGroup" },
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
} as unknown as DocumentNode<RemoveGroupMutation, RemoveGroupMutationVariables>;
export const InterfacesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Interfaces" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "general" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interfaces" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InterfacesQuery, InterfacesQueryVariables>;
export const RunningDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Running" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "general" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "dae" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "running" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RunningQuery, RunningQueryVariables>;
export const RunDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Run" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "dry" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "run" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "dry" },
                value: { kind: "Variable", name: { kind: "Name", value: "dry" } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RunMutation, RunMutationVariables>;
export const ImportNodesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ImportNodes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "rollbackError" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "args" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: { kind: "NamedType", name: { kind: "Name", value: "ImportArgument" } },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "importNodes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "rollbackError" },
                value: { kind: "Variable", name: { kind: "Name", value: "rollbackError" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "args" },
                value: { kind: "Variable", name: { kind: "Name", value: "args" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "link" } },
                { kind: "Field", name: { kind: "Name", value: "error" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImportNodesMutation, ImportNodesMutationVariables>;
export const ImportSubscriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ImportSubscription" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "rollbackError" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "arg" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ImportArgument" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "importSubscription" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "rollbackError" },
                value: { kind: "Variable", name: { kind: "Name", value: "rollbackError" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "arg" },
                value: { kind: "Variable", name: { kind: "Name", value: "arg" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "link" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImportSubscriptionMutation, ImportSubscriptionMutationVariables>;
export const CreateConfigDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateConfig" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "global" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "globalInput" } },
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
                name: { kind: "Name", value: "name" },
                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "global" },
                value: { kind: "Variable", name: { kind: "Name", value: "global" } },
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
export const CreateRoutingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateRouting" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
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
            name: { kind: "Name", value: "createRouting" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
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
} as unknown as DocumentNode<CreateRoutingMutation, CreateRoutingMutationVariables>;
export const CreateDnsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateDns" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "dns" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createDns" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dns" },
                value: { kind: "Variable", name: { kind: "Name", value: "dns" } },
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
} as unknown as DocumentNode<CreateDnsMutation, CreateDnsMutationVariables>;
export const CreateGroupDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateGroup" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "policy" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "Policy" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "policyParams" } },
          type: {
            kind: "ListType",
            type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "PolicyParam" } } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createGroup" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: { kind: "Variable", name: { kind: "Name", value: "name" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "policy" },
                value: { kind: "Variable", name: { kind: "Name", value: "policy" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "policyParams" },
                value: { kind: "Variable", name: { kind: "Name", value: "policyParams" } },
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
} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
