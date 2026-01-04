const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://172.25.153.38:8080/api/v1"

// =========================
// Token helpers
// =========================
function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// =========================
// Headers helper
// =========================
function buildHeaders(includeAuth: boolean): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (includeAuth) {
    const token = getToken()
    if (!token) {
      throw new Error("No authentication token found")
    }
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// =========================
// Generic API wrapper
// =========================
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...buildHeaders(includeAuth),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const err = await response.json()
      message = err.message || message
    } catch {}
    throw new Error(message)
  }

  return response.json()
}

// =========================
// API
// =========================
export const api = {
  // ---------- AUTH (PUBLIC) ----------
  login: (data: { user: { id: string; password: string } }) =>
    apiCall<{ token: string; user: any }>(
      "/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false,
    ),

  recover: (email: string) =>
    apiCall(
      "/recover",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      false,
    ),

  resetPassword: (data: { token: string; password: string }) =>
    apiCall(
      "/reset-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false,
    ),

  verifyEmail: (token: string) =>
    apiCall(
      "/verify-email",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      false,
    ),

  // ---------- AUTH (PROTECTED) ----------
  logout: () => apiCall("/logout", { method: "POST" }),

  changePassword: (data: { old_password: string; new_password: string }) =>
    apiCall("/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ---------- REGISTRATION (PUBLIC) ----------
  registerStudent: (data: any) =>
    apiCall("/register/Student", { method: "POST", body: JSON.stringify(data) }, false),

  registerTutor: (data: any) =>
    apiCall("/register/Tutor", { method: "POST", body: JSON.stringify(data) }, false),

  registerAdmin: (data: any) =>
    apiCall("/register/Admin", { method: "POST", body: JSON.stringify(data) }, false),

  registerChecker: (data: any) =>
    apiCall("/register/Checker", { method: "POST", body: JSON.stringify(data) }, false),

  // ---------- USERS (PROTECTED) ----------
  getUsers: () => apiCall<any[]>("/users"),
  getUser: (id: string) => apiCall<any>(`/users/${id}`),

  createUser: (data: any) =>
    apiCall(`/users/${data.id}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateUser: (id: string, data: any) =>
    apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ---------- STUDENTS ----------
  getStudents: () => apiCall<any[]>("/students"),
  getStudent: (id: string) => apiCall<any>(`/students/${id}`),

  // ---------- TUTORS ----------
  getTutors: () => apiCall<any[]>("/tutors"),
  getTutor: (id: string) => apiCall<any>(`/tutors/${id}`),

  // ---------- ADMINS ----------
  getAdmins: () => apiCall<any[]>("/admins"),
  getAdmin: (id: string) => apiCall<any>(`/admins/${id}`),

  // ---------- CHECKERS ----------
  getCheckers: () => apiCall<any[]>("/checkers"),
  getChecker: (id: string) => apiCall<any>(`/checkers/${id}`),

  // ---------- TUTORIAS ----------
  getTutorias: () => apiCall<any[]>("/tutorias"),
  getTutoria: (id: number) => apiCall<any>(`/tutorias/${id}`),

  createTutoria: (data: any) =>
    apiCall("/tutorias", { method: "POST", body: JSON.stringify(data) }),

  updateTutoria: (id: number, data: any) =>
    apiCall(`/tutorias/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  getConstancia: (id: number) =>
    apiCall<any>(`/tutorias/${id}/constancia`),

  // ---------- CRONOGRAMAS ----------
  getCronogramas: () => apiCall<any[]>("/cronogramas"),
  getCronograma: (id: number) => apiCall<any>(`/cronogramas/${id}`),

  createCronograma: (data: any) =>
    apiCall("/cronogramas", { method: "POST", body: JSON.stringify(data) }),  
  updateCronograma: (id: number, data: any) =>
    apiCall(`/cronogramas/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  asignarEstudiantes: (id: number, data: any) =>
    apiCall(`/cronogramas/${id}/asignar-estudiantes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  reasignarEstudiante: (id: number, data: any) =>
    apiCall(`/cronogramas/${id}/reasignar-estudiante`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cerrarAsignacion: (id: number) =>
    apiCall(`/cronogramas/${id}/cerrar-asignacion`, { method: "POST" }),

  // ---------- REPORTS ----------
  getReporteEstudiante: (studentCode: string) =>
    apiCall<any>(`/reportes/estudiante/${studentCode}`),

  getReporteTutor: (tutorCode: string) =>
    apiCall<any>(`/reportes/tutor/${tutorCode}`),

  getReporteSemestre: (semesterId: string) =>
    apiCall<any>(`/reportes/semestre/${semesterId}`),

  getReporteFecha: (date: string) =>
    apiCall<any>(`/reportes/fecha/${date}`),
}
