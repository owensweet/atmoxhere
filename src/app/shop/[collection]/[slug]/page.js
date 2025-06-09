'use client';
import Firestore from '@/lib/firebase/Firestore';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react'; 
import { BackButton } from '../../../../lib/backButton/backbutton';


class Product {
    constructor(name, slug, descript) {

    }
}

export default function Info() {
    const params = useParams();
    const firebase = new Firestore();
    const [product, setProduct] = useState()
    
    useEffect(() => {
        const fetchData = async () => {
          const data = await firebase.getProductByName(params.slug);

          if (data) {
            setProduct(data);
          } else {
            console.log("No matching product found for slug:", params.slug);
          }
        };
    
        fetchData();
      }, [])

    return (
        <div>
    {product ? (
      <ProductInfo 
        name={product.name}
        slug={product.slug}
        description={product.description}
        price={product.priceUSD}
        stock={product.stock}
      />
    ) : (
      <p className="text-center mt-10 text-gray-500">Loading product...</p>
    )}
  </div>
    )
}

function ProductInfo({ name, slug, description, price, stock }) {
    return (
      <div className="pt-16">
        <BackButton />
        <h1 className="text-3xl flex items-center justify-center mt-0 font-extrabold py-0">ATMOXHERE SHOP</h1>
        <hr className="border-t-2 my-4 mx-auto w-3/4 py-3" />
        <div className="flex flex-col overflow-hidden w-full h-300 text-center py-0 px-5">
            <ImageGallery slug={slug} />
            <h1>{name}</h1>
            <p className="text-center text-gray-400">{description}</p>
            <h2>${price} USD</h2>
            <p>Stock: [{stock}]</p>
        </div>
      </div>
    );
  }
  
  function ImageGallery({ slug }) {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
  
    // useEffect(() => {
    //   let index = 1;
    //   let urls = [];
  
    //   const checkNext = async () => {
    //     const url = `/images/${slug}${index}.png`; // hardcoded to only read png
    //     try {
    //       const res = await fetch(url);
    //       if (res.ok) {
    //         urls.push(url);
    //         index++;
    //         checkNext(); // keep loading
    //       } else {
    //         setImages(urls);
    //       }
    //     } catch {
    //       setImages(urls);
    //     }
    //   };
  
    //   checkNext();
    // }, [slug]);

    useEffect(() => {
      let index = 1;
      let urls = [];

      const checkImages = async () => {
        while(true) {
          const url = `/images/${slug}${index}.png`;
          try {
            const res = await fetch(url);
            if (res.ok) {
              urls.push(url);
              index++;
            } else {
              break
            }
          } catch (error) {
            break;
          }

        }

        setImages(urls);

      };

      checkImages();
    }, [slug])
  
    const handlePrev = () => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };
  
    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };
  
    if (images.length === 0) return <p className="text-center h-full">Loading images...</p>;
    const str = "0".repeat(currentIndex + 1) + "o".repeat(images.length - (currentIndex) - 1);
  
    return (
      <div className="flex flex-col items-center mt-4 space-y-4">
        <Image
          src={images[currentIndex]}
          alt={`${slug} image ${currentIndex + 1}`}
          width={300}
          height={300}
          className="rounded border z-10"
        />
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-black"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-black"
          >
            Next
          </button>
        </div>
        <p className="text-l text-gray-500">
          {str}
        </p>
      </div>
    );
  }
  