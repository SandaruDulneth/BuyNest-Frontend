import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
    {
        image: "/images/slide1.jpg",
        title: "Bringing you the best products from around the world at the best prices",
    },
    {
        image: "/images/slide2.jpg",
        title: "Fresh & Quality Everyday Essentials",
    },
    {
        image: "/images/slide3.jpg",
        title: "Unbeatable Value, Great Choices",
    },
    {
        image: "/images/slide4.jpg",
        title: "Save More, Live Better",
    },
];

const BannerSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const textVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -50,
            transition: {
                duration: 0.4,
                ease: "easeIn"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3,
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden">
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                speed={1000}
                loop
                className="w-full h-full"
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="w-full h-screen bg-cover bg-center relative flex items-center justify-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Blurred Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10" />

                            {/* Centered Content with Animation */}
                            <div className="z-20 text-white text-center px-6">
                                <AnimatePresence mode="wait">
                                    {activeIndex === index && (
                                        <>
                                            <motion.h2
                                                key={`title-${index}`}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={textVariants}
                                                className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto"
                                            >
                                                {slide.title}
                                            </motion.h2>
                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                variants={buttonVariants}
                                            >
                                                <button className="mt-6 px-6 py-2 bg-white text-green-800 font-semibold rounded-lg shadow hover:bg-green-200 transition">
                                                    Shop Now
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BannerSlider;