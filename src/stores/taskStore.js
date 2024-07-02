import { reactive, watch } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

export const useTaskStore = defineStore("taskStore", () => {
  const userStore = useUserStore();

  const tasks = reactive([]);

  function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      tasks.push(...parsedTasks);
    } else {
      console.log("no tasks...");
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function addTask(task) {
    tasks.push(task);
    saveTasks();
  }

  function markTaskCompleted(taskId) {
    let task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.isCompleted = true;
      saveTasks();
    }
  }

  function deleteTask(taskId) {
    let index = tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
      saveTasks();
    }
  }

  function getTasksByUserId(userId) {
    return tasks.filter((task) => task.userId === userId);
  }

  // Load tasks from local storage initially
  //loadTasks();

  // Watch for changes in tasks and save to local storage
  watch(tasks, saveTasks, { deep: true });

  return {
    tasks,
    addTask,
    loadTasks,
    markTaskCompleted,
    deleteTask,
    getTasksByUserId,
  };
});
