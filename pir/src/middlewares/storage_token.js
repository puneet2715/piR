import * as express from "express";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const storage_token_middleware = (req, res, next) => {
  if (req.path === "/create_new_storage") {
    return next();
  }

  /** @type {string | undefined} */
  const storage_token = req.cookies.storage_token;

  if (!storage_token) {
    return res
      .status(401)
      .json({ status: "error", message: "Storage token not available" });
  }

  req.storage_token = storage_token;

  return next();
};
