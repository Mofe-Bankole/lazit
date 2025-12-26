"use client"
import Link from "next/link";

export default function Header() {

    const Xlink = "https://x.com/Mofe_bnks";


    return (
        <div className="w-full">
            <div className="w-[85%] border-2 border-amber-200 px-2 mx-auto py-2 rounded-sm justify-between flex mt-4">
                <h4>Lazerkit demo</h4>
                <p>made with ♥️ by <Link href={Xlink} className="">Mofe_bnks</Link></p>
            </div>
        </div>
    );
}   