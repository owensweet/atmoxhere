'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import Firestore from '../lib/firebase/Firestore'
import Link from 'next/link'
import '../../public/styles/globals.css';



export default function ShopHome() 
{
  const collections = ["defiant", "termite", "Z220X11", "pod_pulsers", "bijou"];

  return (
    <div className="text-center">
      <div className="scanlines"></div>
      <h1 className="text-3xl flex items-center justify-center mt-15 font-extrabold py-0">ATMOXHERE SHOP</h1>
      <div className="scanlines2"></div>
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
