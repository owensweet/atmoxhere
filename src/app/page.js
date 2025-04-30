'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import Firestore from '../lib/firebase/Firestore'



export default function Shop() {
  const [products, setProducts] = useState([]);
  const firestore = new Firestore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await firestore.getAllProducts();
      setProducts(data);
    };

    fetchData();
  }, [])

  return (
    <div>
      <h1 className="text-3xl flex items-center justify-center">ATMOXHERE SHOP</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-10">
        {products.map(product => (
          <Card
            key={product.id}
            name={product.name}
            slug={product.slug}
            desc={product.description}
            price={product.price}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ name, slug, desc, price, stock }) {

  return (
    <div className="rounded overflow-hidden shadow-md bg-green-700">
      <div className="relative w-full h-64">
        <Image
          src={`/images/${slug}1.jpg`}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
      <h1>$${price}$$</h1>
      <h1>Stock: {stock}</h1>
    </div>
  )
}
