'use client';

import React from 'react';
import Image from 'next/image';
import HeroSection from 'wxqryy/components/common/HeroSection';
import cupAsset from 'wxqryy/assets/img_1_210x209.png';
import graphAsset from 'wxqryy/assets/img_2.png';
import puzzleAsset from 'wxqryy/assets/img_1_200x229.png';
import speakerAsset from 'wxqryy/assets/img_1_208x190.png';

const HomeHeroSection: React.FC = () => {
  const stats = [
    { value: '4500+', label: 'Студентов и школьников' },
    { value: '420+', label: 'Проектов в поиске команды' },
    { value: '230+', label: 'Актуальных возможностей' }
  ];

  const puzzleDims = { width: 200, height: 229 };
  const graphDims = { width: 262, height: 289 };
  const speakerDims = { width: 208, height: 190 };
  const cupDims = { width: 210, height: 209 };

  return (
    <div className="relative overflow-hidden">

      {}
      <div className="absolute top-6 left-24 w-17 h-auto
                      sm:w-12 sm:top-10 sm:left-4
                      md:top-[25px] md:left-[calc(50%-600px)] lg:left-[calc(50%-650px)] xl:left-[406px] md:w-[200px] z-10">
        <Image src={puzzleAsset} alt="Декорация Пазл/Рупор" layout="responsive" width={puzzleDims.width} height={puzzleDims.height} />
      </div>

      {}
      <div className="absolute top-18 right-4 w-18 h-auto
                      sm:w-12 sm:top-10 sm:right-4
                      md:top-[25px] md:right-[calc(50%-600px)] lg:right-[calc(50%-650px)] xl:right-[400px] md:w-[262px] z-10">
        <Image src={graphAsset} alt="Декорация График" layout="responsive" width={graphDims.width} height={graphDims.height} />
      </div>

      {}
      <div className="absolute top-17 left-3 w-14 h-auto
                      sm:w-10 sm:top-32 sm:left-2
                      md:top-[312px] md:left-[calc(50%-700px)] lg:left-[calc(50%-750px)] xl:left-[112px] md:w-[208px] z-10">
        <Image src={speakerAsset} alt="Декорация Спикер/Мишень" layout="responsive" width={speakerDims.width} height={speakerDims.height} />
      </div>

      {}
      <div className="absolute top-5 right-28 w-15 h-auto
                      sm:w-10 sm:top-32 sm:right-2
                      md:top-[312px] md:right-[calc(50%-700px)] lg:right-[calc(50%-750px)] xl:right-[107px] md:w-[210px] z-10">
        <Image src={cupAsset} alt="Декорация Кубок" layout="responsive" width={cupDims.width} height={cupDims.height} />
      </div>

      <HeroSection
        title="СООБЩЕСТВО АМБИЦИОЗНЫХ - ТВОЙ СТАРТ В ПРОФЕССИЮ"
        subtitle="Общайся, учись и реализуй себя в сообществе мотивированных. Проекты, стажировки и реальные возможности для твоего роста"
        ctaText="Подать заявку на отбор"
        stats={stats}
        className="relative z-20 pt-24 pb-12 sm:pt-28 md:pt-40 md:pb-16" 
      />
    </div>
  );
};

export default HomeHeroSection;