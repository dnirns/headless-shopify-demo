import React from 'react'
// import styles from './page.module.css'

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = await params
  console.log('handle', handle)
  return <div>Product Page</div>
}
