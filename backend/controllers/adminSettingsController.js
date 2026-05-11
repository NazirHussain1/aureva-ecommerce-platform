const Settings = require("../models/Settings");

const SETTINGS_KEY = "site";

const toSettingsResponse = (settings) => ({
  id: settings.id,
  ...(settings.value || {}),
  key: settings.key,
  category: settings.category,
  isPublic: settings.isPublic,
});

const findOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: SETTINGS_KEY });

  if (!settings) {
    settings = await Settings.create({
      key: SETTINGS_KEY,
      value: {},
      category: "general",
      isPublic: true,
    });
  }

  return settings;
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await findOrCreateSettings();
    res.json(toSettingsResponse(settings));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      {
        value: req.body,
        category: "general",
        isPublic: true,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Settings updated successfully", settings: toSettingsResponse(settings) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await findOrCreateSettings();
    res.json(toSettingsResponse(settings));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};
