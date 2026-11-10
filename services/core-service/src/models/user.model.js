const users = [];
let nextId = 1;

async function createUser(data) {
  const user = {
    id: nextId++,
    ...data,
    role: 'client',
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}

async function findByEmail(email) {
  return users.find((user) => user.email === email);
}

async function findById(id) {
  return users.find((user) => user.id === id);
}

async function findByMobile(mobile) {
  return users.find((user) => user.mobile === mobile);
}

module.exports = { createUser, findByEmail, findById, findByMobile };
