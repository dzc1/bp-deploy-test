import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const profile = ref(null);
  const isLoggedIn = ref(false);
  const taskStore = useTaskStore();

  function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  function fetchUser() {
    user.value = getFromLocalStorage("user");
    profile.value = getFromLocalStorage("profile");
    if (user.value) {
      isLoggedIn.value = true;
      taskStore.loadTasks();
    }
  }

  function register(email, password) {
    const newUser = { id: Date.now(), email, password };
    user.value = newUser;
    saveToLocalStorage("user", newUser);
    const newProfile = { user_id: newUser.id, username: email, tasks: [] };
    profile.value = newProfile;
    saveToLocalStorage("profile", newProfile);
  }

  function signIn(email, password) {
    let storedUser = getFromLocalStorage("user");
    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      user.value = storedUser;
      profile.value = getFromLocalStorage("profile");
      isLoggedIn.value = true;
      taskStore.loadTasks();
    } else {
      throw new Error("User not found or password incorrect");
    }
  }

  let signOut = () => {
    user.value = null;
    profile.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
  };

  function getTasksForUser() {
    return taskStore.getTasksByUserId(user.value.id);
  }

  watch(
    () => taskStore.tasks,
    (newTasks) => {
      if (profile.value) {
        profile.value.tasks = newTasks.filter(
          (task) => task.userId === user.value.id
        );
        saveToLocalStorage("profile", profile.value);
      }
    },
    { deep: true }
  );

  return {
    user,
    profile,
    isLoggedIn,
    fetchUser,
    register,
    signIn,
    signOut,
    getTasksForUser,
  };
});
