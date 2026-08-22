// src/components/home/KeyActivitiesSection.js
import React, { useState, useEffect } from 'react';
import { carouselHighlights } from '../../data/mockData';
import { ArrowLeftIcon } from '../common/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../common/icons/ArrowRightIcon';

const KeyActivitiesSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === carouselHighlights.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? carouselHighlights.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <section
            className="relative py-20 sm:py-28 bg-cover bg-center"
            style={{ backgroundImage: 'url("/images/carousel-background.jpg")' }}
        >
            <div className="absolute inset-0 bg-blue-900 opacity-60"></div>

            <div className="relative z-10 w-full max-w-2xl mx-auto mt-16 rounded-lg shadow-xl bg-gray-100/90 p-2">
                <div className="relative h-96 flex items-center justify-center p-6 sm:p-10 transition-opacity duration-700 ease-in-out opacity-100">
                    {carouselHighlights.map((item, index) => (
                        <div
                            key={item.id}
                            className={`absolute w-full h-full flex flex-col justify-center items-center ${
                                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            } transition-opacity duration-700 ease-in-out`}
                        >
                            {item.imageUrl && (
                                <div className="flex-shrink-0 mb-4">
                                    <img
                                        className="h-48 w-full object-cover rounded-md"
                                        src={item.imageUrl}
                                        alt={`Highlight: ${item.title}`}
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x200/cccccc/ffffff?text=Activity"; }}
                                    />
                                </div>
                            )}
                            <h3 className="text-2xl font-semibold text-blue-900 mb-2">{item.title}</h3>
                            <p className="mt-2 text-base text-gray-700 max-w-prose mx-auto">{item.description}</p>
                            <div className="mt-6">
                                <button onClick={() => console.log('Learn More clicked for', item.id)} className="inline-flex items-center text-base font-semibold text-blue-800 hover:text-blue-700">
                                    Learn More <ArrowRightIcon className="inline-block h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-blue-800 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4"
                    aria-label="Previous slide"
                >
                    <ArrowLeftIcon />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-blue-800 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
                    aria-label="Next slide"
                >
                    <ArrowRightIcon />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {carouselHighlights.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-3 w-3 rounded-full ${
                                index === currentIndex ? 'bg-blue-800' : 'bg-gray-400 hover:bg-gray-500'
                            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyActivitiesSection;
