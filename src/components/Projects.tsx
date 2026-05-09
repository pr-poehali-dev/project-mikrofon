import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "ЖК Flora & Fauna",
    category: "Меблировка 2-комнатной",
    area: "68 м²",
    style: "Современный минимализм",
    price: "от 1 200 000 ₽",
    duration: "45 дней",
    image: "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/d69e0f91-34a7-406a-9237-6fcd5f4eff14.jpg",
    gallery: [],
  },
  {
    id: 2,
    title: "ЖК Richmond Residence",
    category: "Кухня + гостиная",
    area: "94 м²",
    style: "Премиальный лофт",
    price: "от 2 400 000 ₽",
    duration: "60 дней",
    image: "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/8426680a-307d-45da-8165-d3657d15b1d0.jpg",
    gallery: [],
  },
  {
    id: 3,
    title: "ЖК Европейский берег",
    category: "Полная комплектация",
    area: "112 м²",
    style: "Скандинавский стиль",
    price: "от 3 100 000 ₽",
    duration: "75 дней",
    image: "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/0c99552f-be17-4b7a-955c-84ea311c3bad.jpg",
    gallery: [],
  },
  {
    id: 4,
    title: "ЖК Оазис",
    category: "Гардеробная + спальня",
    area: "55 м²",
    style: "Теплый минимализм",
    price: "от 890 000 ₽",
    duration: "35 дней",
    image: "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/files/7f5e34e0-5f57-4573-8603-4e5608f65a42.jpg",
    gallery: [],
  },
  {
    id: 5,
    title: "ЖК FF3",
    category: "Полная меблировка",
    area: "87 м²",
    style: "Тёплый минимализм",
    price: "от 2 100 000 ₽",
    duration: "55 дней",
    image: "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/bucket/4f8bc7c5-e90e-4f82-84ca-caef21be9d51.jpg",
    gallery: [
      "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/bucket/4f8bc7c5-e90e-4f82-84ca-caef21be9d51.jpg",
      "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/bucket/bbbaeb4a-3354-4edc-911f-4c457ac933e8.jpg",
      "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/bucket/4c635d36-b87c-471e-af39-d525e57f15ed.jpg",
      "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/bucket/656d11a4-3a25-45f5-9ef9-e401668d2f1f.jpg",
      "https://cdn.poehali.dev/projects/4b174f8a-7b40-422d-92f3-3d0d5ddcf97f/bucket/a9beae1f-a252-46f8-8b21-8d98f4ca0793.jpg",
    ],
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [lightbox, setLightbox] = useState<{ projectId: number; index: number } | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return
      const project = projects.find((p) => p.id === lightbox.projectId)
      if (!project || !project.gallery.length) return
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowRight") setLightbox((prev) => prev ? { ...prev, index: (prev.index + 1) % project.gallery.length } : null)
      if (e.key === "ArrowLeft") setLightbox((prev) => prev ? { ...prev, index: (prev.index - 1 + project.gallery.length) % project.gallery.length } : null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lightbox])

  const openLightbox = (projectId: number, index: number) => setLightbox({ projectId, index })

  const lightboxProject = lightbox ? projects.find((p) => p.id === lightbox.projectId) : null

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Реализованные проекты</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Наши работы<br/>в Новосибирске</h2>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Обсудить ваш проект
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => {
            const isWide = project.gallery.length > 0
            return (
              <article
                key={project.id}
                className={`group cursor-pointer ${isWide ? "md:col-span-2" : ""}`}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {isWide ? (
                  <div className="mb-6">
                    <div
                      ref={(el) => (imageRefs.current[index] = el)}
                      className="relative overflow-hidden aspect-[16/7] mb-3 cursor-zoom-in"
                      onClick={() => openLightbox(project.id, 0)}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${hoveredId === project.id ? "scale-105" : "scale-100"}`}
                      />
                      <div
                        className="absolute inset-0 bg-primary origin-top"
                        style={{
                          transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                          transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                        }}
                      />
                      <div className={`absolute inset-0 bg-black/40 flex items-end p-6 transition-opacity duration-300 ${hoveredId === project.id ? "opacity-100" : "opacity-0"}`}>
                        <div className="text-white">
                          <p className="text-sm text-white/70 mb-1">{project.area} · {project.style}</p>
                          <p className="text-lg font-medium">{project.price}</p>
                          <p className="text-sm text-white/70">Срок: {project.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {project.gallery.slice(1).map((img, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden aspect-[4/3] cursor-zoom-in"
                          onClick={() => openLightbox(project.id, i + 1)}
                        >
                          <img src={img} alt={`${project.title} ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${hoveredId === project.id ? "scale-105" : "scale-100"}`}
                    />
                    <div
                      className="absolute inset-0 bg-primary origin-top"
                      style={{
                        transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                        transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                      }}
                    />
                    <div className={`absolute inset-0 bg-black/40 flex items-end p-6 transition-opacity duration-300 ${hoveredId === project.id ? "opacity-100" : "opacity-0"}`}>
                      <div className="text-white">
                        <p className="text-sm text-white/70 mb-1">{project.area} · {project.style}</p>
                        <p className="text-lg font-medium">{project.price}</p>
                        <p className="text-sm text-white/70">Срок: {project.duration}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {project.category} · {project.area}
                    </p>
                  </div>
                  <span className="text-muted-foreground/60 text-sm">{project.duration}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {lightbox && lightboxProject && lightboxProject.gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((prev) => prev ? { ...prev, index: (prev.index - 1 + lightboxProject.gallery.length) % lightboxProject.gallery.length } : null) }}
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <img
            src={lightboxProject.gallery[lightbox.index]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((prev) => prev ? { ...prev, index: (prev.index + 1) % lightboxProject.gallery.length } : null) }}
          >
            <ChevronRight className="w-9 h-9" />
          </button>
          <div className="absolute bottom-6 flex gap-2">
            {lightboxProject.gallery.map((_, i) => (
              <button
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === lightbox.index ? "bg-white" : "bg-white/30"}`}
                onClick={(e) => { e.stopPropagation(); setLightbox((prev) => prev ? { ...prev, index: i } : null) }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}