import { DEFAULT_V2RAY_FORM_VALUES } from '~/constants'
import { VlessNodeResolver, VmessNodeResolver } from '~/models'

test('VmessNodeResolver can generate url', () => {
  const vmessNodeResolver = new VmessNodeResolver()

  expect(vmessNodeResolver.generate({ ...DEFAULT_V2RAY_FORM_VALUES, port: 1024 })).toBeTypeOf('string')
})

test('VmessNodeResolver can resolve values', () => {
  const vmessNodeResolver = new VmessNodeResolver()

  expect(
    vmessNodeResolver.resolve(
      'vmess://eyJhZGQiOiAiNDUuMTk5LjEzOC4xNjQiLCAiYWlkIjogIjY0IiwgImFscG4iOiAiIiwgImZwIjogIiIsICJob3N0IjogIiIsICJpZCI6ICI2NWVhNjcyNy00NDYxLTQ3YTctYTVjNC1mZWYyYzY3ZjJmNzkiLCAibmV0IjogInRjcCIsICJwYXRoIjogIiIsICJwb3J0IjogIjQ5MzAxIiwgInBzIjogImdpdGh1Yi5jb20vZnJlZWZxIC0gXHU3ZjhlXHU1NmZkXHU1MmEwXHU1MjI5XHU3OThmXHU1YzNjXHU0ZTlhXHU1ZGRlXHU1NzIzXHU0ZjU1XHU1ODVlTVVMVEFDT01cdTY3M2FcdTYyM2YgMSIsICJzY3kiOiAiYXV0byIsICJzbmkiOiAiIiwgInRscyI6ICIiLCAidHlwZSI6ICIiLCAidiI6ICIyIn0=',
    ),
  ).toBeTypeOf('object')
})

test('VlessNodeResolver can generate url', () => {
  const vlessNodeResolver = new VlessNodeResolver()

  expect(vlessNodeResolver.generate({ ...DEFAULT_V2RAY_FORM_VALUES, port: 1024 })).toBeTypeOf('string')
})

test('VlessNodeResolver can resolve values', () => {
  const vlessNodeResolver = new VlessNodeResolver()

  expect(
    vlessNodeResolver.resolve(
      'vless://eyJhZGQiOiAiNDUuMTk5LjEzOC4xNjQiLCAiYWlkIjogIjY0IiwgImFscG4iOiAiIiwgImZwIjogIiIsICJob3N0IjogIiIsICJpZCI6ICI2NWVhNjcyNy00NDYxLTQ3YTctYTVjNC1mZWYyYzY3ZjJmNzkiLCAibmV0IjogInRjcCIsICJwYXRoIjogIiIsICJwb3J0IjogIjQ5MzAxIiwgInBzIjogImdpdGh1Yi5jb20vZnJlZWZxIC0gXHU3ZjhlXHU1NmZkXHU1MmEwXHU1MjI5XHU3OThmXHU1YzNjXHU0ZTlhXHU1ZGRlXHU1NzIzXHU0ZjU1XHU1ODVlTVVMVEFDT01cdTY3M2FcdTYyM2YgMSIsICJzY3kiOiAiYXV0byIsICJzbmkiOiAiIiwgInRscyI6ICIiLCAidHlwZSI6ICIiLCAidiI6ICIyIn0=',
    ),
  ).toBeTypeOf('object')
})
