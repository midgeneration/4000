'use client';
import { useRef, useState } from "react";
import { CloudUpload, Trash2, Loader2 } from 'lucide-react';
import { upload } from '@imagekit/next';
import { getUploadAuth, updateDB } from '../actions/actions';
import toast, { Toaster } from 'react-hot-toast';

export default function UploadImage() {
    const [progress, setProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const abortController = new AbortController();

    const handleImageChange = () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;

        const file = fileInput.files[0];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.type)) {
            alert('Only image files are allowed.');
            fileInput.value = '';
            return;
        }

        setImagePreview(URL.createObjectURL(file));
    };

    const handleUpload = async (e: any) => {
        e.preventDefault();

        const imageTitle = e.target.imageTitle.value;
        const uploaderName = e.target.uploaderName.value;
        const fileInput = fileInputRef.current;

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        const file = fileInput.files[0];
        const { signature, expire, token, publicKey } = await getUploadAuth();

        try {
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,
            });

            const response = await updateDB(uploadResponse.url as string, imageTitle, uploaderName);

            if (response === "OK") {
                toast.success("Upload completed!");
                setIsUploading(false);
                setImagePreview(null);
                setProgress(0);
                formRef.current?.reset();
            }

        } catch (error) {
            toast.error("Upload failed. Check console.");
            console.error("Upload error:", error);
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 py-10 px-5">
            <Toaster position="top-center" />

            <div className="max-w-lg mx-auto bg-zinc-900 rounded-xl p-10 shadow-lg border border-zinc-800">
                <h2 className="text-2xl font-semibold mb-6 text-white">Upload Image</h2>

                <form ref={formRef} onSubmit={handleUpload} className="flex flex-col gap-4">
                    <div>
                        <label className="block font-medium text-sm mb-1">Uploader Name</label>
                        <input
                            name="uploaderName"
                            required
                            type="text"
                            className="w-full p-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Image Title</label>
                        <input
                            name="imageTitle"
                            required
                            type="text"
                            className="w-full p-2 bg-zinc-800 text-white rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter image title"
                        />
                    </div>

                    <div className="w-2/3">
                        <h1 className="block mb-2 font-medium">Upload Image</h1>
                        {imagePreview ? (
                            <div className="border-2 border-gray-500 rounded-lg w-full aspect-square relative">
                                <img src={imagePreview} alt="Thumbnail" className="object-contain w-full h-full rounded-md" />
                                <button type="button" onClick={() => {
                                    setImagePreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100">
                                    <Trash2 size={20} className="text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="thumbnail"
                                className="cursor-pointer border-2 border-dashed border-gray-500 w-full aspect-square flex flex-col justify-center items-center gap-2 text-gray-500 hover:border-gray-400 transition-all"
                            >
                                <CloudUpload size={32} />
                                <p className="text-sm">Upload Image</p>
                            </label>
                        )}
                        <input id="thumbnail" ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        {imagePreview && <progress value={progress} max={100} className="w-full h-2 rounded mt-2">{progress}%</progress>}
                    </div>

                    <button
                        type='submit'
                        className="w-full bg-black cursor-pointer text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                        disabled={uploading}
                    >
                        {uploading ? "Uploading...": "Upload Image"}
                        {uploading && <Loader2 size={20} className="animate-spin" />}

                    </button>
                </form>
            </div>
        </div>
    );
}
