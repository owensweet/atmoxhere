import { Html, useProgress } from '@react-three/drei'

export default function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center text-white">
                <div className="w-10 h-10 border-6 border-t-transparent border-white rounded-full animate-spin"></div>
                <p className="mt-2 text-sm"> loading...</p>
            </div>
        </Html>
    );
}