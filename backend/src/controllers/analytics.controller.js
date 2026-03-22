import * as analyticsService from "../services/analytics.service.js";
import MESSAGES from "../constants/messages.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalytics(req.query);
    res
      .status(200)
      .json({ success: true, message: MESSAGES.ANALYTICS.SUCCESS, data });
  } catch (err) {
    next(err);
  }
};
