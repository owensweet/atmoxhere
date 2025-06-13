import { useRouter } from 'next/navigation';

export function BackButton() {
    const router = useRouter();

    return (
        <button
        onClick={() => {router.back();
            console.log("clicked");}}
       className="absolute top-4 left-4 z-[1] text-white border-2 py-1 rounded w-11 text-center"
        >
        &lt;&lt;
        </button>
    )
}