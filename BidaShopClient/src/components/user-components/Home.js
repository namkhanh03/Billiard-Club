import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "tailwindcss/tailwind.css";
import styles from "./Home.module.css";

const slides = [
  {
    image: "https://n-one.vn/wp-content/uploads/2023/09/354260616_796374308518261_6402349048964068737_n.jpg",
    subtitle: "Câu lạc bộ Bida",
    link: "#",
  },
  {
    image: "https://n-one.vn/wp-content/uploads/2023/09/354985182_796374201851605_3031969531632891763_n.jpg",
    subtitle: "Chơi Bida chuyên nghiệp",
    link: "#",
  },
  {
    image: "https://n-one.vn/wp-content/uploads/2023/09/354185324_796374511851574_8805141767854574616_n.jpg",
    subtitle: "Kỹ năng nâng cao",
    link: "#",
  },
  {
    image: "https://n-one.vn/wp-content/uploads/2023/09/354237548_796374121851613_1628615432289183606_n-1.jpg",
    subtitle: "Cộng đồng đam mê Bida",
    link: "#",
  },
];

function Home() {
  return (
    <div style={{ backgroundColor: "rgba(36, 34, 34, 0.5)", minHeight: "100vh" }}>
      {/* Hero Section Begin */}
      <section>
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          autoplay={{ delay: 5000 }}
          speed={2000}
          className="w-full h-full custom-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={`relative ${styles['hs-item']}`}>
              <img
                className="object-cover w-full h-full"
                src={slide.image}
                alt="BidaClub"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={styles['hi-text']}>
                  <span>{slide.subtitle}</span>
                  <h1>
                    Khám phá <strong>BidaClub</strong> <br />
                    Chơi và phát triển kỹ năng
                  </h1>
                  {/* <a
                    href="#"
                    className={styles['primary-btn']}
                    onClick={handleSurveyOpen}
                  >
                    Tham gia ngay
                  </a> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* Hero Section End */}
    </div>
  );
}

export default Home;
