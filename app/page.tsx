import Image from 'next/image'
import Link from 'next/link'
import { shopifyFetch } from '@/lib/shopify'
import { PRODUCTS_QUERY } from '@/lib/queries'
import type { Products } from '@/lib/types'
import styles from './page.module.css'

export default async function Home() {
  const data = await shopifyFetch<Products>({
    query: PRODUCTS_QUERY,
    variables: { first: 6 },
    cache: 'force-cache',
  })

  const products = data.products.edges.map((e) => e.node)

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.sectionLabel}>Welcome to</span>
          <h1 className={styles.heroTitle}>Shopify Store</h1>
          <p className={styles.heroSubtitle}>
            Discover our curated collection of quality products. Browse through our catalog and find exactly what you&apos;re looking for.
          </p>
          <Link href="/products" className={styles.ctaButton}>
            Browse All Products
          </Link>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.shell}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link href="/products" className={styles.viewAllLink}>
              View all
            </Link>
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
                      sizes='(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  ) : (
                    <div className={styles.placeholder}>No image</div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.productTitle}>{p.title}</h3>
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
      </section>
    </main>
  )
}
