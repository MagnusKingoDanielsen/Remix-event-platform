import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function login(loginEmail, loginPassword) {
  const users = await mongoose.models.Users.find({});
  const user = users.find((user) => user.email === loginEmail);

  if (user) {
    const hashedpassword = user.password;

    // Use bcrypt.compareSync to compare the passwords
    const result = bcrypt.compareSync(loginPassword, hashedpassword);

    if (result) {
      // Passwords match
      return { result: true, username: user.username };
    } else {
      // Passwords don't match
      return false;
    }
  } else {
    // User doesn't exist
    return false;
  }
}
