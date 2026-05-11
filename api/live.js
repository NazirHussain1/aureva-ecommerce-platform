import { createHandler } from "./_lib/serverless.js";

const live = async (req, res) => {
  res.status(200).json({ status: "alive" });
};

export default createHandler({ GET: live });
