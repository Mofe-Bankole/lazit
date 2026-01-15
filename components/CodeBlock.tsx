import { JetBrains_Mono } from "next/font/google";
import React from "react";

const jetbrainsMono = JetBrains_Mono({
    weight: ["400", "500", "600"],
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
});


export default function CodeBlock(text: string) {

    return (
        <pre className={`whitespace-pre overflow-x-auto text-sm ${jetbrainsMono.variable}`}>
            {text}
        </pre>
    )

}