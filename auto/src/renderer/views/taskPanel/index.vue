<template>
  <div>
    <task-list />
    <transfer />
  </div>
</template>

<script>
import TaskList from "./components/TaskList"
import Transfer from "./components/Transfer"

export default {
  name: "TaskPanel",
  components: {
    TaskList,
    Transfer
  }
}
</script>