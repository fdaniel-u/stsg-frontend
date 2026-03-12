"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getProjects, createProject, updateProject, deleteProject,
  getServices, createService, updateService, deleteService,
  getContactInfo, updateContactInfo,
  getAboutContent, updateAboutContent,
  getHeroContent, updateHeroContent,
  getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink,
  getCategories,
} from "@/lib/api"
import { SocialIcon } from "@/components/social-icon"

type Tab = "proyectos" | "servicios" | "inicio" | "about" | "contacto" | "social"

interface Project {
  id: number
  title: string
  category: string
  description: string
  full_description: string
  image: string
  images: string[]
  year: string
  created_at: string
}

interface ServiceItem {
  id: number
  title: string
  description: string
  icon: string
  order_index: number
}

interface ContactData {
  phone: string
  email: string
  address: string
  maps_url: string
  contact_description: string
}

interface AboutData {
  tag: string
  title: string
  paragraph1: string
  paragraph2: string
  image_url: string
}

interface HeroData {
  title: string
  subtitle: string
  image_url: string
  button1_text: string
  button2_text: string
}

interface SocialLinkItem {
  id: number
  network_name: string
  url: string
  icon: string
  is_active: boolean
  order_index: number
}

const EMPTY_PROJECT = {
  title: "",
  category: "",
  description: "",
  full_description: "",
  image: "",
  images: "",
  year: new Date().getFullYear().toString(),
}

const EMPTY_SERVICE = {
  title: "",
  description: "",
  icon: "",
  order_index: 0,
}

const EMPTY_SOCIAL = {
  network_name: "",
  url: "",
  icon: "facebook",
  is_active: true,
  order_index: 0,
}

const ICON_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
]

const CONSTRUCTION_ICONS = [
  "\u{1F3E0}","\u{1F3D7}\uFE0F","\u{1F3E2}","\u{1F3DB}\uFE0F","\u{1F3ED}","\u{1F3EA}",
  "\u{1F528}","\u{1FA9A}","\u{1F527}","\u{1FA9B}","\u2699\uFE0F","\u{1F529}",
  "\u{1F9F1}","\u{1FAB5}","\u{1FAA8}","\u{1F3D7}\uFE0F","\u{1F6A7}","\u{1F4D0}",
  "\u{1FA9F}","\u{1F6AA}","\u{1F6D7}","\u{1FA9C}","\u{1F4A1}","\u{1F50C}",
  "\u{1F3CA}","\u{1F33F}","\u{1F333}","\u{1F3E1}","\u{1F3D8}\uFE0F","\u{1F6D6}",
  "\u{1F6BF}","\u{1F6C1}","\u{1F6BD}","\u{1FAA0}","\u{1F9F9}","\u{1F9FA}",
  "\u{1F3A8}","\u{1F58C}\uFE0F","\u2728","\u{1F31F}","\u{1F48E}","\u{1F3C6}",
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("inicio")
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT)
  const [savingProject, setSavingProject] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [projectCategories, setProjectCategories] = useState<string[]>([])

  const [services, setServices] = useState<ServiceItem[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE)
  const [savingService, setSavingService] = useState(false)
  const [deleteServiceConfirm, setDeleteServiceConfirm] = useState<number | null>(null)

  const [contactForm, setContactForm] = useState<ContactData>({ phone: "", email: "", address: "", maps_url: "", contact_description: "" })
  const [loadingContact, setLoadingContact] = useState(true)
  const [savingContact, setSavingContact] = useState(false)

  const [aboutForm, setAboutForm] = useState<AboutData>({ tag: "", title: "", paragraph1: "", paragraph2: "", image_url: "" })
  const [loadingAbout, setLoadingAbout] = useState(true)
  const [savingAbout, setSavingAbout] = useState(false)

  const [heroForm, setHeroForm] = useState<HeroData>({ title: "", subtitle: "", image_url: "", button1_text: "", button2_text: "" })
  const [loadingHero, setLoadingHero] = useState(true)
  const [savingHero, setSavingHero] = useState(false)

  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([])
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null)
  const [socialForm, setSocialForm] = useState(EMPTY_SOCIAL)
  const [savingSocial, setSavingSocial] = useState(false)
  const [deleteSocialConfirm, setDeleteSocialConfirm] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }
    fetchProjects()
    fetchServices()
    fetchContact()
    fetchAbout()
    fetchHero()
    fetchSocialLinks()
    fetchCategories()
  }, [router])

  const getToken = () => localStorage.getItem("admin_token") || ""

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(""), 3000)
  }

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch { setError("Error al cargar proyectos") }
    finally { setLoadingProjects(false) }
  }

  const fetchServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch { setError("Error al cargar servicios") }
    finally { setLoadingServices(false) }
  }

  const fetchContact = async () => {
    try {
      const data = await getContactInfo()
      setContactForm({ phone: data.phone, email: data.email, address: data.address, maps_url: data.maps_url, contact_description: data.contact_description || "" })
    } catch {}
    finally { setLoadingContact(false) }
  }

  const fetchAbout = async () => {
    try {
      const data = await getAboutContent()
      setAboutForm({ tag: data.tag, title: data.title, paragraph1: data.paragraph1, paragraph2: data.paragraph2, image_url: data.image_url })
    } catch {}
    finally { setLoadingAbout(false) }
  }

  const fetchHero = async () => {
    try {
      const data = await getHeroContent()
      setHeroForm({ title: data.title, subtitle: data.subtitle, image_url: data.image_url, button1_text: data.button1_text, button2_text: data.button2_text })
    } catch {}
    finally { setLoadingHero(false) }
  }

  const fetchSocialLinks = async () => {
    try {
      const data = await getAllSocialLinks(getToken())
      setSocialLinks(data)
    } catch {}
    finally { setLoadingSocial(false) }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setProjectCategories(data)
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin")
  }

  const openNewProject = () => {
    setProjectForm(EMPTY_PROJECT)
    setEditingProjectId(null)
    setError("")
    setShowProjectModal(true)
  }

  const openEditProject = (p: Project) => {
    setProjectForm({
      title: p.title,
      category: p.category,
      description: p.description,
      full_description: p.full_description,
      image: p.image,
      images: p.images.join("\n"),
      year: p.year,
    })
    setEditingProjectId(p.id)
    setError("")
    setShowProjectModal(true)
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProject(true)
    setError("")
    const payload = { ...projectForm, images: projectForm.images.split("\n").map((u) => u.trim()).filter(Boolean) }
    try {
      if (editingProjectId !== null) {
        await updateProject(editingProjectId, payload, getToken())
      } else {
        await createProject(payload, getToken())
      }
      setShowProjectModal(false)
      await fetchProjects()
      await fetchCategories()
      showSuccess(editingProjectId ? "Proyecto actualizado" : "Proyecto creado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally { setSavingProject(false) }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id, getToken())
      setDeleteConfirm(null)
      await fetchProjects()
      await fetchCategories()
      showSuccess("Proyecto eliminado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  const openNewService = () => {
    setServiceForm({ ...EMPTY_SERVICE, order_index: services.length + 1 })
    setEditingServiceId(null)
    setError("")
    setShowServiceModal(true)
  }

  const openEditService = (s: ServiceItem) => {
    setServiceForm({ title: s.title, description: s.description, icon: s.icon, order_index: s.order_index })
    setEditingServiceId(s.id)
    setError("")
    setShowServiceModal(true)
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingService(true)
    setError("")
    try {
      if (editingServiceId !== null) {
        await updateService(editingServiceId, serviceForm, getToken())
      } else {
        await createService(serviceForm, getToken())
      }
      setShowServiceModal(false)
      await fetchServices()
      showSuccess(editingServiceId ? "Servicio actualizado" : "Servicio creado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar servicio")
    } finally { setSavingService(false) }
  }

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService(id, getToken())
      setDeleteServiceConfirm(null)
      await fetchServices()
      showSuccess("Servicio eliminado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar servicio")
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingContact(true)
    setError("")
    try {
      await updateContactInfo(contactForm, getToken())
      showSuccess("Contacto actualizado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar contacto")
    } finally { setSavingContact(false) }
  }

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingAbout(true)
    setError("")
    try {
      await updateAboutContent(aboutForm, getToken())
      showSuccess("Contenido actualizado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar contenido")
    } finally { setSavingAbout(false) }
  }

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingHero(true)
    setError("")
    try {
      await updateHeroContent(heroForm, getToken())
      showSuccess("Hero actualizado")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar hero")
    } finally { setSavingHero(false) }
  }

  const openNewSocial = () => {
    setSocialForm({ ...EMPTY_SOCIAL, order_index: socialLinks.length + 1 })
    setEditingSocialId(null)
    setError("")
    setShowSocialModal(true)
  }

  const openEditSocial = (s: SocialLinkItem) => {
    setSocialForm({ network_name: s.network_name, url: s.url, icon: s.icon, is_active: s.is_active, order_index: s.order_index })
    setEditingSocialId(s.id)
    setError("")
    setShowSocialModal(true)
  }

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSocial(true)
    setError("")
    try {
      if (editingSocialId !== null) {
        await updateSocialLink(editingSocialId, socialForm, getToken())
      } else {
        await createSocialLink(socialForm, getToken())
      }
      setShowSocialModal(false)
      await fetchSocialLinks()
      showSuccess(editingSocialId ? "Red social actualizada" : "Red social creada")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar red social")
    } finally { setSavingSocial(false) }
  }

  const handleDeleteSocial = async (id: number) => {
    try {
      await deleteSocialLink(id, getToken())
      setDeleteSocialConfirm(null)
      await fetchSocialLinks()
      showSuccess("Red social eliminada")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar red social")
    }
  }

  const handleToggleSocialActive = async (s: SocialLinkItem) => {
    try {
      await updateSocialLink(s.id, { is_active: !s.is_active }, getToken())
      await fetchSocialLinks()
      showSuccess(s.is_active ? "Red social desactivada" : "Red social activada")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "inicio", label: "Inicio (Home)" },
    { key: "about", label: "Sobre Nosotros" },
    { key: "servicios", label: "Servicios" },
    { key: "proyectos", label: "Proyectos" },
    { key: "contacto", label: "Contacto" },
    { key: "social", label: "Redes Sociales" },
  ]

  const inputClass = "w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-2.5 text-[#1a1a1a] focus:border-[#c8a882] focus:outline-none focus:ring-2 focus:ring-[#c8a882]"
  const labelClass = "mb-1.5 block text-sm font-medium text-[#1a1a1a]"

  const PreviewPanel = ({ children }: { children: React.ReactNode }) => (
    <div className={`${showPreview ? "block" : "hidden"} lg:block`}>
      <div className="rounded-xl bg-[#1a1a1a] p-4 lg:sticky lg:top-4">
        <h3 className="mb-3 font-serif text-sm font-bold text-[#c8a882]">Vista Previa</h3>
        <div className="text-[#f5f0eb]">{children}</div>
      </div>
    </div>
  )

  const PreviewToggle = () => (
    <button
      onClick={() => setShowPreview(!showPreview)}
      className="mb-4 flex items-center gap-2 rounded-lg border border-[#333] px-4 py-2 text-sm text-[#999] transition-all hover:border-[#c8a882] hover:text-[#c8a882] lg:hidden"
    >
      <span>{showPreview ? "Ocultar" : "\uD83D\uDC41 Vista Previa"}</span>
    </button>
  )

  const renderHeroPreview = () => (
    <div className="overflow-hidden rounded-lg">
      <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: heroForm.image_url ? `url(${heroForm.image_url})` : undefined, backgroundColor: heroForm.image_url ? undefined : "#333" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full flex-col items-center justify-center p-3 text-center">
          <h4 className="text-sm font-bold text-[#f5f0eb]">{heroForm.title || "Título del Hero"}</h4>
          <p className="mt-1 text-xs text-[#ccc] line-clamp-2">{heroForm.subtitle || "Subtítulo"}</p>
        </div>
      </div>
    </div>
  )

  const renderAboutPreview = () => (
    <div className="space-y-2">
      {aboutForm.image_url && <img src={aboutForm.image_url} alt="About" className="h-24 w-full rounded-lg object-cover" />}
      {aboutForm.tag && <span className="text-[10px] font-bold uppercase tracking-widest text-[#c8a882]">{aboutForm.tag}</span>}
      <h4 className="text-sm font-bold text-[#f5f0eb]">{aboutForm.title || "Título"}</h4>
      <p className="text-xs text-[#999] line-clamp-4">{aboutForm.paragraph1 || "Párrafo 1..."}</p>
    </div>
  )

  const renderServicesPreview = () => {
    const visibleServices = services.slice(0, 4)
    const remaining = services.length - 4
    return (
      <div className="divide-y divide-[#333]">
        {visibleServices.length === 0 ? (
          <p className="text-xs text-[#666]">No hay servicios para previsualizar</p>
        ) : (
          visibleServices.map((s, i) => (
            <details key={s.id} className="group" open={i === 0}>
              <summary className="flex cursor-pointer items-center gap-2 px-2 py-2.5 text-xs font-medium text-[#f5f0eb] hover:bg-[#222]">
                <span className="text-base">{s.icon}</span>
                <span className="flex-1">{s.title}</span>
                <span className="text-[10px] text-[#666] transition-transform group-open:rotate-180">&#9660;</span>
              </summary>
              <div className="px-2 pb-2.5">
                <p className="text-[10px] text-[#999] line-clamp-3">{s.description}</p>
              </div>
            </details>
          ))
        )}
        {remaining > 0 && <p className="border-t border-[#333] pt-2 text-center text-[10px] text-[#666]">+{remaining} servicios más</p>}
      </div>
    )
  }

  const renderProjectsPreview = () => {
    const visibleProjects = projects.slice(0, 4)
    return (
      <div className="grid grid-cols-2 gap-2">
        {visibleProjects.length === 0 ? (
          <p className="col-span-2 text-xs text-[#666]">No hay proyectos para previsualizar</p>
        ) : (
          visibleProjects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg bg-[#222]">
              {p.image && <img src={p.image} alt={p.title} className="h-16 w-full object-cover" />}
              <div className="p-1.5">
                <span className="text-[8px] font-bold uppercase text-[#c8a882]">{p.category}</span>
                <p className="text-[10px] font-medium text-[#f5f0eb] line-clamp-1">{p.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  const renderContactPreview = () => (
    <div className="space-y-2">
      {contactForm.contact_description && <p className="text-xs text-[#999] line-clamp-3">{contactForm.contact_description}</p>}
      <div className="space-y-1.5">
        {contactForm.phone && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#c8a882]">Tel:</span>
            <span className="text-[#ccc]">{contactForm.phone}</span>
          </div>
        )}
        {contactForm.email && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#c8a882]">Email:</span>
            <span className="text-[#ccc]">{contactForm.email}</span>
          </div>
        )}
        {contactForm.address && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#c8a882]">Dir:</span>
            <span className="text-[#ccc]">{contactForm.address}</span>
          </div>
        )}
      </div>
      {contactForm.maps_url ? (
        <div className="overflow-hidden rounded-lg">
          <iframe src={contactForm.maps_url} width="100%" height="100" style={{ border: 0 }} loading="lazy" title="Map preview" />
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg bg-[#222] text-[10px] text-[#666]">Sin mapa configurado</div>
      )}
    </div>
  )

  const renderSocialPreview = () => {
    const activeLinks = socialLinks.filter((s) => s.is_active)
    return (
      <div className="space-y-3">
        {activeLinks.length === 0 ? (
          <p className="text-xs text-[#666]">No hay redes activas</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {activeLinks.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 rounded-full bg-[#222] px-3 py-1.5">
                  <SocialIcon icon={s.icon} className="h-3.5 w-3.5 text-[#c8a882]" />
                  <span className="text-[10px] text-[#ccc]">{s.network_name}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#333] pt-2">
              <p className="text-[10px] text-[#666]">También aparece en el footer</p>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <header className="border-b border-[#333] bg-[#111] px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="h-4 w-4 flex-shrink-0 bg-[#c8a882]" />
            <h1 className="truncate font-serif text-base font-bold text-[#f5f0eb] sm:text-xl">
              STSG Calidad Total
            </h1>
            <span className="hidden text-sm text-[#666] sm:inline">/ Panel Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#999] transition-all hover:border-[#c8a882] hover:text-[#c8a882] sm:px-4 sm:py-2 sm:text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="-mx-4 mb-6 overflow-x-auto border-b border-[#333] px-4 pb-4 sm:-mx-0 sm:mb-8 sm:px-0">
          <div className="flex gap-2 whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setError(""); setSuccess("") }}
                className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                  activeTab === tab.key
                    ? "bg-[#c8a882] text-white"
                    : "text-[#999] hover:bg-[#333] hover:text-[#f5f0eb]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-900/30 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {activeTab === "proyectos" && (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#f5f0eb] sm:text-2xl">Proyectos</h2>
                <p className="mt-1 text-xs text-[#666] sm:text-sm">{projects.length} proyectos registrados</p>
              </div>
              <button onClick={openNewProject} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c8a882] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#b89872] sm:w-auto sm:px-5 sm:py-2.5">
                <span className="text-lg leading-none">+</span>
                Nuevo Proyecto
              </button>
            </div>
            <PreviewToggle />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
            <div className="relative overflow-hidden rounded-xl bg-[#f5f0eb] sm:rounded-2xl">
              <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
              <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

              {loadingProjects ? (
                <div className="flex items-center justify-center py-20 text-[#999]">Cargando proyectos...</div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-[#999]">No hay proyectos aún.</p>
                  <button onClick={openNewProject} className="mt-4 text-sm text-[#c8a882] underline underline-offset-2 hover:text-[#b89872]">Crear el primero</button>
                </div>
              ) : (
                <>
                  {/* Vista móvil - Cards */}
                  <div className="divide-y divide-[#e5e0da] md:hidden">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-[#1a1a1a]">{project.title}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#c8a882]/20 px-2 py-0.5 text-xs font-medium text-[#8a6a4a]">{project.category}</span>
                              <span className="text-xs text-[#555]">{project.year}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => openEditProject(project)} className="flex-1 rounded-lg border border-[#c8a882] px-3 py-2 text-xs font-medium text-[#c8a882] transition-all hover:bg-[#c8a882] hover:text-white">Editar</button>
                          {deleteConfirm === project.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteProject(project.id)} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600">Sí</button>
                              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-[#ccc] px-3 py-2 text-xs text-[#555] hover:bg-[#eee]">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(project.id)} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white">Eliminar</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Vista desktop - Tabla */}
                  <table className="hidden w-full text-sm md:table">
                    <thead>
                      <tr className="border-b border-[#e5e0da] bg-[#ece7e1]">
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Título</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Categoría</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Año</th>
                        <th className="px-4 py-3 text-right font-medium text-[#555] lg:px-6 lg:py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, i) => (
                        <tr key={project.id} className={`border-b border-[#e5e0da] transition-colors hover:bg-[#ece7e1] ${i === projects.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3 font-medium text-[#1a1a1a] lg:px-6 lg:py-4">{project.title}</td>
                          <td className="px-4 py-3 lg:px-6 lg:py-4">
                            <span className="rounded-full bg-[#c8a882]/20 px-3 py-1 text-xs font-medium text-[#8a6a4a]">{project.category}</span>
                          </td>
                          <td className="px-4 py-3 text-[#555] lg:px-6 lg:py-4">{project.year}</td>
                          <td className="px-4 py-3 text-right lg:px-6 lg:py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditProject(project)} className="rounded-lg border border-[#c8a882] px-3 py-1.5 text-xs font-medium text-[#c8a882] transition-all hover:bg-[#c8a882] hover:text-white">Editar</button>
                              {deleteConfirm === project.id ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-[#555]">¿Confirmar?</span>
                                  <button onClick={() => handleDeleteProject(project.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Sí</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-[#ccc] px-3 py-1.5 text-xs text-[#555] hover:bg-[#eee]">No</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteConfirm(project.id)} className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white">Eliminar</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <PreviewPanel>{renderProjectsPreview()}</PreviewPanel>
            </div>
          </>
        )}

        {activeTab === "servicios" && (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#f5f0eb] sm:text-2xl">Servicios</h2>
                <p className="mt-1 text-xs text-[#666] sm:text-sm">{services.length} servicios registrados</p>
              </div>
              <button onClick={openNewService} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c8a882] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#b89872] sm:w-auto sm:px-5 sm:py-2.5">
                <span className="text-lg leading-none">+</span>
                Nuevo Servicio
              </button>
            </div>
            <PreviewToggle />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
            <div className="relative overflow-x-auto rounded-xl bg-[#f5f0eb] sm:rounded-2xl">
              <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
              <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

              {loadingServices ? (
                <div className="flex items-center justify-center py-20 text-[#999]">Cargando servicios...</div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-[#999]">No hay servicios aún.</p>
                  <button onClick={openNewService} className="mt-4 text-sm text-[#c8a882] underline underline-offset-2 hover:text-[#b89872]">Crear el primero</button>
                </div>
              ) : (
                <>
                  {/* Vista móvil - Cards */}
                  <div className="divide-y divide-[#e5e0da] md:hidden">
                    {services.map((s) => (
                      <div key={s.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a]/10 text-xl">{s.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-[#1a1a1a]">{s.title}</h3>
                              <span className="rounded-full bg-[#c8a882]/20 px-2 py-0.5 text-[10px] font-medium text-[#8a6a4a]">#{s.order_index}</span>
                            </div>
                            <p className="mt-1 text-xs text-[#555] line-clamp-2">{s.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => openEditService(s)} className="flex-1 rounded-lg border border-[#c8a882] px-3 py-2 text-xs font-medium text-[#c8a882] transition-all hover:bg-[#c8a882] hover:text-white">Editar</button>
                          {deleteServiceConfirm === s.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteService(s.id)} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600">Sí</button>
                              <button onClick={() => setDeleteServiceConfirm(null)} className="rounded-lg border border-[#ccc] px-3 py-2 text-xs text-[#555] hover:bg-[#eee]">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteServiceConfirm(s.id)} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white">Eliminar</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Vista desktop - Tabla */}
                  <table className="hidden w-full text-sm md:table">
                    <thead>
                      <tr className="border-b border-[#e5e0da] bg-[#ece7e1]">
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Orden</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Icono</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Título</th>
                        <th className="hidden px-4 py-3 text-left font-medium text-[#555] lg:table-cell lg:px-6 lg:py-4">Descripción</th>
                        <th className="min-w-[120px] px-4 py-3 pr-4 text-right font-medium text-[#555] lg:px-6 lg:py-4 lg:pr-6">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s, i) => (
                        <tr key={s.id} className={`border-b border-[#e5e0da] transition-colors hover:bg-[#ece7e1] ${i === services.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3 text-[#555] lg:px-6 lg:py-4">{s.order_index}</td>
                          <td className="px-4 py-3 text-xl lg:px-6 lg:py-4">{s.icon}</td>
                          <td className="px-4 py-3 font-medium text-[#1a1a1a] lg:px-6 lg:py-4">{s.title}</td>
                          <td className="hidden max-w-xs truncate px-4 py-3 text-[#555] lg:table-cell lg:px-6 lg:py-4">{s.description}</td>
                          <td className="px-4 py-3 pr-4 text-right lg:px-6 lg:py-4 lg:pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditService(s)} className="rounded-lg border border-[#c8a882] px-3 py-1.5 text-xs font-medium text-[#c8a882] transition-all hover:bg-[#c8a882] hover:text-white">Editar</button>
                              {deleteServiceConfirm === s.id ? (
                                <div className="flex items-center gap-1">
                                  <span className="hidden text-xs text-[#555] lg:inline">¿Confirmar?</span>
                                  <button onClick={() => handleDeleteService(s.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Sí</button>
                                  <button onClick={() => setDeleteServiceConfirm(null)} className="rounded-lg border border-[#ccc] px-3 py-1.5 text-xs text-[#555] hover:bg-[#eee]">No</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteServiceConfirm(s.id)} className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white">Eliminar</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <PreviewPanel>{renderServicesPreview()}</PreviewPanel>
            </div>
          </>
        )}

        {activeTab === "inicio" && (
          <>
            <div className="mb-4 sm:mb-8">
              <h2 className="font-serif text-xl font-bold text-[#f5f0eb] sm:text-2xl">Inicio (Home)</h2>
              <p className="mt-1 text-xs text-[#666] sm:text-sm">Edita el contenido de la sección principal del sitio</p>
            </div>
            <PreviewToggle />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
              <div className="relative overflow-hidden rounded-xl bg-[#f5f0eb] p-4 sm:rounded-2xl sm:p-8">
                <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
                <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

                {loadingHero ? (
                  <div className="flex items-center justify-center py-20 text-[#999]">Cargando...</div>
                ) : (
                  <form onSubmit={handleHeroSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Título principal</label>
                      <input type="text" value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} className={inputClass} placeholder="Construyendo Tu Visión..." />
                    </div>
                    <div>
                      <label className={labelClass}>Subtítulo</label>
                      <textarea rows={3} value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>URL de imagen de fondo</label>
                      <input type="text" value={heroForm.image_url} onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
                    </div>
                    {heroForm.image_url && (
                      <div>
                        <p className="text-xs text-gray-400">Vista previa de imagen</p>
                        <img src={heroForm.image_url} alt="Vista previa" className="mt-3 h-32 w-full rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                      </div>
                    )}
                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={savingHero} className="w-full rounded-lg bg-[#c8a882] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b89872] disabled:opacity-70 sm:w-auto">
                        {savingHero ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <PreviewPanel>{renderHeroPreview()}</PreviewPanel>
            </div>
          </>
        )}

        {activeTab === "about" && (
          <>
            <div className="mb-4 sm:mb-8">
              <h2 className="font-serif text-xl font-bold text-[#f5f0eb] sm:text-2xl">Sobre Nosotros</h2>
              <p className="mt-1 text-xs text-[#666] sm:text-sm">Edita el contenido de la sección &quot;Sobre Nosotros&quot;</p>
            </div>
            <PreviewToggle />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
              <div className="relative overflow-hidden rounded-xl bg-[#f5f0eb] p-4 sm:rounded-2xl sm:p-8">
                <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
                <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

                {loadingAbout ? (
                  <div className="flex items-center justify-center py-20 text-[#999]">Cargando...</div>
                ) : (
                  <form onSubmit={handleAboutSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Etiqueta superior</label>
                      <input type="text" value={aboutForm.tag} onChange={(e) => setAboutForm({ ...aboutForm, tag: e.target.value })} className={inputClass} placeholder="QUIÉNES SOMOS" />
                    </div>
                    <div>
                      <label className={labelClass}>Título</label>
                      <input type="text" value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Párrafo 1</label>
                      <textarea rows={4} value={aboutForm.paragraph1} onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Párrafo 2</label>
                      <textarea rows={4} value={aboutForm.paragraph2} onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>URL de imagen principal</label>
                      <input type="text" value={aboutForm.image_url} onChange={(e) => setAboutForm({ ...aboutForm, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
                    </div>
                    {aboutForm.image_url && (
                      <div>
                        <p className="text-xs text-gray-400">Vista previa de imagen</p>
                        <img src={aboutForm.image_url} alt="Vista previa" className="mt-3 h-32 w-full rounded-lg object-cover sm:h-48" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                      </div>
                    )}
                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={savingAbout} className="w-full rounded-lg bg-[#c8a882] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b89872] disabled:opacity-70 sm:w-auto">
                        {savingAbout ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <PreviewPanel>{renderAboutPreview()}</PreviewPanel>
            </div>
          </>
        )}

        {activeTab === "contacto" && (
          <>
            <div className="mb-4 sm:mb-8">
              <h2 className="font-serif text-xl font-bold text-[#f5f0eb] sm:text-2xl">Información de Contacto</h2>
              <p className="mt-1 text-xs text-[#666] sm:text-sm">Edita la información de contacto que se muestra en el sitio</p>
            </div>
            <PreviewToggle />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
              <div className="relative overflow-hidden rounded-xl bg-[#f5f0eb] p-4 sm:rounded-2xl sm:p-8">
                <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
                <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

                {loadingContact ? (
                  <div className="flex items-center justify-center py-20 text-[#999]">Cargando...</div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Descripción de la sección</label>
                      <textarea rows={3} value={contactForm.contact_description} onChange={(e) => setContactForm({ ...contactForm, contact_description: e.target.value })} className={inputClass} placeholder="Texto que aparece sobre el formulario de contacto..." />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Teléfono</label>
                        <input type="text" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Correo electrónico</label>
                        <input type="text" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Dirección</label>
                      <input type="text" value={contactForm.address} onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>URL de Google Maps (embed)</label>
                      <input type="text" value={contactForm.maps_url} onChange={(e) => setContactForm({ ...contactForm, maps_url: e.target.value })} className={inputClass} placeholder="https://www.google.com/maps/embed?pb=..." />
                    </div>
                    {contactForm.maps_url && (
                      <div>
                        <label className={labelClass}>Vista previa del mapa</label>
                        <div className="overflow-hidden rounded-lg border border-[#e5e5e5]">
                          <iframe src={contactForm.maps_url} width="100%" height="200" className="sm:h-[250px]" style={{ border: 0 }} loading="lazy" title="Map preview" />
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={savingContact} className="w-full rounded-lg bg-[#c8a882] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b89872] disabled:opacity-70 sm:w-auto">
                        {savingContact ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <PreviewPanel>{renderContactPreview()}</PreviewPanel>
            </div>
          </>
        )}

        {activeTab === "social" && (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#f5f0eb] sm:text-2xl">Redes Sociales</h2>
                <p className="mt-1 text-xs text-[#666] sm:text-sm">{socialLinks.length} redes sociales registradas</p>
              </div>
              <button onClick={openNewSocial} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c8a882] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#b89872] sm:w-auto sm:px-5 sm:py-2.5">
                <span className="text-lg leading-none">+</span>
                Nueva Red Social
              </button>
            </div>
            <PreviewToggle />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
            <div className="relative overflow-x-auto rounded-xl bg-[#f5f0eb] sm:rounded-2xl">
              <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
              <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

              {loadingSocial ? (
                <div className="flex items-center justify-center py-20 text-[#999]">Cargando redes sociales...</div>
              ) : socialLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-[#999]">No hay redes sociales aún.</p>
                  <button onClick={openNewSocial} className="mt-4 text-sm text-[#c8a882] underline underline-offset-2 hover:text-[#b89872]">Crear la primera</button>
                </div>
              ) : (
                <>
                  {/* Vista móvil - Cards */}
                  <div className="divide-y divide-[#e5e0da] md:hidden">
                    {socialLinks.map((s) => (
                      <div key={s.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                            <SocialIcon icon={s.icon} className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-[#1a1a1a]">{s.network_name}</h3>
                              <span className="rounded-full bg-[#c8a882]/20 px-2 py-0.5 text-[10px] font-medium text-[#8a6a4a]">#{s.order_index}</span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-[#555]">{s.url}</p>
                            <button
                              onClick={() => handleToggleSocialActive(s)}
                              className={`mt-2 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                                s.is_active
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {s.is_active ? "Activo" : "Inactivo"}
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => openEditSocial(s)} className="flex-1 rounded-lg border border-[#c8a882] px-3 py-2 text-xs font-medium text-[#c8a882] transition-all hover:bg-[#c8a882] hover:text-white">Editar</button>
                          {deleteSocialConfirm === s.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteSocial(s.id)} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600">Sí</button>
                              <button onClick={() => setDeleteSocialConfirm(null)} className="rounded-lg border border-[#ccc] px-3 py-2 text-xs text-[#555] hover:bg-[#eee]">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteSocialConfirm(s.id)} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white">Eliminar</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Vista desktop - Tabla */}
                  <table className="hidden w-full text-sm md:table">
                    <thead>
                      <tr className="border-b border-[#e5e0da] bg-[#ece7e1]">
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Orden</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Icono</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Red Social</th>
                        <th className="hidden px-4 py-3 text-left font-medium text-[#555] lg:table-cell lg:px-6 lg:py-4">URL</th>
                        <th className="px-4 py-3 text-left font-medium text-[#555] lg:px-6 lg:py-4">Estado</th>
                        <th className="px-4 py-3 text-right font-medium text-[#555] lg:px-6 lg:py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socialLinks.map((s, i) => (
                        <tr key={s.id} className={`border-b border-[#e5e0da] transition-colors hover:bg-[#ece7e1] ${i === socialLinks.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3 text-[#555] lg:px-6 lg:py-4">{s.order_index}</td>
                          <td className="px-4 py-3 lg:px-6 lg:py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                              <SocialIcon icon={s.icon} className="h-4 w-4" />
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-[#1a1a1a] lg:px-6 lg:py-4">{s.network_name}</td>
                          <td className="hidden px-4 py-3 text-[#555] lg:table-cell lg:px-6 lg:py-4">{s.url.length > 30 ? s.url.slice(0, 30) + "\u2026" : s.url}</td>
                          <td className="px-4 py-3 lg:px-6 lg:py-4">
                            <button
                              onClick={() => handleToggleSocialActive(s)}
                              className={`rounded-full px-2 py-1 text-xs font-medium transition-all lg:px-3 ${
                                s.is_active
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {s.is_active ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right lg:px-6 lg:py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditSocial(s)} className="rounded-lg border border-[#c8a882] px-3 py-1.5 text-xs font-medium text-[#c8a882] transition-all hover:bg-[#c8a882] hover:text-white">Editar</button>
                              {deleteSocialConfirm === s.id ? (
                                <div className="flex items-center gap-1">
                                  <span className="hidden text-xs text-[#555] lg:inline">¿Confirmar?</span>
                                  <button onClick={() => handleDeleteSocial(s.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Sí</button>
                                  <button onClick={() => setDeleteSocialConfirm(null)} className="rounded-lg border border-[#ccc] px-3 py-1.5 text-xs text-[#555] hover:bg-[#eee]">No</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteSocialConfirm(s.id)} className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white">Eliminar</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <PreviewPanel>{renderSocialPreview()}</PreviewPanel>
            </div>
          </>
        )}
      </main>

      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
          <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-xl bg-[#f5f0eb] p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-8">
            <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
            <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

            <h3 className="mb-4 font-serif text-lg font-bold text-[#1a1a1a] sm:mb-6 sm:text-xl">
              {editingProjectId !== null ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h3>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Título *</label>
                  <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Categoría *</label>
                  <input
                    list="categories"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className={inputClass}
                    placeholder="Escribe o selecciona..."
                  />
                  <datalist id="categories">
                    {projectCategories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="text" required value={projectForm.year} onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })} className={inputClass} placeholder="2024" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Descripción corta *</label>
                  <textarea required rows={2} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Descripción completa *</label>
                  <textarea required rows={4} value={projectForm.full_description} onChange={(e) => setProjectForm({ ...projectForm, full_description: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>URL imagen principal *</label>
                  <input type="text" required value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    URLs imágenes adicionales
                    <span className="ml-1 text-xs font-normal text-[#999]">(una por línea)</span>
                  </label>
                  <textarea rows={3} value={projectForm.images} onChange={(e) => setProjectForm({ ...projectForm, images: e.target.value })} className={inputClass} placeholder={"https://...\nhttps://..."} />
                </div>
              </div>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button type="button" onClick={() => setShowProjectModal(false)} className="w-full rounded-lg border border-[#ccc] px-5 py-2.5 text-sm font-medium text-[#555] transition-all hover:bg-[#eee] sm:w-auto">Cancelar</button>
                <button type="submit" disabled={savingProject} className="w-full rounded-lg bg-[#c8a882] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b89872] disabled:opacity-70 sm:w-auto">
                  {savingProject ? "Guardando..." : editingProjectId !== null ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
          <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-xl bg-[#f5f0eb] p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-8">
            <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
            <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

            <h3 className="mb-4 font-serif text-lg font-bold text-[#1a1a1a] sm:mb-6 sm:text-xl">
              {editingServiceId !== null ? "Editar Servicio" : "Nuevo Servicio"}
            </h3>

            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Título *</label>
                <input type="text" required value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Descripción *</label>
                <textarea required rows={3} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Icono</label>
                <div className="grid grid-cols-6 gap-1 rounded-lg border border-[#e5e5e5] bg-white p-2 sm:gap-1.5 sm:p-3">
                  {CONSTRUCTION_ICONS.map((emoji, idx) => (
                    <button
                      key={`${emoji}-${idx}`}
                      type="button"
                      onClick={() => setServiceForm({ ...serviceForm, icon: emoji })}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg sm:h-10 sm:w-10 sm:text-xl ${serviceForm.icon === emoji ? "bg-[#c8a882] ring-2 ring-[#c8a882]" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#999]">O escribe un emoji personalizado:</p>
                <input type="text" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} className={`mt-1 ${inputClass}`} placeholder="\u{1F3E0}" />
              </div>
              <div>
                <label className={labelClass}>Orden</label>
                <input type="number" value={serviceForm.order_index} onChange={(e) => setServiceForm({ ...serviceForm, order_index: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button type="button" onClick={() => setShowServiceModal(false)} className="w-full rounded-lg border border-[#ccc] px-5 py-2.5 text-sm font-medium text-[#555] transition-all hover:bg-[#eee] sm:w-auto">Cancelar</button>
                <button type="submit" disabled={savingService} className="w-full rounded-lg bg-[#c8a882] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b89872] disabled:opacity-70 sm:w-auto">
                  {savingService ? "Guardando..." : editingServiceId !== null ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
          <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-xl bg-[#f5f0eb] p-4 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-8">
            <div className="absolute -left-2 -top-2 h-5 w-5 bg-[#7ec8c0]" />
            <div className="absolute -bottom-2 -right-2 h-5 w-5 bg-[#c8a882]" />

            <h3 className="mb-4 font-serif text-lg font-bold text-[#1a1a1a] sm:mb-6 sm:text-xl">
              {editingSocialId !== null ? "Editar Red Social" : "Nueva Red Social"}
            </h3>

            <form onSubmit={handleSocialSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Nombre de la red *</label>
                <input type="text" required value={socialForm.network_name} onChange={(e) => setSocialForm({ ...socialForm, network_name: e.target.value })} className={inputClass} placeholder="Facebook" />
              </div>
              <div>
                <label className={labelClass}>URL *</label>
                <input type="text" required value={socialForm.url} onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })} className={inputClass} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Icono *</label>
                  <select required value={socialForm.icon} onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })} className={inputClass}>
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Orden</label>
                  <input type="number" value={socialForm.order_index} onChange={(e) => setSocialForm({ ...socialForm, order_index: parseInt(e.target.value) || 0 })} className={inputClass} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="social-active"
                  checked={socialForm.is_active}
                  onChange={(e) => setSocialForm({ ...socialForm, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#e5e5e5] text-[#c8a882] focus:ring-[#c8a882]"
                />
                <label htmlFor="social-active" className="text-sm text-[#1a1a1a]">Activo (visible en el sitio)</label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[#e5e5e5] bg-white p-3 sm:p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                  <SocialIcon icon={socialForm.icon} />
                </div>
                <span className="text-sm text-[#555]">Vista previa del icono</span>
              </div>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button type="button" onClick={() => setShowSocialModal(false)} className="w-full rounded-lg border border-[#ccc] px-5 py-2.5 text-sm font-medium text-[#555] transition-all hover:bg-[#eee] sm:w-auto">Cancelar</button>
                <button type="submit" disabled={savingSocial} className="w-full rounded-lg bg-[#c8a882] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b89872] disabled:opacity-70 sm:w-auto">
                  {savingSocial ? "Guardando..." : editingSocialId !== null ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
