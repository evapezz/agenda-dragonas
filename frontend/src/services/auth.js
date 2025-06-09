

// src/services/auth.js
import api from './api';

export function login({ username, password }) {
  return api
    .post('/auth/login', { username, password })
    .then(res => res.data) // { token, user }
}

export function register({ username, email, password, name, last_name }) {
  return api
    .post('/auth/register', { username, email, password, name, last_name })
    .then(res => res.data);
}
export function registerDoctor({ username, email, password, name, last_name }) {
  return api
    .post('/auth/register-doctor', { username, email, password, name, last_name })
    .then(res => res.data);
}