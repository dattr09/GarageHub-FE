import { cld } from "./cloudinary";

export const getBackendImgURL = (imgPath, fallback = "https://via.placeholder.com/150") => {
  // Kiểm tra nếu không có imgPath hoặc là empty string
  if (!imgPath || (typeof imgPath === "string" && imgPath.trim() === "")) {
    return fallback;
  }
  
  try {
    // Nếu imgPath đã là URL đầy đủ (bắt đầu bằng http), trả về luôn
    if (typeof imgPath === "string" && (imgPath.startsWith("http://") || imgPath.startsWith("https://"))) {
      return imgPath;
    }
    
    // Tạo Cloudinary URL từ public_id
    const image = cld.image(imgPath);
    return image.toURL();
  } catch (error) {
    console.error("Error generating Cloudinary URL:", error, "imgPath:", imgPath);
    return fallback;
  }
};

export const getBackendVideoURL = (videoPath, fallback = null) => {
  if (!videoPath || (typeof videoPath === "string" && videoPath.trim() === "")) {
    return fallback;
  }
  
  try {
    if (typeof videoPath === "string" && (videoPath.startsWith("http://") || videoPath.startsWith("https://"))) {
      return videoPath;
    }
    
    const video = cld.video(videoPath);
    return video.toURL();
  } catch (error) {
    console.error("Error generating Cloudinary video URL:", error);
    return fallback;
  }
};

