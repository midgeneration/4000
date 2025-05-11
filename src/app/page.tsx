import { redis } from "@/lib/redis";
import PhotoCard from "@/components/photoCard";

export default async function Home() {
  const keys = await redis.keys("photo:*");

  if (!keys || keys.length === 0) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <p>No photos found.</p>
      </div>
    );
  }

  const photoDataArray = await redis.mget(keys);

  const validPhotos = photoDataArray.filter((photo) => photo);

  if (validPhotos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <p>Photos could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {validPhotos.map((photo, index) => (
            <PhotoCard key={index} photo={photo} />
          ))}
        </div>
      </div>
    </div>
  );
}
