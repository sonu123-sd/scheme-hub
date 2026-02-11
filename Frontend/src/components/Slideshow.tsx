import React, { useState, useEffect } from 'react';
import indiaGate from '@/assets/slideshow/india-gate.jpg';
import npsVatsalya from '@/assets/slideshow/nps-vatsalya.png';
import schemeHubCollage from '@/assets/slideshow/scheme-hub-collage.jpeg';
import farmerField from '@/assets/slideshow/farmer-field.png';

const slides = [
  {
    image: indiaGate,
    title: 'Scheme Hub',
    subtitle: 'Your Gateway to Government Schemes',
    description: 'Discover and apply for Central & State Government schemes',
  },
  {
    image: npsVatsalya,
    title: 'NPS Vatsalya',
    subtitle: 'Secure Your Child\'s Future',
    description: 'A new way to secure your child\'s future with minimal investment',
  },
  {
    image: schemeHubCollage,
    title: 'One-Stop Solution',
    subtitle: 'For Government Schemes',
    description: 'Find all government schemes in one place',
  },
  {
    image: farmerField,
    title: 'PM-KISAN',
    subtitle: 'Support for Farmers',
    description: 'Income support of ₹6000 per year for farmer families',
  },
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-xl animate-slide-up">
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary-foreground mb-2">
                  {slide.title}
                </h2>
                <h3 className="text-xl md:text-2xl font-heading text-primary mb-4">
                  {slide.subtitle}
                </h3>
                <p className="text-secondary-foreground/90 text-lg">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary w-8' 
                : 'bg-secondary-foreground/50 hover:bg-secondary-foreground/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
