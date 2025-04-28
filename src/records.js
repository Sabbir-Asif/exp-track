import { storage } from './storage.js';

export let records = storage.load();

export function addRecord(type, category, amount, date) {
  records.push({ type, category, amount, date });
  storage.save(records);
}

export function deleteRecord(index) {
  records.splice(index, 1);
  storage.save(records);
}
