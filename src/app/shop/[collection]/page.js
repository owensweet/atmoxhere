'use client';

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import Firestore from '@/lib/firebase/Firestore'
import { BackButton } from '@/lib/backButton/backbutton';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import '@/styles/globals.css';



export default function CollectionPage() {

  const params = useParams();
  const [products, setProducts] = useState([]);
  const firestore = new Firestore();
  const [loading, setLoading] = useState(true);
  

  const charLength = 12000;
  const [chars, setChars] = useState('');
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        let collection = params.collection
        if (collection == 'all') {
          data = await firestore.getAllProducts();
        } else {
          data = await firestore.getProductsByCollection(collection)
        }
        data.sort((a, b) => b.stock - a.stock)
        setProducts(data);
      } catch (err) {
        console.log("Error getting products from firestore")
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [params.collection])

  // For matrix effect
  useEffect(() => {
    const generateChars = () => {
      let result = '';
      for (let i = 0; i < charLength; i++)
      {
        result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      return result;
    };

    setChars(generateChars());

    const interval = setInterval(() => {
      setChars(generateChars());
    }, 150);

    return () => clearInterval(interval);

  }, []);



  return (
    <div className="pt-0">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="w-full h-full text-teal-700 opacity-38 text-m leading-tight break-all whitespace-pre-wrap p-2">
          {chars}
        </div>
      </div>
      <BackButton />
      <h1 className="text-4xl flex items-center justify-center mt-0 font-extrabold py-0">{ params.collection }</h1>
      <hr className="border-t-2 my-4 mx-auto w-3/4 py-7" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-8">
        {products.map(product => (
            <Card
              key={product.id}
              name={product.name}
              slug={product.slug}
              desc={product.description}
              price={product.priceUSD}
              stock={product.stock}
            />
          ))}
      </div>
    </div>
  );
}

export function Card({ name, slug, desc, price, stock }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop/all/${slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative max-w-[380px] min-h-[100px] w-full h-full mx-auto rounded p-5 overflow-hidden shadow-md"
    >
      {/* BORDER IMAGE - slightly scaled taller on Y axis */}
      <Image
        src="/images/Borders/border2 thin fadde.webp"
        alt="Border"
        fill
        className="pointer-events-none z-5"
        style={{ transform: 'scale(1.05, 1.05)' }}
        loading="eager"
      />

      {/* CARD IMAGE */}
      <div className="aspect-square relative w-full rounded-lg overflow-hidden z-4 translate-y-[10px] mix-blend-normal">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" />
        <Image
          src={`/images/${slug}1.webp`}
          alt={name}
          className="object-cover rounded-t pointer-events-none scale-[0.9] z-10"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          style={{ filter: 'drop-shadow(0 0 15px rgba(180, 140, 280, 0.4))' }}
        />
      </div>

      {/* TEXT */}
      <div className="p-4 py-6 pt-2 text-white bg-black relative z-0">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-md">{stock > 0 ? `$${price}` : '???'}</p>
        <p className="text-xs">[{stock > 0 ? 'available' : 'SUPPLY_LOCKED'}]</p>
      </div>
    </div>
  );
}