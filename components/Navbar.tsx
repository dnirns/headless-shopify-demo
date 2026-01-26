import Link from 'next/link'
import styles from './Navbar.module.css'

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>Shopify Store</span>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className={styles.navLink}>
              Products
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
