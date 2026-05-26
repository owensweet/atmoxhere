import MangaButton from '@/lib/components/MangaButton'

export const metadata = {
  title: 'Lore/Manga | Atmoxhere',
  description: 'The Lore of Atmoxhere'
};

export default function LorePage() {
  return (
    <section className="min-h-screen text-white py-16 px-8">
      <h1 className="text-4xl font-bold mb-4">Lore</h1>
      <p className="text-gray-300 max-w-xl leading-relaxed"></p>
      <MangaButton manga_name="termite_hunt"/>
      <MangaButton manga_name="insomnia"/>
      <MangaButton manga_name="tsiri_mutant"/>
      <MangaButton manga_name="z220x11"/>
      <MangaButton manga_name="nroot"/>
      <MangaButton manga_name="sisteralma"/>
      <MangaButton manga_name="termite_arm_flesh"/>
      <MangaButton manga_name="termite_newboard"/>
      <MangaButton manga_name="pod"/>
    </section>
  );
}