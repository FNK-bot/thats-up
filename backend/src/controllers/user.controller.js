import cloudinary from "../lib/cloudinary.config.js";
import User from "../models/user.modal.js";

import { bufferToDataURI } from "../lib/utils.js";

export const updateProfile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  try {
    const fileDataURI = bufferToDataURI(req.file);

    const uploadedResponse = await cloudinary.uploader.upload(fileDataURI, {
      folder: "profile_pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePic: uploadedResponse.secure_url,
      },
      { new: true }
    ).select("-password");

    const userObject = updatedUser.toObject();

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: userObject,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error during file processing" });
  }
};
