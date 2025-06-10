'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import Firestore from '../lib/firebase/Firestore'
import Link from 'next/link'
import '@/styles/globals.css';



export default function ShopHome() 
{
  const collections = ["mutant", "tsiri", "termite", "z220x11", "bijou_pod_pulsers", "agora_market"];

  return (
    <div className="text-center pt-16">
      <h1 className="text-3xl flex items-center justify-center mt-0 font-extrabold py-0">ATMOXHERE SHOP</h1>
      <hr className="border-t-2 my-4 mx-auto w-3/4 py-7" />
      <div className="flex flex-col space-y-10">

        <Link
        key='all'
        href='/shop/all'
        className="text-white underline "
        >
          shop_all
        </Link>

        {collections.map((name) => (
          <Link
          key={name}
          href={`/shop/${name}`}
          className="text-white"
          >
          ⧼ {name.toLowerCase()} ⧽
          </Link>
        ))}
      </div>
    </div>
  );
}
