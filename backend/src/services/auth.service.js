import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/error.middleware.js";
import MESSAGES from "../constants/messages.js";

const prisma = new PrismaClient();

export const register = async ({ username, password, age, gender }) => {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new AppError(MESSAGES.AUTH.USERNAME_TAKEN, 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword, age, gender },
  });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      age: user.age,
      gender: user.gender,
    },
  };
};

export const login = async ({ username, password }) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      age: user.age,
      gender: user.gender,
    },
  };
};
