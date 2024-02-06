/* eslint-disable react/jsx-key */
// import React from 'react'
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";



function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation])

  console.log(offerListings)

  useEffect(() => {

    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }

    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings(); 
  }, []);

  return (
    <div className="">
      {/* Top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 ">
          Realtime estate, the leading real estate marketplace.
          <br />
          We have the best accomodation in town.
        </div>
        <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline ">Let us start now</Link>
      </div>

      {/* Swipper */}

      <Swiper navigation>
          {
        offerListings && offerListings.length > 0 && offerListings.map((listing) =>(
          <SwiperSlide>
              <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}}className="h-[500px]" key={listing._id}>
              </div>
          </SwiperSlide>
        ))
      }
      </Swiper>


      {/* Listing results for offer, sale and rent */}
      <div className="max-w-8xl mx-auto p-1 flex flex-col gap-8 my-10 items-center">
        {offerListings && offerListings.length > 0 && (
          <div className="my-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-600 ">Recent Offers</h2>
              <Link className="text-sm text-blue-800 hover:underline " to={'/search?type=offer'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
               {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>

        )
        }
        {rentListings && rentListings.length > 0 && (
          <div className="my-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-600 ">Recent Places for Rent</h2>
              <Link className="text-sm text-blue-800 hover:underline " to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className="flex flex-wrap gap-4">
               {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>

        )
        }
        {saleListings && saleListings.length > 0 && (
          <div className="my-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-600 ">Recent Places for Sale</h2>
              <Link className="text-sm text-blue-800 hover:underline " to={'/search?type=sale'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
               {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )
        }
      </div>


    </div>
  );
}

export default Home;
