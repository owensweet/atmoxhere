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

  const charLength = 12000;
  const [chars, setChars] = useState('');
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ'

  useEffect(() => {
    const fetchData = async () => {
      const data = await firestore.getAllProducts();
      setProducts(data);
    };

    fetchData();
  }, [])

  let filtered = [];

  if (params.collection === 'all')
  {
    filtered = products
  } else
  {
    filtered = products.filter((product) => product.collection === params.collection)
  }

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
        {filtered.map(product => (
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
      className="relative max-w-[380px] min-h-[420px] w-full mx-auto rounded p-5 overflow-hidden shadow-md"
    >
      {/* BORDER IMAGE - slightly scaled taller on Y axis */}
      <Image
        src="/images/Borders/border2 thin fadde.png"
        alt="Border"
        fill
        className="pointer-events-none z-11 crt"
        style={{ transform: 'scale(1.05, 1.05)' }}
      />

      {/* CARD IMAGE */}
      <div className="aspect-square relative w-full rounded-lg overflow-hidden z-10">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" />
        <Image
          src={`/images/${slug}1.png`}
          alt={name}
          fill
          className="object-cover rounded-t pointer-events-none scale-[0.9]"
          style={{ filter: 'drop-shadow(0 0 15px rgba(180, 140, 280, 0.4))' }}
        />
      </div>

      {/* TEXT */}
      <div className="p-4 text-white bg-black relative z-0">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-md">{stock > 0 ? `$${price}` : '???'}</p>
        <p className="text-xs">[{stock > 0 ? 'available' : 'SUPPLY_LOCKED'}]</p>
      </div>
    </div>
  );
}