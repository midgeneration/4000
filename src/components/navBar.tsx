import { Upload } from "lucide-react";
import Link from "next/link";


export default function NavBar() {
    return (
        <div className="w-full bg-zinc-900 border-b border-zinc-800">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href={"/"} className="text-2xl font-bold text-white mr-10">Photo Booth</Link>
                <Link href="/upload" className="bg-transparent flex items-center text-gray-300 hover:text-white px-4 py-2 font-medium">
                    <Upload size={18} className="mr-2" />
                    UPLOAD
                </Link>
            </div>
        </div>
    )

}