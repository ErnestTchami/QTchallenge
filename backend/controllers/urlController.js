import db from "../models/index.js";
import { urlSchema } from "../validators/urlValidator.js";
const Url = db.Url;

export const createShortUrl = async (req, res) => {
  try {
    const { long_url, Servers } = req.body;

    const newUrl = await Url.create({ user_id: req.user.id, long_url });
    res.status(201).json({ message: "URL created successfully", data: newUrl });
  } catch (error) {
    if (error.name === "ZodError") {
      console.log(error.errors);
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getShortUrls = async (req, res) => {
  const urls = await Url.findAll({ where: { user_id: req.user.id } });
  res.json(urls);
};

export const getSingleShortUrl = async (req, res) => {
  const { short_code } = req.params;

  console.log(short_code);
  const url = await Url.findOne({ where: { short_code } });

  if (!url) return res.status(404).json({ error: "URL not found" });

  url.clicks++;
  await url.save();
  return res.redirect(url.long_url);
};

export const deleteShortUrl = async (req, res) => {
  const { id } = req.params;
  await Url.destroy({ where: { id, user_id: req.user.id } });
  res.json({ message: "Deleted" });
};
