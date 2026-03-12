export async function login(email: string, password: string) {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Credenciales inválidas")
  }

  return res.json()
}

export async function getProjects() {
  const res = await fetch("/api/projects")
  if (!res.ok) throw new Error("Error al cargar proyectos")
  return res.json()
}

export async function createProject(data: Record<string, unknown>, token: string) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al crear proyecto")
  }
  return res.json()
}

export async function updateProject(id: number, data: Record<string, unknown>, token: string) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al actualizar proyecto")
  }
  return res.json()
}

export async function deleteProject(id: number, token: string) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al eliminar proyecto")
  }
  return res.json()
}

export async function getServices() {
  const res = await fetch("/api/content/services")
  if (!res.ok) throw new Error("Error al cargar servicios")
  return res.json()
}

export async function createService(data: Record<string, unknown>, token: string) {
  const res = await fetch("/api/content/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al crear servicio")
  }
  return res.json()
}

export async function updateService(id: number, data: Record<string, unknown>, token: string) {
  const res = await fetch(`/api/content/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al actualizar servicio")
  }
  return res.json()
}

export async function deleteService(id: number, token: string) {
  const res = await fetch(`/api/content/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al eliminar servicio")
  }
  return res.json()
}

export async function getContactInfo() {
  const res = await fetch("/api/content/contact")
  if (!res.ok) throw new Error("Error al cargar info de contacto")
  return res.json()
}

export async function updateContactInfo(data: Record<string, string>, token: string) {
  const res = await fetch("/api/content/contact", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al actualizar contacto")
  }
  return res.json()
}

export async function getAboutContent() {
  const res = await fetch("/api/content/about")
  if (!res.ok) throw new Error("Error al cargar contenido")
  return res.json()
}

export async function updateAboutContent(data: Record<string, string>, token: string) {
  const res = await fetch("/api/content/about", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al actualizar contenido")
  }
  return res.json()
}

export async function getHeroContent() {
  const res = await fetch("/api/content/hero")
  if (!res.ok) throw new Error("Error al cargar hero")
  return res.json()
}

export async function updateHeroContent(data: Record<string, string>, token: string) {
  const res = await fetch("/api/content/hero", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al actualizar hero")
  }
  return res.json()
}

export async function getSocialLinks() {
  const res = await fetch("/api/content/social")
  if (!res.ok) throw new Error("Error al cargar redes sociales")
  return res.json()
}

export async function getAllSocialLinks(token: string) {
  const res = await fetch("/api/content/social/all", {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al cargar redes sociales")
  return res.json()
}

export async function createSocialLink(data: Record<string, unknown>, token: string) {
  const res = await fetch("/api/content/social", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al crear red social")
  }
  return res.json()
}

export async function updateSocialLink(id: number, data: Record<string, unknown>, token: string) {
  const res = await fetch(`/api/content/social/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al actualizar red social")
  }
  return res.json()
}

export async function deleteSocialLink(id: number, token: string) {
  const res = await fetch(`/api/content/social/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Error al eliminar red social")
  }
  return res.json()
}

export async function getCategories() {
  const res = await fetch("/api/content/categories")
  if (!res.ok) throw new Error("Error al cargar categorías")
  return res.json()
}
