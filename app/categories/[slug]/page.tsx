import { notFound } from 'next/navigation'
import CategoryPage from './CategoryPage'
import { dealCategories, type DealCategory } from '@/data/curatedDeals'

interface CategoryParams {
  params: {
    slug: string
  }
}

export default function CategorySlugPage({ params }: CategoryParams) {
  const slug = params.slug.toLowerCase() as DealCategory

  if (!dealCategories.includes(slug)) {
    notFound()
  }

  return <CategoryPage slug={slug} />
}
