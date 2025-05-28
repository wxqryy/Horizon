'use client';

import React from 'react';
import Button from 'wxqryy/components/ui/Button';

interface HeroSectionProps {
  title: string;
  subtitle:string;
  ctaText: string;
  stats?: {
    value: string;
    label: string;
  }[];
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  stats,
  className = ''
}) => {
  return (
    <section className={`relative ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            className="text-2xl leading-snug
                       xs:text-3xl xs:leading-tight  
                       sm:text-4xl sm:leading-tight  
                       md:text-5xl                   
                       lg:text-[70px] font-['Unbounded'] lg:leading-[77px] text-[#2c2c2c] mb-4 md:mb-6 lg:mb-8"
          >
            {title}
          </h1>
          <p 
            className="text-base leading-normal
                       xs:text-lg xs:leading-relaxed
                       sm:text-xl 
                       md:text-2xl 
                       lg:text-[36px] font-['Raleway'] lg:leading-[42px] text-[#2c2c2c] mb-6 md:mb-8 lg:mb-12" 
          >
            {subtitle}
          </p>

          <Button 
            variant="green" 
            className="rounded-xl text-sm px-12 py-4.5 mb-8
                       xs:text-base xs:px-6 xs:py-3
                       sm:text-lg sm:px-8 sm:py-4 
                       md:rounded-[15px] md:text-xl 
                       lg:text-[29px] lg:px-10 lg:py-5 lg:mb-16
                       font-['Inter']"
          >
            {ctaText}
          </Button>

          {stats && (

            <div className="flex flex-row justify-center items-start space-x-3 
                            xs:space-x-4
                            sm:space-x-6 
                            md:space-x-8 
                            lg:space-x-12">
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  {}
                  {index > 0 && (
                    <div className="h-16 w-[1px] bg-[#c7c7c7] 
                                    sm:h-20 
                                    md:w-[2px] md:bg-[#a4a4a4] 
                                    lg:h-[116px]"></div>
                  )}
                  <div className="text-center flex-1 min-w-0"> {}
                    <p 
                      className="text-lg font-bold leading-tight 
                                 xs:text-xl
                                 sm:text-2xl 
                                 md:text-3xl 
                                 lg:text-[35px] lg:leading-[43px]
                                 font-['Inter'] text-[#2c2c2c] whitespace-nowrap"
                    >
                      {stat.value}
                    </p>
                    <p 
                      className="text-xs leading-tight mt-1 
                                 xs:text-sm
                                 sm:text-base sm:leading-snug
                                 md:text-xl 
                                 lg:text-[26px] lg:leading-[26px] lg:mt-4
                                 font-normal text-[#2c2c2c]"
                    >
                      {stat.label}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;