export const VALIDATION_RULES = {
  email: /^(?=[^@]{1,64}@.{1,255}$)[^@\s()::;]+@[^@\s()::;]+\.[^@\s()::;]+$/,
  
  username: /^[a-zA-Z0-9_-]+$/,
  
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
};