import Image from 'next/image'
import { shopifyFetch } from '@/lib/shopify'
import { PRODUCTS_QUERY } from '@/lib/queries'
import type { Products } from '@/lib/types'
import styles from './page.module.css'

export default async function Home() {
  const data = await shopifyFetch<Products>({
    query: PRODUCTS_QUERY,
    variables: { first: 12 },
    cache: 'force-cache',
    // tags: ["products"],
  })

  const products = data.products.edges.map((e) => e.node)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.intro}>
            <span className={styles.kicker}>Shopify Storefront</span>
            <h1 className={styles.title}>Products</h1>
            <p className={styles.subtitle}>
              A clean, flexible catalog view you can extend with filters, collections, and rich merchandising.
            </p>
          </div>
          <div className={styles.meta}>
            <span className={styles.count}>{products.length} items</span>
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
      </div>
    </main>
  )
}
