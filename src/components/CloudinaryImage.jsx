import { AdvancedImage } from "@cloudinary/react";
import { useMemo } from "react";
import { cld } from "../utils/cloudinary";

export default function CloudinaryImage({ publicId, alt, className, fallback }) {
  const image = useMemo(() => {
    if (!publicId) return null;
    return cld.image(publicId);
  }, [publicId]);

  if (!image || !publicId) {
    return fallback ? (
      <img src={fallback} alt={alt} className={className} />
    ) : (
      <div className={className} style={{ backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  return <AdvancedImage cldImg={image} alt={alt} className={className} />;
}

