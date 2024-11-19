import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TasksResponse } from '../types/task'

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