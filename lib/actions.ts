'use server' // use server because this is being used in a client component

import { shopifyFetch } from '@/lib/shopify'
import { PRODUCTS_QUERY } from '@/lib/queries'
import type { Products } from '@/lib/types'

const PAGE_SIZE = 12
const SORT_KEY = 'CREATED_AT'
const SORT_REVERSE = true

export async function loadMoreProducts(after: string) {
  const data = await shopifyFetch<Products>({
    query: PRODUCTS_QUERY,
    variables: { first: PAGE_SIZE, after, sortKey: SORT_KEY, reverse: SORT_REVERSE },
    cache: 'no-store',
    tags: ['products'],
  })

  const products = data.products.edges.map((e) => e.node)
  const { pageInfo } = data.products
  const edgeEndCursor = data.products.edges[data.products.edges.length - 1]?.cursor ?? null
  const endCursor = edgeEndCursor ?? pageInfo.endCursor

  return {
    products,
    hasNextPage: pageInfo.hasNextPage,
    endCursor,
  }
}
