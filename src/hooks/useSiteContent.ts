import { useState } from 'react'

interface SiteContent {
  [section: string]: { [key: string]: string }
}

interface Project {
  id: number; title: string; category: string; area: string
  style: string; price: string; duration: string; image: string; gallery: string[]; sort_order: number
}

interface Review {
  id: number; author: string; location: string; text: string; rating: number; sort_order: number
}

export function useSiteContent() {
  const [content] = useState<SiteContent>({})
  const [projects] = useState<Project[]>([])
  const [reviews] = useState<Review[]>([])

  const get = (section: string, key: string, fallback = '') =>
    content[section]?.[key] ?? fallback

  return { content, projects, reviews, loaded: true, get }
}
