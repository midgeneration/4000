"use server";
import { getUploadAuthParams } from '@imagekit/next/server';
import { redis } from "@/lib/redis";


export async function getUploadAuth(){
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  })

  return ({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string})

}




export async function updateDB( url: string, name: string, uploadedBy: string){

  const photoId = await redis.incr("photo_id");

  const photo = {
    id: photoId,
    url,
    name,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  };

  const response = await redis.set(`photo:${photoId}`, JSON.stringify(photo));

  return response;

}
