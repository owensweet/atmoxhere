import { useRouter } from 'next/navigation';

export function BackButton() {
    const router = useRouter();

    return (
        <button
        onClick={() => router.back()}
       className="absolute top-4 left-4 z-[-10] text-white border-2 px-4 py-1 rounded"
        >
        &lt;&lt;
        </button>
    )
}