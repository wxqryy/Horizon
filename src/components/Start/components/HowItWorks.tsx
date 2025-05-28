'use client';

import React from 'react';
import Image from 'next/image';
import awardAsset from 'wxqryy/assets/img_rectangle.png'; 
import puzzleAsset from 'wxqryy/assets/img_1_220x229.png';
import starsAsset from 'wxqryy/assets/img_1_316x187.png';
import arrow12Asset from 'wxqryy/assets/img_1_114x232.png';
import arrow23Asset from 'wxqryy/assets/img_2_124x253.png';

const awardDims = { width: 230, height: 185 };
const puzzleDims = { width: 220, height: 229 };
const starsDims = { width: 230, height: 185 };
const arrow12Dims = { width: 160, height: 200 };
const arrow23Dims = { width: 160, height: 200 };

const HowItWorks: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 md:py-8 md:px-6"> {}
      <h2 
        className="text-3xl leading-snug mb-10
                   sm:text-4xl sm:leading-tight sm:mb-12       

                   md:text-[50px] md:md:text-[64px] 
                   md:font-medium md:font-['Unbounded'] 
                   md:leading-tight md:md:leading-[80px] 
                   md:text-center md:text-[#2c2c2c] 
                   md:mb-16 md:sm:mb-20 md:md:mb-24
                   font-medium font-['Unbounded'] text-center text-[#2c2c2c] 
                   md:text-[50px] md:leading-tight md:mb-16 
                   lg:text-[64px] lg:leading-[80px]        ">
      </h2>
      {}
      <div 
        className="mb-10 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24" 
        style={{marginTop: "-2.5rem", marginBottom: "2.5rem"}} 
      > 
      {}
      </div>
      <h2 
        className="text-3xl leading-snug mb-10
                   sm:text-4xl sm:leading-tight sm:mb-12       
                   md:text-[50px] md:leading-tight md:mb-16   
                   lg:text-[64px] lg:leading-[80px] lg:mb-24  
                   font-medium font-['Unbounded'] text-center text-[#2c2c2c]"
      >
          Как это работает?
      </h2>

      <div className="max-w-7xl mx-auto relative">
        {}
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start">

          {}
          {}
          <div className="flex flex-col items-center text-center w-full max-w-xs mx-auto mb-10 md:w-auto md:max-w-[340px] md:mb-0 z-10 md:mt-[250px]">
            <h3 
              className="text-2xl leading-tight mb-3
                         sm:text-3xl sm:mb-3                   

                         md:text-[40px] md:leading-tight md:mb-4 
                         lg:text-[48px] lg:leading-[57px]     
                         font-semibold font-['Raleway'] text-[#2c2c2c]"
            > Шаг 1 </h3>
            <p 
              className="text-base leading-relaxed mb-6
                         sm:text-lg sm:mb-6                    

                         md:text-[24px] md:leading-[1.4] md:mb-8 
                         lg:text-[28px] lg:leading-[36px]     
                         font-medium font-['Raleway'] text-center text-[#2c2c2c]"
            > Создай свой профиль, расскажи о навыках и достижениях </p>
            <div className="relative w-40 h-auto mt-auto sm:w-48 md:w-auto md:mt-4"> {}
              <Image src={awardAsset} alt="Step 1" width={awardDims.width} height={awardDims.height} />
            </div>
          </div>

          {}
          <div className="flex flex-col items-center text-center w-full max-w-xs mx-auto mb-10 md:w-auto md:max-w-[390px] md:mb-0 z-10">
            <h3 className="text-2xl leading-tight mb-3 sm:text-3xl sm:mb-3 md:text-[40px] md:leading-tight md:mb-4 lg:text-[48px] lg:leading-[57px] font-semibold font-['Raleway'] text-[#2c2c2c]">Шаг 2</h3>
            <p className="text-base leading-relaxed mb-6 sm:text-lg sm:mb-6 md:text-[24px] md:leading-[1.4] md:mb-8 lg:text-[28px] lg:leading-[36px] font-medium font-['Raleway'] text-center text-[#2c2c2c]">Заполни информацию о своих навыках, проектах и опыте. Используй ИИ-помощника, чтобы быстро оформить профессиональное резюме</p>
            <div className="relative w-40 h-auto mt-auto sm:w-48 md:w-auto md:mt-4">
              <Image src={puzzleAsset} alt="Step 2" width={puzzleDims.width} height={puzzleDims.height} />
            </div>
          </div>

          {}
          <div className="flex flex-col items-center text-center w-full max-w-xs mx-auto md:w-auto md:max-w-[340px] z-10 md:mt-[250px]">
            <h3 className="text-2xl leading-tight mb-3 sm:text-3xl sm:mb-3 md:text-[40px] md:leading-tight md:mb-4 lg:text-[48px] lg:leading-[57px] font-semibold font-['Raleway'] text-[#2c2c2c]">Шаг 3</h3>
            <p className="text-base leading-relaxed mb-6 sm:text-lg sm:mb-6 md:text-[24px] md:leading-[1.4] md:mb-8 lg:text-[28px] lg:leading-[36px] font-medium font-['Raleway'] text-center text-[#2c2c2c]">Участвуй в проектах, ищи стажировки, посещай мероприятия, читай полезные статьи и общайся с единомышленниками для своего роста</p>
            <div className="relative w-40 h-auto mt-auto sm:w-48 md:w-auto md:mt-4">
              <Image src={starsAsset} alt="Step 3" width={starsDims.width} height={starsDims.height}/>
            </div>
          </div>
        </div>

        {}
        <div className="hidden md:block absolute top-[210px] left-[calc(33.33%-90px)] xl:left-[calc(33.33%-150px)] z-0 pointer-events-none">
          <Image src={arrow12Asset} alt="Arrow path from Step 1 to Step 2" width={arrow12Dims.width} height={arrow12Dims.height} />
        </div>
        <div className="hidden md:block absolute top-[210px] left-[calc(66.66%-62px)] xl:left-[calc(66.66%-18px)] z-0 pointer-events-none">
          <Image src={arrow23Asset} alt="Arrow path from Step 2 to Step 3" width={arrow23Dims.width} height={arrow23Dims.height} />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;