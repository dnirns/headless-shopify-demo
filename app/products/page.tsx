import { shopifyFetch } from '@/lib/shopify'
import { PRODUCTS_QUERY } from '@/lib/queries'
import type { Products } from '@/lib/types'
import { ProductsList } from '@/components/ProductsList'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12
const SORT_KEY = 'CREATED_AT'
const SORT_REVERSE = true

export default async function ProductsPage() {
  const data = await shopifyFetch<Products>({
    query: PRODUCTS_QUERY,
    variables: { first: PAGE_SIZE, sortKey: SORT_KEY, reverse: SORT_REVERSE },
    cache: 'no-store',
    tags: ['products'],
  })

  const products = data.products.edges.map((e) => e.node)
  const { pageInfo } = data.products
  const edgeEndCursor = data.products.edges[data.products.edges.length - 1]?.cursor ?? null
  const endCursor = edgeEndCursor ?? pageInfo.endCursor

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.intro}>
            <span className={styles.sectionLabel}>Shopify Storefront</span>
            <h1 className={styles.title}>Products</h1>
            <p className={styles.subtitle}>
              A clean, flexible catalog view you can extend with filters, collections, and rich merchandising.
            </p>
          </div>
        </header>

        <ProductsList
          initialProducts={products}
          hasNextPage={pageInfo.hasNextPage}
          endCursor={endCursor}
        />
      </div>
    </main>
  )
}
