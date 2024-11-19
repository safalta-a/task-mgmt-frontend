<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Task } from '../types/task'
import { useTaskStore } from '../store/task'

// Components for icons
import EditIcon from '../assets/edit.svg?component'
import DeleteIcon from '../assets/delete.svg?component'
import Attachment from '../assets/attachment.svg?component'
import CloseIcon from '../assets/cancel.svg?component'

const taskStore = useTaskStore()
const newTask = ref<{ title: string, status: string }>({ title: '', status: 'pending' })
const editingTask = ref<Task | null>(null)
const file = ref<File | null>(null)
const showModal = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const loading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

// Fetch tasks from API
const fetchTasks = async (url = '/tasks') => {
  loading.value = true
  try {
    const res = await axios.get(url)
    if (res.data.response.code === 200) {
      taskStore.storeTaskDetails(res.data.response.data)
    }
  } catch (error) {
    errorMessage.value = 'Failed to fetch tasks.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Add a new task
const addTask = async () => {
  try {
    const formData = new FormData()
    formData.append('title', newTask.value.title)
    formData.append('status', newTask.value.status)
    if (file.value) formData.append('attachment', file.value)

    await axios.post('/addTask', formData)
    await fetchTasks()
    resetModal()
  } catch (error) {
    console.error('Error adding task:', error)
  }
}

// Delete a task
const deleteTask = async (id: number) => {
  try {
    await axios.post(`/deleteTask/${id}`)
    await fetchTasks()
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const openEditTaskModal = (task: Task) => {
  editingTask.value = { ...task }
  isEditing.value = true
  showModal.value = true
}

// Update an existing task
const updateTask = async () => {
  if (!editingTask.value) return
  try {
    const formData = new FormData()
    formData.append('title', editingTask.value.title)
    formData.append('status', editingTask.value.status)
    if (file.value) formData.append('attachment', file.value)

    await axios.post(`/editTask/${editingTask.value.id}`, formData)
    await fetchTasks()
    resetModal()
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const resetModal = () => {
  showModal.value = false
  isEditing.value = false
  editingTask.value = null
  newTask.value = { title: '', status: 'pending' }
  file.value = null
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
  }
}


onMounted(() => {
  fetchTasks()
});
</script>

<template>
  <div class="task-manager">
    <h1>Task Manager</h1>

    <!-- Add Task Button -->
    <div class="btn-div">
      <button class="add-task-btn" @click="() => { showModal = true; isEditing = false; }">
        + Add Task
      </button>
    </div>

    <!-- Task List -->
    <div v-if="loading" class="loading">Loading tasks...</div>
    <div v-if="!loading && taskStore.taskList?.data.length" class="task-list">
      <div v-for="task in taskStore.taskList.data" :key="task.id" class="task-card">
        <div class="task-content">
          <h3>{{ task.title }}</h3>
          <p class="status">{{ task.status }}</p>
          <div v-if="task.attachment" class="attachment">
            <Attachment />
            <a :href="task.attachment" target="_blank" rel="noopener noreferrer">View Attachment</a>
          </div>
        </div>
        <div class="task-actions">
          <button @click="openEditTaskModal(task)"><EditIcon /></button>
          <button @click="deleteTask(task.id)"><DeleteIcon /></button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button v-if="taskStore.taskList?.prev_page_url" @click="fetchTasks(taskStore.taskList.prev_page_url)">Previous</button>
      <button v-if="taskStore.taskList?.next_page_url" @click="fetchTasks(taskStore.taskList.next_page_url)">Next</button>
    </div>

    <!-- Add/Edit Task Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <p class="head-text">{{ isEditing ? 'Edit Task' : 'Add Task' }}</p>
          <button class="close-btn" @click="resetModal">
            <CloseIcon />
          </button>
        </div>
        <form @submit.prevent="isEditing ? updateTask() : addTask()" class="modal-form">
          <div class="form-group">
            <label for="task-title">Title</label>
            <input
              v-if="!isEditing"
              id="task-title"
              v-model="newTask.title"
              type="text"
              class="form-control"
              placeholder="Enter task title"
              required
            />
            <input
              v-if="isEditing && editingTask"
              id="task-title"
              v-model="editingTask.title"
              type="text"
              class="form-control"
              placeholder="Enter task title"
              required
            />
          </div>
          <div class="form-group">
            <label for="task-status">Status</label>
            <select v-if="!isEditing"  class="form-control" id="task-status" v-model="newTask.status">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select v-if="isEditing && editingTask" class="form-control" id="task-status" v-model="editingTask.status">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="file-upload" class="file-label">
              <Attachment /> Upload Attachment
            </label>
            <input
              id="file-upload"
              type="file"
              class="file-input"
              @change="handleFileChange"
            />
          </div>
          <button type="submit" class="submit-btn">{{ isEditing ? 'Update' : 'Add' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-manager {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.add-task-btn {
  margin-bottom: 12px;
  padding: 10px 20px;
  background-color: #147e87;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-task-btn:hover {
  background-color: #0a5057;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-actions button {
  background: none;
  border: none;
  cursor: pointer;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  text-align: left;
}

/* Input Fields */
.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #007bff;
}

/* File Upload */
.file-label {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: #007bff;
  cursor: pointer;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.file-label i {
  margin-right: 8px;
}

.file-input {
  display: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.close-btn{
  background: none;
}

.close-btn:hover {
  border-style: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin: 0 4px;
}
.status{
  text-align: left;
  color: gray;
  text-transform: capitalize;
}
.pagination {
  margin-top: 12px;
}
.btn-div {
  display: flex;
  justify-content: end;
}

.head-text{
  font-size: 20px;
  font-weight: 600;
}
</style>