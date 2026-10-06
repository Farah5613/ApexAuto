import Nano from 'nano';

const nano = Nano('http://admin:secret123@localhost:5984');

export const db = nano.db.use('kanban_test');