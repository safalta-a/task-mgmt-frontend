import { ref } from 'vue'
import { defineStore } from 'pinia'

interface Task {
    id: number
    title: string
    status: string
    attachment?: string | null
}

interface TasksResponse {
    data: Task[]
    prev_page_url: string | null
    next_page_url: string | null
}

export const useTaskStore = defineStore('task', () => {
    const taskList = ref<TasksResponse>()

    const storeTaskDetails = (data: TasksResponse) => {
        taskList.value = data
    }
    return{
        taskList,
        storeTaskDetails
    }
})