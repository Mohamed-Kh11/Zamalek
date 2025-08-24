import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Rectangular Custom Arrows
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-red-600 hover:bg-red-700 text-white font-bold px-1 py-4 shadow-lg rounded-r"
  >
    <ChevronLeft size={24} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-red-600 hover:bg-red-700 text-white font-bold px-1 py-4 shadow-lg rounded-l"
  >
    <ChevronRight size={24} />
  </button>
);

const Carousel = () => {
  const [news, setNews] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/news`);
        setNews(res.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, [API_BASE]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (news.length === 0) return null;

  return (
    <div className="lg:col-span-3 relative">
      <Slider {...settings}>
        {news.map((article) => (
          <div
            key={article._id}
            className="relative h-[490px] md:h-[580px] rounded-xl overflow-hidden shadow"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-end pb-5 justify-center">
              <h2 className="text-white text-xl md:text-3xl font-bold text-center px-4 z-20">
                {article.title}
              </h2>
            </div>
            <div className="absolute w-full h-[20%] md:h-[15%] bg-red-700 bottom-0 z-10"></div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
