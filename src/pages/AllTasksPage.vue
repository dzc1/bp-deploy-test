<template>
  <h4>This Page Displays all tasks</h4>
  <div class="container">
    <ul>
      <li v-for="task in userTasks" :key="task.id">
        <h5>{{ task.title }}</h5>
        <h6>{{ task.description.title }}</h6>
        <h6>{{ task.description.timeToBeCompleted }}</h6>
        <ul>
          <li
            v-for="(extraInfo, index) in task.description.extraInfoRequired"
            :key="index"
          >
            {{ extraInfo }}
          </li>
        </ul>
        <h6>{{ task.isCompleted ? "Completed" : "Incomplete" }}</h6>
        <button
          :disabled="task.isCompleted"
          @click="markTaskCompleted(task.id)"
        >
          Mark as Completed
        </button>
        <button @click="deleteTask(task.id)">Delete Task</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/user";

const taskStore = useTaskStore();
const userStore = useUserStore();

const { deleteTask, markTaskCompleted } = taskStore;
const { user } = userStore;

const userTasks = computed(() => taskStore.getTasksByUserId(user.value.id));
</script>

<style scoped>
button {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
