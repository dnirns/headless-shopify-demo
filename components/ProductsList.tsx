'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { loadMoreProducts } from '@/lib/actions'
import styles from '@/app/products/page.module.css'

type Product = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: null | {
    url: string
    altText: string | null
    width: number
    height: number
  }
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
}

type ProductsListProps = {
  initialProducts: Product[]
  hasNextPage: boolean
  endCursor: string | null
}

export function ProductsList({ initialProducts, hasNextPage, endCursor }: ProductsListProps) {
  const [products, setProducts] = useState(initialProducts)
  const [hasMore, setHasMore] = useState(hasNextPage)
  const [cursor, setCursor] = useState(endCursor)
  const [isPending, startTransition] = useTransition()

  const handleLoadMore = () => {
    if (!cursor || !hasMore) return

    startTransition(async () => {
      const result = await loadMoreProducts(cursor)
      setProducts((prev) => [...prev, ...result.products])
      setHasMore(result.hasNextPage)
      setCursor(result.endCursor)
    })
  }

  return (
    <>
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

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className={styles.loadMoreButton}
          >
            {isPending ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  )
}
