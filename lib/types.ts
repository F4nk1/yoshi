// User and Role Types
export type UserRole = "ADMIN" | "TUTOR" | "CHECKER" | "STUDENT"
/*
export interface User {
  id: string
  first_names: string
  role: UserRole
}
// lib/types.ts
*/
export type User = {
  user_id: string
  first_names: string
  last_names: string
  role: string
  email?: string
  phone?: string
}


export interface LoginRequest {
  user: {
    id: string
    password: string
  }
}

export interface LoginResponse {
  token: string
  user: User
}

// Tutoring Session Types
export interface TutoringSession {
  id: number
  student_code: string
  tutor_code: string
  semester_id: string
  day: string
  time_start: string
  time_end: string
  type_id: string
  mode_id: string
  status_id: string
  topic: string
  observations: string
  references: string
  psychological_derive: boolean
  created_at: string
  updated_at: string
}

// Tutoring Schedule (Cronograma) Types
export interface TutoringSchedule {
  id: number
  semester_id: string
  start_date: string
  end_date: string
  status: string
}

// Tutor Assignment Types
export interface TutorAssignment {
  id: number
  schedule_id: number
  tutor_code: string
  student_code: string
  day_start: string
  day_end: string
  status_id: string
}

// Student Type
export interface Student {
  id: string
  first_names: string
  [key: string]: any
}

// Tutor Type
export interface Tutor {
  id: string
  first_names: string
  [key: string]: any
}

// Admin Type
export interface Admin {
  id: string
  first_names: string
  [key: string]: any
}

// Checker Type
export interface Checker {
  id: string
  first_names: string
  [key: string]: any
}

// Report Types
export interface ReportData {
  [key: string]: any
}
