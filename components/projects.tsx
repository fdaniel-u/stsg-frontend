"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface Project {
  id: number
  title: string
  category: string
  description: string
  fullDescription: string
  image: string
  images: string[]
  year: string
}

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoAdvanceKey, setAutoAdvanceKey] = useState(0)

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [project])

  useEffect(() => {
    if (!project || project.images.length < 2) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [project, autoAdvanceKey])

  const goToPrevious = () => {
    if (!project) return
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    setAutoAdvanceKey((prev) => prev + 1)
  }

  const goToNext = () => {
    if (!project) return
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    setAutoAdvanceKey((prev) => prev + 1)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 md:p-4"
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden overflow-y-auto rounded-2xl bg-[#f5f0eb] md:mx-0 md:h-[80vh] md:flex-row md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50 md:right-4 md:top-4 md:h-auto md:w-auto md:bg-transparent md:text-gray-400 md:hover:text-[#1a1a1a]"
        >
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-56 w-full shrink-0 md:h-full md:w-[60%]">
          {project.images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`${project.title} - Image ${index + 1}`}
                fill
                className="rounded-t-2xl object-cover md:rounded-none"
              />
            </div>
          ))}

          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/60"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/60"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {project.images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index)
                  setAutoAdvanceKey((prev) => prev + 1)
                }}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col justify-between p-5 md:w-[40%] md:p-8">
          <div>
            <span className="inline-block rounded-full border border-[#c8a882] px-3 py-1 text-xs text-[#c8a882]">
              {project.category}
            </span>

            <h3 className="mt-4 font-serif text-xl font-bold text-[#1a1a1a] md:text-2xl">
              {project.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Completado: {project.year}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {project.fullDescription}
            </p>
          </div>

          <button
            onClick={() => {
              onClose()
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="mt-6 rounded-full bg-[#c8a882] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#c8a882]/90 md:mt-auto"
          >
            Solicitar Proyecto Similar
          </button>
        </div>
      </div>
    </div>
  )
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Casa unifamiliar Krzycko",
    category: "Viviendas",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&fit=crop",
    ],
    year: "2023",
  },
  {
    id: 2,
    title: "Recepción Hotel WorkTravel",
    category: "Hoteles",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&fit=crop",
    ],
    year: "2023",
  },
  {
    id: 3,
    title: "Garaje subterráneo para edificio",
    category: "Garajes",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=800&q=80&fit=crop",
    ],
    year: "2022",
  },
  {
    id: 4,
    title: "Villa familiar de dos pisos",
    category: "Viviendas",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80&fit=crop",
    ],
    year: "2023",
  },
  {
    id: 5,
    title: "Complejo de apartamentos moderno",
    category: "Edificios",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80&fit=crop",
    ],
    year: "2022",
  },
  {
    id: 6,
    title: "Renovación hotel boutique",
    category: "Hoteles",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
    fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80&fit=crop",
    ],
    year: "2021",
  },
]

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(
            data.map((p: { id: number; title: string; category: string; description: string; full_description: string; image: string; images: string[]; year: string }) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              description: p.description,
              fullDescription: p.full_description,
              image: p.image,
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image],
              year: p.year,
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch("/api/content/categories")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data)
        }
      })
      .catch(() => {
        setCategories(["Viviendas", "Edificios", "Garajes", "Hoteles"])
      })
      .finally(() => setLoadingCategories(false))
  }, [])

  const filters = ["Todos", ...categories]

  const filteredProjects = activeFilter === "Todos" 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-cream py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            GALERÍA
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
            Nuestras Realizaciones
          </h2>
        </div>

        <div
          className={`mt-8 flex flex-wrap gap-2 transition-all delay-100 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {loadingCategories ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-dark/10" />
            ))
          ) : (
            filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm transition-all ${
                  activeFilter === filter
                    ? "bg-dark text-cream"
                    : "bg-dark/5 text-dark hover:bg-dark/10"
                }`}
              >
                {filter}
              </button>
            ))
          )}
        </div>

        <div
          className={`mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all delay-200 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg bg-dark/10" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-16 rounded bg-dark/10" />
                  <div className="h-5 w-3/4 rounded bg-dark/10" />
                  <div className="h-3 w-full rounded bg-dark/10" />
                </div>
              </div>
            ))
          ) : (
            filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-4">
                  <span className="text-xs font-medium text-terracotta">
                    {project.category}
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-dark">
                    {project.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-dark/60">
                    {project.description}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
