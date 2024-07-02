<template>
  <div>
    <h1>Add New Task</h1>
    <div v-if="taskAdded">
      <p>Yay! New task created.</p>
      <button @click="startNewTask">Start a New Task</button>
    </div>
    <div v-else>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="title">Title:</label>
          <input v-model="newTask.title" type="text" id="title" required />
        </div>
        <div>
          <label for="descriptionTitle">Description Title:</label>
          <input
            v-model="newTask.description.title"
            type="text"
            id="descriptionTitle"
            required
          />
        </div>
        <div>
          <label for="timeToBeCompleted">Time to be Completed:</label>
          <input
            v-model="newTask.description.timeToBeCompleted"
            type="text"
            id="timeToBeCompleted"
            required
          />
        </div>
        <div>
          <label for="extraInfo">Extra Info Required:</label>
          <input v-model="newExtraInfo" type="text" id="extraInfo" />
          <button type="button" @click="addExtraInfo">Add Info</button>
          <ul>
            <li
              v-for="(info, index) in newTask.description.extraInfoRequired"
              :key="index"
            >
              {{ info }}
              <button type="button" @click="removeExtraInfo(index)">
                Remove
              </button>
            </li>
          </ul>
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/user";

const taskStore = useTaskStore();
const userStore = useUserStore();

const { addTask } = taskStore;
const { user } = userStore;

const newTask = reactive({
  id: Date.now(),
  title: "",
  description: {
    title: "",
    timeToBeCompleted: "",
    extraInfoRequired: [],
  },
  isCompleted: false,
  userId: user.value.id,
});

const newExtraInfo = ref("");
const taskAdded = ref(false);

const handleSubmit = () => {
  const taskToAdd = JSON.parse(JSON.stringify(newTask));
  taskToAdd.id = Date.now();
  taskToAdd.userId = user.value.id;
  addTask(taskToAdd);
  taskAdded.value = true;
};

const addExtraInfo = () => {
  if (newExtraInfo.value.trim()) {
    newTask.description.extraInfoRequired.push(newExtraInfo.value.trim());
    newExtraInfo.value = "";
  }
};

const removeExtraInfo = (index) => {
  newTask.description.extraInfoRequired.splice(index, 1);
};

const resetForm = () => {
  newTask.title = "";
  newTask.description.title = "";
  newTask.description.timeToBeCompleted = "";
  newTask.description.extraInfoRequired = [];
};

const startNewTask = () => {
  resetForm();
  taskAdded.value = false;
};
</script>
