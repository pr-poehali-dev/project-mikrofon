import { useState, useEffect } from 'react'
import { apiGetContent, apiGetProjects, apiGetReviews } from '@/lib/api'

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

let contentCache: SiteContent | null = null
let projectsCache: Project[] | null = null
let reviewsCache: Review[] | null = null

export function invalidateContentCache() {
  contentCache = null
  projectsCache = null
  reviewsCache = null
  window.dispatchEvent(new Event('content-updated'))
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(contentCache || {})
  const [projects, setProjects] = useState<Project[]>(projectsCache || [])
  const [reviews, setReviews] = useState<Review[]>(reviewsCache || [])
  const [loaded, setLoaded] = useState(!!contentCache)

  const load = () => {
    Promise.all([apiGetContent(), apiGetProjects(), apiGetReviews()]).then(([c, p, r]) => {
      contentCache = c
      projectsCache = p
      reviewsCache = r
      setContent(c)
      setProjects(p)
      setReviews(r)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }

  useEffect(() => {
    if (!contentCache || !projectsCache || !reviewsCache) load()
    window.addEventListener('content-updated', load)
    return () => window.removeEventListener('content-updated', load)
  }, [])

  const get = (section: string, key: string, fallback = '') =>
    content[section]?.[key] ?? fallback

  return { content, projects, reviews, loaded, get }
}