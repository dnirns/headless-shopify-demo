import Image from 'next/image'
import Link from 'next/link'
import { shopifyFetch } from '@/lib/shopify'
import { PRODUCTS_QUERY } from '@/lib/queries'
import type { Products } from '@/lib/types'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

type SearchParams = { after?: string | string[]; before?: string | string[] }

type ProductsPageProps = {
  searchParams?: SearchParams | Promise<SearchParams>
}

const PAGE_SIZE = 12
const SORT_KEY = 'CREATED_AT'
const SORT_REVERSE = true

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const after =
    typeof resolvedSearchParams?.after === 'string' ? resolvedSearchParams.after : undefined
  const before =
    typeof resolvedSearchParams?.before === 'string' ? resolvedSearchParams.before : undefined
  const pageParam =
    typeof (resolvedSearchParams as { page?: string | string[] } | undefined)?.page === 'string'
      ? (resolvedSearchParams as { page?: string }).page
      : undefined
  const pageNumber = Math.max(Number(pageParam ?? '1') || 1, 1)
  const isBackward = Boolean(before && !after)

  const data = await shopifyFetch<Products>({
    query: PRODUCTS_QUERY,
    variables: isBackward
      ? { last: PAGE_SIZE, before, sortKey: SORT_KEY, reverse: SORT_REVERSE }
      : { first: PAGE_SIZE, after, sortKey: SORT_KEY, reverse: SORT_REVERSE },
    cache: 'no-store',
    tags: ['products'],
  })

  const products = data.products.edges.map((e) => e.node)
  const { pageInfo } = data.products
  const edgeStartCursor = data.products.edges[0]?.cursor ?? null
  const edgeEndCursor = data.products.edges[data.products.edges.length - 1]?.cursor ?? null
  const startCursor = edgeStartCursor ?? pageInfo.startCursor
  const endCursor = edgeEndCursor ?? pageInfo.endCursor
  const prevHref =
    pageInfo.hasPreviousPage && startCursor
      ? `/products?before=${encodeURIComponent(startCursor)}&page=${Math.max(pageNumber - 1, 1)}`
      : null
  const nextHref =
    pageInfo.hasNextPage && endCursor
      ? `/products?after=${encodeURIComponent(endCursor)}&page=${pageNumber + 1}`
      : null

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
          <div className={styles.meta}>
            <span className={styles.count}>
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </header>

        <ul className={styles.grid}>
          {products.map((p) => (
            <li key={p.id} className={styles.card}>
              <div className={styles.media}>
                {p.featuredImage ? (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ?? p.title}
                    width={p.featuredImage.width}
                    height={p.featuredImage.height}
                    className={styles.image}
                    sizes='(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  />
                ) : (
                  <div className={styles.placeholder}>No image</div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.productTitle}>{p.title}</h2>
                {p.description ? <p className={styles.description}>{p.description}</p> : null}
                <div className={styles.priceRow}>
                  <span className={styles.price}>{p.priceRange.minVariantPrice.amount}</span>
                  <span className={styles.currency}>{p.priceRange.minVariantPrice.currencyCode}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <nav className={styles.pagination} aria-label='Pagination'>
          {prevHref ? (
            <Link className={styles.pageLink} href={prevHref} rel='prev' prefetch={false}>
              Previous
            </Link>
          ) : (
            <span className={`${styles.pageLink} ${styles.pageLinkDisabled}`}>Previous</span>
          )}

          <span className={styles.pageIndicator}>Page {pageNumber}</span>

          {nextHref ? (
            <Link className={styles.pageLink} href={nextHref} rel='next' prefetch={false}>
              Next
            </Link>
          ) : (
            <span className={`${styles.pageLink} ${styles.pageLinkDisabled}`}>Next</span>
          )}
        </nav>

      </div>
    </main>
  )
}
