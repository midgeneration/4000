import { Image } from "@imagekit/next";

export default function PhotoCard({photo}:any) {

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };



  return (
    <div className="bg-zinc-900 rounded-sm overflow-hidden group relative w-full h-52 flex items-center justify-center">
      <div className="relative">
        <Image
          urlEndpoint="https://ik.imagekit.io/aqkjufnbp"
          src={photo.url}
          width={500}
          height={300} 
          alt={photo.name || "Photo"}
          transformation={[{ width: 500, height: 300, quality: 90 }]}
          loading="eager"
          className="w-full h-52 object-contain bg-black"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-1">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium text-white truncate">{photo.name}</h1>
              <h1>by {photo.uploadedBy}</h1>
            </div>
            
            <div>{formatDate(photo.uploadedAt || new Date())}</div>
            
          </div>
        </div>

      </div>
    </div>
  );
}