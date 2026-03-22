import * as authService from "../services/auth.service.js";
import MESSAGES from "../constants/messages.js";

export const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res
      .status(201)
      .json({ success: true, message: MESSAGES.AUTH.REGISTER_SUCCESS, data });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res
      .status(200)
      .json({ success: true, message: MESSAGES.AUTH.LOGIN_SUCCESS, data });
  } catch (err) {
    next(err);
  }
};
