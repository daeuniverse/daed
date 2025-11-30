/**
 * Mock data for e2e testing and screenshots
 * This file provides realistic mock data for all GraphQL responses
 *
 * Usage:
 *   1. Set VITE_MOCK_MODE=true in .env or run: pnpm dev:mock
 *   2. The app will use mock data instead of real API calls
 */

import type {
  ConfigsQuery,
  DnSsQuery,
  GeneralQuery,
  GroupsQuery,
  NodesQuery,
  RoutingsQuery,
  SubscriptionsQuery,
  UserQuery,
} from '~/schemas/gql/graphql'
import { Policy } from '~/schemas/gql/graphql'

// Check if mock mode is enabled
export const isMockMode = () => import.meta.env.VITE_MOCK_MODE === 'true'

// Default IDs for resources
export const MOCK_DEFAULT_IDS = {
  defaultConfigID: 'config-1',
  defaultRoutingID: 'routing-1',
  defaultDNSID: 'dns-1',
  defaultGroupID: 'group-1',
}

// General/System info
export const mockGeneral: GeneralQuery = {
  general: {
    __typename: 'General',
    dae: {
      __typename: 'Dae',
      running: true,
      modified: false,
      version: 'v0.8.0',
    },
    interfaces: [
      {
        __typename: 'Interface',
        name: 'eth0',
        ifindex: 2,
        ip: ['192.168.1.100/24', 'fe80::1/64'],
        flag: {
          __typename: 'InterfaceFlag',
          default: [{ gateway: '192.168.1.1' }],
        },
      },
      {
        __typename: 'Interface',
        name: 'wlan0',
        ifindex: 3,
        ip: ['192.168.1.101/24'],
        flag: {
          __typename: 'InterfaceFlag',
          default: [],
        },
      },
      {
        __typename: 'Interface',
        name: 'docker0',
        ifindex: 4,
        ip: ['172.17.0.1/16'],
        flag: {
          __typename: 'InterfaceFlag',
          default: [],
        },
      },
    ],
  },
}

// Configs
export const mockConfigs: ConfigsQuery = {
  configs: [
    {
      __typename: 'Config',
      id: 'config-1',
      name: 'default',
      selected: true,
      global: {
        __typename: 'Global',
        logLevel: 'info',
        tproxyPort: 12345,
        allowInsecure: false,
        checkInterval: '30s',
        checkTolerance: '50ms',
        lanInterface: [],
        wanInterface: ['auto'],
        udpCheckDns: ['dns.google.com:53', '8.8.8.8', '2001:4860:4860::8888'],
        tcpCheckUrl: ['http://cp.cloudflare.com', '1.1.1.1', '2606:4700:4700::1111'],
        fallbackResolver: '',
        dialMode: 'domain',
        tcpCheckHttpMethod: 'HEAD',
        disableWaitingNetwork: false,
        autoConfigKernelParameter: true,
        sniffingTimeout: '100ms',
        tlsImplementation: 'tls',
        utlsImitate: 'chrome_auto',
        tproxyPortProtect: true,
        soMarkFromDae: 0,
        pprofPort: 0,
        enableLocalTcpFastRedirect: false,
        mptcp: false,
        bandwidthMaxTx: '',
        bandwidthMaxRx: '',
      },
    },
    {
      __typename: 'Config',
      id: 'config-2',
      name: 'Gaming Config',
      selected: false,
      global: {
        __typename: 'Global',
        logLevel: 'warn',
        tproxyPort: 12346,
        allowInsecure: false,
        checkInterval: '10s',
        checkTolerance: '30ms',
        lanInterface: ['eth0'],
        wanInterface: ['auto'],
        udpCheckDns: ['dns.google.com:53', '8.8.8.8'],
        tcpCheckUrl: ['http://cp.cloudflare.com', '1.1.1.1'],
        fallbackResolver: '8.8.8.8:53',
        dialMode: 'ip',
        tcpCheckHttpMethod: 'HEAD',
        disableWaitingNetwork: true,
        autoConfigKernelParameter: true,
        sniffingTimeout: '50ms',
        tlsImplementation: 'utls',
        utlsImitate: 'chrome_120',
        tproxyPortProtect: true,
        soMarkFromDae: 0,
        pprofPort: 0,
        enableLocalTcpFastRedirect: true,
        mptcp: false,
        bandwidthMaxTx: '100mbps',
        bandwidthMaxRx: '200mbps',
      },
    },
  ],
}

// Nodes
export const mockNodes: NodesQuery = {
  nodes: {
    __typename: 'NodesConnection',
    edges: [
      {
        __typename: 'Node',
        id: 'node-1',
        name: 'Tokyo-01',
        link: 'vmess://eyJhZGQiOiJ0b2t5by5leGFtcGxlLmNvbSIsInBzIjoiVG9reW8tMDEifQ==',
        address: 'tokyo.example.com:443',
        protocol: 'vmess',
        tag: 'JP-Tokyo-Premium',
      },
      {
        __typename: 'Node',
        id: 'node-2',
        name: 'Singapore-02',
        link: 'trojan://password@sg.example.com:443',
        address: 'sg.example.com:443',
        protocol: 'trojan',
        tag: 'SG-Singapore-Standard',
      },
      {
        __typename: 'Node',
        id: 'node-3',
        name: 'HongKong-03',
        link: 'ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@hk.example.com:8388',
        address: 'hk.example.com:8388',
        protocol: 'shadowsocks',
        tag: 'HK-HongKong-IPLC',
      },
      {
        __typename: 'Node',
        id: 'node-4',
        name: 'US-West-04',
        link: 'vless://uuid@us.example.com:443?type=ws',
        address: 'us.example.com:443',
        protocol: 'vless',
        tag: 'US-LosAngeles-BGP',
      },
    ],
  },
}

// Subscriptions
export const mockSubscriptions: SubscriptionsQuery = {
  subscriptions: [
    {
      __typename: 'Subscription',
      id: 'sub-1',
      tag: 'Premium Provider',
      status: 'ok',
      link: 'https://example.com/api/v1/client/subscribe?token=xxxxx',
      info: 'upload=10737418240; download=53687091200; total=107374182400; expire=1735689600',
      updatedAt: '2024-11-28T10:30:00Z',
      nodes: {
        __typename: 'NodesConnection',
        edges: [
          {
            __typename: 'Node',
            id: 'sub1-node-1',
            name: 'Tokyo-Premium-01',
            protocol: 'vmess',
            link: 'vmess://xxxxx',
          },
          {
            __typename: 'Node',
            id: 'sub1-node-2',
            name: 'Singapore-Premium-02',
            protocol: 'trojan',
            link: 'trojan://xxxxx',
          },
          {
            __typename: 'Node',
            id: 'sub1-node-3',
            name: 'HongKong-Premium-03',
            protocol: 'shadowsocks',
            link: 'ss://xxxxx',
          },
          {
            __typename: 'Node',
            id: 'sub1-node-4',
            name: 'US-Premium-04',
            protocol: 'vless',
            link: 'vless://xxxxx',
          },
          {
            __typename: 'Node',
            id: 'sub1-node-5',
            name: 'Korea-Premium-05',
            protocol: 'hysteria2',
            link: 'hysteria2://xxxxx',
          },
        ],
      },
    },
    {
      __typename: 'Subscription',
      id: 'sub-2',
      tag: 'Backup Provider',
      status: 'ok',
      link: 'https://backup.example.com/subscribe/token',
      info: 'upload=1073741824; download=5368709120; total=10737418240; expire=1738368000',
      updatedAt: '2024-11-27T15:45:00Z',
      nodes: {
        __typename: 'NodesConnection',
        edges: [
          {
            __typename: 'Node',
            id: 'sub2-node-1',
            name: 'Japan-Backup-01',
            protocol: 'vmess',
            link: 'vmess://xxxxx',
          },
          {
            __typename: 'Node',
            id: 'sub2-node-2',
            name: 'Taiwan-Backup-02',
            protocol: 'trojan',
            link: 'trojan://xxxxx',
          },
          {
            __typename: 'Node',
            id: 'sub2-node-3',
            name: 'Germany-Backup-03',
            protocol: 'shadowsocks',
            link: 'ss://xxxxx',
          },
        ],
      },
    },
  ],
}

// Groups
export const mockGroups: GroupsQuery = {
  groups: [
    {
      __typename: 'Group',
      id: 'group-1',
      name: 'Proxy',
      policy: Policy.MinMovingAvg,
      policyParams: [],
      nodes: [
        {
          __typename: 'Node',
          id: 'node-1',
          link: 'vmess://xxxxx',
          name: 'Tokyo-01',
          address: 'tokyo.example.com:443',
          protocol: 'vmess',
          tag: 'JP-Tokyo-Premium',
          subscriptionID: null,
        },
        {
          __typename: 'Node',
          id: 'node-2',
          link: 'trojan://xxxxx',
          name: 'Singapore-02',
          address: 'sg.example.com:443',
          protocol: 'trojan',
          tag: 'SG-Singapore-Standard',
          subscriptionID: null,
        },
      ],
      subscriptions: [
        {
          __typename: 'Subscription',
          id: 'sub-1',
          updatedAt: '2024-11-28T10:30:00Z',
          tag: 'Premium Provider',
          link: 'https://example.com/api/v1/client/subscribe?token=xxxxx',
          status: 'ok',
          info: 'upload=10737418240; download=53687091200; total=107374182400; expire=1735689600',
          nodes: {
            __typename: 'NodesConnection',
            edges: [
              {
                __typename: 'Node',
                id: 'sub1-node-1',
                link: 'vmess://xxxxx',
                name: 'Tokyo-Premium-01',
                address: 'tokyo.example.com:443',
                protocol: 'vmess',
                tag: 'JP-Premium',
                subscriptionID: 'sub-1',
              },
              {
                __typename: 'Node',
                id: 'sub1-node-2',
                link: 'trojan://xxxxx',
                name: 'Singapore-Premium-02',
                address: 'sg.example.com:443',
                protocol: 'trojan',
                tag: 'SG-Premium',
                subscriptionID: 'sub-1',
              },
            ],
          },
        },
      ],
    },
    {
      __typename: 'Group',
      id: 'group-2',
      name: 'Gaming',
      policy: Policy.Min,
      policyParams: [],
      nodes: [
        {
          __typename: 'Node',
          id: 'node-3',
          link: 'ss://xxxxx',
          name: 'HongKong-03',
          address: 'hk.example.com:8388',
          protocol: 'shadowsocks',
          tag: 'HK-HongKong-IPLC',
          subscriptionID: null,
        },
      ],
      subscriptions: [],
    },
    {
      __typename: 'Group',
      id: 'group-3',
      name: 'Streaming',
      policy: Policy.Random,
      policyParams: [],
      nodes: [],
      subscriptions: [
        {
          __typename: 'Subscription',
          id: 'sub-2',
          updatedAt: '2024-11-27T15:45:00Z',
          tag: 'Backup Provider',
          link: 'https://backup.example.com/subscribe/token',
          status: 'ok',
          info: 'upload=1073741824; download=5368709120; total=10737418240; expire=1738368000',
          nodes: {
            __typename: 'NodesConnection',
            edges: [
              {
                __typename: 'Node',
                id: 'sub2-node-1',
                link: 'vmess://xxxxx',
                name: 'Japan-Backup-01',
                address: 'japan.example.com:443',
                protocol: 'vmess',
                tag: 'JP-Backup',
                subscriptionID: 'sub-2',
              },
            ],
          },
        },
      ],
    },
  ],
}

// Routings
export const mockRoutings: RoutingsQuery = {
  routings: [
    {
      __typename: 'Routing',
      id: 'routing-1',
      name: 'default',
      selected: true,
      routing: {
        __typename: 'DaeRouting',
        string: `# Default routing rules
pname(NetworkManager, systemd-resolved) -> must_direct
dip(geoip:private) -> direct
dip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: proxy`,
      },
    },
    {
      __typename: 'Routing',
      id: 'routing-2',
      name: 'Global Proxy',
      selected: false,
      routing: {
        __typename: 'DaeRouting',
        string: `# Global proxy routing
pname(NetworkManager, systemd-resolved) -> must_direct
dip(geoip:private) -> direct
fallback: proxy`,
      },
    },
  ],
}

// DNS
export const mockDNSs: DnSsQuery = {
  dnss: [
    {
      __typename: 'Dns',
      id: 'dns-1',
      name: 'default',
      selected: true,
      dns: {
        __typename: 'DaeDns',
        string: `# Default DNS configuration
upstream {
  googledns: 'tcp+udp://dns.google.com:53'
  alidns: 'udp://dns.alidns.com:53'
}

routing {
  request {
    qname(geosite:cn) -> alidns
    fallback: googledns
  }
}`,
        routing: {
          __typename: 'DnsRouting',
          request: {
            __typename: 'DaeRouting',
            string: `qname(geosite:cn) -> alidns
fallback: googledns`,
          },
          response: {
            __typename: 'DaeRouting',
            string: '',
          },
        },
      },
    },
    {
      __typename: 'Dns',
      id: 'dns-2',
      name: 'DoH Only',
      selected: false,
      dns: {
        __typename: 'DaeDns',
        string: `# DoH DNS configuration
upstream {
  cloudflare: 'https://cloudflare-dns.com/dns-query'
  google: 'https://dns.google/dns-query'
}

routing {
  request {
    fallback: cloudflare
  }
}`,
        routing: {
          __typename: 'DnsRouting',
          request: {
            __typename: 'DaeRouting',
            string: 'fallback: cloudflare',
          },
          response: {
            __typename: 'DaeRouting',
            string: '',
          },
        },
      },
    },
  ],
}

// User
export const mockUser: UserQuery = {
  user: {
    __typename: 'User',
    username: 'admin',
    name: 'Administrator',
    avatar: '',
  },
}

// JSON Storage (defaults)
export const mockJsonStorage = {
  jsonStorage: [
    MOCK_DEFAULT_IDS.defaultConfigID,
    MOCK_DEFAULT_IDS.defaultRoutingID,
    MOCK_DEFAULT_IDS.defaultDNSID,
    MOCK_DEFAULT_IDS.defaultGroupID,
  ],
}

// Export all mocks as a single object for easy access
export const allMocks = {
  general: mockGeneral,
  configs: mockConfigs,
  nodes: mockNodes,
  subscriptions: mockSubscriptions,
  groups: mockGroups,
  routings: mockRoutings,
  dnss: mockDNSs,
  user: mockUser,
  jsonStorage: mockJsonStorage,
  defaultIds: MOCK_DEFAULT_IDS,
}
