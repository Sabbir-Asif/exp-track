export const storage = {
  load() {
    return JSON.parse(localStorage.getItem('records')) || [];
  },
  save(records) {
    localStorage.setItem('records', JSON.stringify(records));
  }
};
