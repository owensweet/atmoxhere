  'use client';
  import Firestore from '@/lib/firebase/Firestore';
  import { useParams, useSearchParams } from 'next/navigation';
  import Image from 'next/image';
  import { useState, useEffect, useRef } from 'react'; 
  import '@/styles/globals.css';
  import { ShoppingCartIcon } from '@heroicons/react/24/solid';

  export default function Info() {
  const searchParams = useSearchParams();
  const params = useParams();
  const firebase = new Firestore();
  const [product, setProduct] = useState(null);

  const canceled = searchParams.get('canceled');

  // Log canceled orders
  useEffect(() => {
    if (canceled) {
      console.log('Order Canceled -- you are returned to the page, checkout when ready');
    }
  }, [canceled]);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      const data = await firebase.getProductBySlug(params.slug);
      if (data) setProduct(data);
      else console.log("No matching product found for slug:", params.slug);
    };
    fetchData();
  }, [params.slug]);

  return (
    <div>
      {product ? (
        <ProductInfo
          name={product.name}
          slug={product.slug}
          description={product.description}
          price={product.priceUSD}
          stock={product.stock}
          priceID={product.priceID}
        />
      ) : (
        <p className="text-center mt-10 text-gray-500">Loading product...</p>
      )}
    </div>
  );
}

function ProductInfo({ name, slug, description, price, stock, priceID }) {
  const [showError, setShowError] = useState(false);
  const shippingInputRef = useRef(null)

  const handleSubmit = (e) => {
    const currentCountry = localStorage.getItem("shipping_country") || '';

    if (!currentCountry) {
      e.preventDefault();
      setShowError(true);
      console.log("Form blocked: shipping_country not set");
      return;
    }

    // Update the hidden input right before submission
    if (shippingInputRef.current) {
      shippingInputRef.current.value = currentCountry;
    }

    console.log("Submitting form with shippingCountry:", currentCountry);
  };

  return (
    <div className="pt-0">
      <h1 className="text-3xl flex items-center justify-center mt-0 font-extrabold py-0">item :: data</h1>
      <img src="/images/cyber_line.png" className="w-160 mx-auto my-6 mt-3 max-w-[90%]"/>
      <div className="flex flex-col overflow-hidden w-full h-300 text-center py-0 px-10 gap-5">
        <ImageGallery slug={slug} />
        <h1 className="text-4xl">{name}</h1>
        <p className="text-center text-gray-400">{description}</p>
        <h3 className="text-xl">${price} USD</h3>

        {stock > 0 && (
          <form 
            action="/api/checkout_sessions" 
            method="POST"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="priceID" value={priceID} />
            <input type="hidden" name="shippingCountry" ref={shippingInputRef} />

            <button 
              type="submit" 
              role="link"
              className='appearance-none outline-none rounded-lg text-center bg-black w-40 mx-auto h-10 items-center flex justify-center
                        transition transform active:scale-95 duration-100 ease-in-out'
            >
              <p className='crt'>Purchase</p>
              <ShoppingCartIcon className="w-5 h-5 mx-2" />
            </button>

            {showError && (
              <p className="text-red-600 text-md mt-2 text-center">
                Select your shipping country first
              </p>
            )}
          </form>
        )}
        <p>[{stock > 0 ? "available" : "SUPPLY_LOCKED] [dropping soon"}]</p>
      </div>
    </div>
  );
}

    
    function ImageGallery({ slug }) {
      const [images, setImages] = useState([]);
      const [currentIndex, setCurrentIndex] = useState(0);

      useEffect(() => {
        let index = 1;
        let urls = [];

        const checkImages = async () => {
          while(true) {
            const url = `/images/Clothes/${slug}${index}.webp`;
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
            className="rounded border z-30"
            style={{ filter: 'drop-shadow(0 0 16px rgba(180, 140, 280, 0.2))' }}
          />
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="bg-black/40 px-4 py-2 rounded hover:bg-gray-700 text-black my-auto h-10
                        transition transform active:scale-90 duration-100 ease-in-out"
            >
              <Image
                src="/images/arrow_icon.webp"
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
              className="bg-black/40 px-4 py-2 rounded hover:bg-gray-700 text-black my-auto h-10
                        transition transform active:scale-90 duration-100 ease-in-out"
            >
              <Image
                src="/images/arrow_icon.webp"
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
    