import * as trackService from "../services/track.service.js";
import MESSAGES from "../constants/messages.js";

export const track = async (req, res, next) => {
  try {
    const data = await trackService.trackEvent({
      userId: req.user.id,
      feature_name: req.body.feature_name,
    });
    res
      .status(201)
      .json({ success: true, message: MESSAGES.TRACK.SUCCESS, data });
  } catch (err) {
    next(err);
  }
};
