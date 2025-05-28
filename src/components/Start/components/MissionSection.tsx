'use client';

import React from 'react';
import Image from 'next/image';
import humanAsset from 'wxqryy/assets/img_1_512x234.png';

const humanAssetDims = { width: 512, height: 234 };

const MissionSection: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:py-12 sm:px-6 md:py-8 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-x-8 lg:gap-x-12">
          
          <div className="flex-1 mb-8 md:mb-0">
            <h2 
              className="text-3xl leading-snug mb-4           
                         sm:text-3xl sm:leading-tight sm:mb-6 
                         md:text-[50px] md:leading-tight md:mb-10
                         lg:text-[64px] lg:leading-[64px] lg:mb-12
                         font-medium font-['Unbounded'] text-[#2c2c2c]"
            >
              Наша миссия и ценности
            </h2>
            
            <div className="max-w-[712px]"> 
              <p 
                className="text-base leading-relaxed 
                           sm:text-lg sm:leading-relaxed
                           md:text-[30px] md:leading-snug  
                           lg:text-[35px] lg:leading-[42px] 
                           font-medium font-['Raleway'] text-[#2c2c2c]"
              >
                Учеба дает знания, но часто не хватает практики, реальных проектов и связей в профессиональной среде. Хочется общаться с теми, кто так же увлечен развитием и готов действовать?
                <br /><br />
                Наше сообщество – это среда, созданная специально для мотивированных старшеклассников и студентов, готовых брать максимум от своего потенциала и строить будущее уже сейчас
              </p>
            </div>
          </div>
          
          <div className="hidden md:block w-full md:w-auto md:flex-shrink-0 order-first md:order-last"> 
            <Image 
              src={humanAsset}
              alt="Наша миссия" 
              layout="responsive"
              width={humanAssetDims.width}
              height={humanAssetDims.height}
              className="w-full h-auto max-w-xs mx-auto 
                         sm:max-w-sm 
                         md:max-w-[300px] md:mx-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;