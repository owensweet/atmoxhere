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

  const charLength = 10000;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-10">
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

function Card({ name, slug, desc, price, stock }) {

  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop/all/${slug}`)
  }

  return (
    <div onClick={handleClick} className="rounded overflow-hidden shadow-md border-2 max-w-[300px] w-full mx-auto">
      <div className="aspect-square relative w-full rounded-lg overflow-hidden">
    
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs z-10" />
      <Image
        src={`/images/${slug}1.png`}
        alt={name}
        fill
        className="object-cover rounded-t z-10 pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 1))' }}
      />
      </div>
      <div className="p-4 text-white bg-black">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-md">${price}</p>
        <p className="text-xs">stock: [{stock}]</p>
      </div>
    </div>

    
  );
}
