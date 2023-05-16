import { useNodesQuery } from '~/apis'

export const NodePage = () => {
  const { data } = useNodesQuery()
  console.log(data?.nodes.edges)

  return <div>node</div>
}
