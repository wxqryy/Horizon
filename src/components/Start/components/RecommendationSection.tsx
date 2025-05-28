'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Button from 'wxqryy/components/ui/Button';
import atom from 'wxqryy/assets/img_1_180x170.png';
import rocket from 'wxqryy/assets/img_1_255x228.png';
import team from 'wxqryy/assets/img_1_174x177.png';
import book from 'wxqryy/assets/img_1_197x185.png';
import briefcase from 'wxqryy/assets/img_1.png';
import idea from 'wxqryy/assets/img_1_228x191.png';

interface IconPosition {
  top: string;
  left?: string;
  right?: string;
  width: number;
  height: number;
  lineStartX: string;
  lineStartY: string;
  lineRotationDeg: number;
  lineLength: string;
}

const iconPositions: { [key: string]: IconPosition } = {
  atom:     { top: '-380px', left: '-380px', width: 120, height: 120,
              lineStartX: '-250px', lineStartY: '-260px', lineRotationDeg: 60, lineLength: '130px' },
  rocket:   { top: '-390px', right: '-400px', width: 120, height: 120,
              lineStartX: '260px', lineStartY: '-260px', lineRotationDeg: 120, lineLength: '130px' },
  team:     { top: '10px', left: '-700px', width: 120, height: 120,
              lineStartX: '-500px', lineStartY: '80px', lineRotationDeg: 0, lineLength: '230px' },
  book:     { top: '30px', right: '-700px', width: 120, height: 120,
              lineStartX: '500px', lineStartY: '80px', lineRotationDeg: 180, lineLength: '230px' },
  briefcase:{ top: '400px', left: '-380px', width: 120, height: 120,
              lineStartX: '-250px', lineStartY: '350px', lineRotationDeg: 300, lineLength: '180px' },
  idea:     { top: '410px', right: '-390px', width: 100, height: 120,
              lineStartX: '290px', lineStartY: '350px', lineRotationDeg: -120, lineLength: '180px' },
};

interface IconData {
  id: keyof typeof iconPositions;
  src: StaticImageData;
  alt: string;
}

const icons: IconData[] = [
  { id: 'atom', src: atom, alt: 'Атом' },
  { id: 'rocket', src: rocket, alt: 'Ракета' },
  { id: 'team', src: team, alt: 'Команда' },
  { id: 'book', src: book, alt: 'Книга' },
  { id: 'briefcase', src: briefcase, alt: 'Портфель' },
  { id: 'idea', src: idea, alt: 'Идея' },
];


const RecommendationSection: React.FC = () => {
  return (
    <section className="bg-[#2c2c2c] text-white
                       py-16 px-4
                       sm:py-20 sm:px-6
                       md:py-32
                       relative min-h-[auto]
                       md:min-h-[700px]
                       lg:min-h-[1000px]
                       overflow-hidden">
      <div className="relative flex flex-col items-center justify-center z-10
                      py-12
                      sm:py-16
                      md:h-full md:pt-56 md:pb-20">

        <div className="text-center max-w-xl md:max-w-3xl">
          <h2
            className="text-2xl leading-snug mb-6
                       sm:text-3xl sm:leading-tight sm:mb-8
                       md:text-[32px] md:leading-tight md:mb-10
                       lg:text-[40px] lg:leading-[48px]
                       font-medium font-['Unbounded']"
          >
            Готов продемонстрировать <br className="block sm:hidden"/>свои навыки и <br className="block sm:hidden"/>присоединиться к сильным?
          </h2>
          <Button
            variant="orange"
            className="rounded-xl text-base px-6 py-3
                       sm:text-lg sm:px-8 sm:py-3.5
                       md:rounded-[15px] md:text-[24px] md:px-10 md:py-4
                       lg:text-[28px] lg:px-12 lg:py-5
                       font-semibold font-['Inter']"
          >
            Подать заявку на отбор
          </Button>
        </div>

        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0">
          {icons.map((icon) => {
            const pos = iconPositions[icon.id];
            return (
              <React.Fragment key={icon.id}>
                <div
                  className="absolute"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                  }}
                >
                  <Image src={icon.src} alt={icon.alt} width={pos.width} height={pos.height} />
                </div>

                <div
                  className="absolute bg-white opacity-75"
                  style={{
                    top: `calc(20px + ${pos.lineStartY})`,
                    left: `calc(0% + ${pos.lineStartX})`,
                    width: pos.lineLength,
                    height: '3px',
                    transformOrigin: '0% 50%',
                    transform: `rotate(${pos.lineRotationDeg}deg)`,
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;