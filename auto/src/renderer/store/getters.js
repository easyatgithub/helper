const getters = {
  app: state => state.app,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  worker: state => state.worker,
  card: state => state.card,
  log: state => state.log,
  task: state => state.task,
};
export default getters;
