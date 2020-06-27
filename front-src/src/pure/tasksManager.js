class TasksManager {
  constructor() {
    // Singleton
    if (TasksManager.instance) {
      return TasksManager.instance;
    }

    TasksManager.instance = this;

    this._id = 0;
    this.cancelTime = 5000;
    this.$tasks = {
      list: []
    };

    this.refresh();
  }

  refresh() {
    const execList = [];
    this.$tasks.list.forEach(task => {
      const rest = task.cancelTime - Date.now();
      if (rest <= 0) {
        execList.push(task);
      }
    });
    execList.forEach(task => this.exec(task.id));

    cancelAnimationFrame(this.refreshRAF);
    this.refreshRAF = requestAnimationFrame(this.refresh.bind(this));
  }

  get(id) {
    return this.$tasks.list.find(task => task.id === id);
  }

  remove(id) {
    const i = this.$tasks.list.findIndex(task => task.id === id);
    if (i > -1) {
      this.$tasks.list.splice(i, 1);
    }
  }

  exec(id) {
    const task = this.get(id);
    if (task) {
      task.process();
      this.remove(id);
    }
  }

  add({ title, description, process, uid = null }) {
    if (uid) {
      const old = this.$tasks.list.find(task => task.uid === uid);
      if (old) {
        this.remove(old.id);
      }
    }

    const task = {
      id: ++this._id,
      uid,
      title,
      description,
      process,
      restSec: Math.floor(this.cancelTime / 1000),
      cancelTime: Date.now() + this.cancelTime
    };
    this.$tasks.list.push(task);
    return task;
  }
}

const tasksManager = new TasksManager();

export { TasksManager };
export default tasksManager;
