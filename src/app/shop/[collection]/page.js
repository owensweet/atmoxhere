'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import Firestore from '../../../lib/firebase/Firestore'
import { BackButton } from '../../../lib/backButton/backbutton';



export default function CollectionPage({ params }) {
  const [products, setProducts] = useState([]);
  const firestore = new Firestore();

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



  return (
    <div>
      <BackButton />
      <h1 className="text-3xl flex items-center justify-center mt-15 font-extrabold py-0">{ params.collection }</h1>
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

  const handleClick = () => {
    console.log('clicked');
  }

  return (
    <div onClick={handleClick} className="rounded overflow-hidden shadow-md border-2 max-w-[300px] w-full mx-auto">
      <div className="aspect-square relative w-full">
        <Image
          src={`/images/${slug}1.jpg`}
          alt={name}
          fill
          className="object-cover rounded-t"
        />
      </div>
      <div className="p-4 text-white">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-md">${price}</p>
        <p className="text-xs">stock: [{stock}]</p>
      </div>
    </div>

    
  );
}
