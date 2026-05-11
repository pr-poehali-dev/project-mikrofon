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

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(contentCache || {})
  const [projects, setProjects] = useState<Project[]>(projectsCache || [])
  const [reviews, setReviews] = useState<Review[]>(reviewsCache || [])
  const [loaded, setLoaded] = useState(!!contentCache)

  useEffect(() => {
    if (contentCache && projectsCache && reviewsCache) { setLoaded(true); return }
    Promise.all([apiGetContent(), apiGetProjects(), apiGetReviews()]).then(([c, p, r]) => {
      contentCache = c || {}
      projectsCache = Array.isArray(p) ? p : []
      reviewsCache = Array.isArray(r) ? r : []
      setContent(contentCache)
      setProjects(projectsCache)
      setReviews(reviewsCache)
      setLoaded(true)
    }).catch(() => {
      contentCache = {}
      projectsCache = []
      reviewsCache = []
      setLoaded(true)
    })
  }, [])

  const get = (section: string, key: string, fallback = '') =>
    content[section]?.[key] ?? fallback

  return { content, projects, reviews, loaded, get }
}