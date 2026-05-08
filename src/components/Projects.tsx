import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

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
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

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
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === project.id ? "scale-105" : "scale-100"
                  }`}
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
          ))}
        </div>
      </div>
    </section>
  )
}
