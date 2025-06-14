'use client';
import Firestore from '@/lib/firebase/Firestore';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react'; 
import { BackButton } from '@/lib/backButton/backbutton';
import '@/styles/globals.css'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'


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
      <div className="pt-0">
        <BackButton />
        <h1 className="text-3xl flex items-center justify-center mt-0 font-extrabold py-0">ATMOXHERE SHOP</h1>
        <hr className="border-t-2 my-4 mx-auto w-3/4 py-3" />
        <div className="flex flex-col overflow-hidden w-full h-300 text-center py-0 px-10 gap-5">
            <ImageGallery slug={slug} />
            <h1 className="text-4xl">{name}</h1>
            <p className="text-center text-gray-400">{description}</p>
            <h3 className="text-xl">${price} USD</h3>
            <div className="rounded-lg text-center bg-black w-40 mx-auto h-10 items-center flex justify-center">
              Purchase <ShoppingCartIcon className="w-5 h-5 mx-2" /></div>
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
    const str = "_ ".repeat(currentIndex) + (currentIndex + 1) + " ".repeat(currentIndex + 1) + "_ ".repeat(images.length - (currentIndex) - 1); // first letter was '0 ' but now its a number and i kind of like it 
  
    return (
      <div className="flex flex-col items-center mt-4 space-y-4">
        <Image
          src={images[currentIndex]}
          alt={`${slug} image ${currentIndex + 1}`}
          width={300}
          height={300}
          className="rounded border z-10"
          style={{ filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 1))' }}
        />
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            className="bg-black/40 px-4 py-2 rounded hover:bg-gray-300 text-black my-auto h-10"
          >
            <Image
              src="/images/arrow_icon.png"
              alt="Previous"
              width={24}
              height={24}
              className="transform -scale-x-100 invert drop-black"
            />
          </button>
          <p className="text-xl text-gray-500">
            {str}
          </p>
          <button
            onClick={handleNext}
            className="bg-black/40 px-4 py-2 rounded hover:bg-gray-300 text-black my-auto h-10"
          >
            <Image
              src="/images/arrow_icon.png"
              alt="Previous"
              width={24}
              height={24}
              className="invert"
            />
          </button>
        </div>
      </div>
    );
  }
  