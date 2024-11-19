import { urlManipulation } from './../../node_modules/workbox-precaching/_types.d';
export interface Task {
    id: number
    title: string
    status: string
    attachment?: string | null
    created_at: string
    updated_at: string
}

export interface Links {
    url: string | null
    label: string
    active: boolean
}

export interface TasksResponse {
    data: Task[]
    current_page: number
    first_page_url: string
    from: number
    prev_page_url: string | null
    last_page_url: string | null
    last_page: number
    links: Links[]
    next_page_url: string | null
    path: string
    per_page: number
    to: number
    total: number
}