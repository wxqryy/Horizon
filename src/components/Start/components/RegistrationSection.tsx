'use client';

import React from 'react';
import Card from 'wxqryy/components/common/Card';

const RegistrationSection: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 md:py-8 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-3xl leading-snug mb-4
                     sm:text-4xl sm:leading-tight sm:mb-6
                     md:text-[64px] md:leading-[64px] md:mb-8
                     font-medium font-['Unbounded'] text-[#2c2c2c]"
        >
          Отбор и регистрация
        </h2>
        
        <p 
          className="text-lg leading-relaxed mb-8
                     sm:text-xl sm:leading-relaxed sm:mb-10
                     md:text-[36px] md:leading-[36px] md:mb-12
                     font-medium font-['Raleway'] text-[#2c2c2c]"
        >
          Мы строим сообщество, основанное на высокой мотивации и готовности к развитию. Отбор помогает нам собрать именно таких людей, создавая максимально эффективную среду для каждого участника.
        </p>
        
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-8">
          <Card 
            variant="green" 
            className="flex-1 md:rounded-[30px] rounded-2xl"
          >
            <h3 
              className="text-2xl leading-tight mb-6
                         sm:text-3xl sm:mb-8
                         md:text-[40px] md:leading-[47px] md:mb-12
                         font-bold font-['Raleway'] text-[#2c2c2c] text-center"
            >
              Быстрый трек
            </h3>
            
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {[
                {
                  title: "Для кого",
                  text: "Этот путь подойдет для старшеклассников и студентов с выдающимися достижениями в учёбё, олимпиадах, проектах или конкурсах, соответсвующих нашему перечню"
                },
                {
                  title: "Что нужно сделать",
                  text: "Подать заявку, выбрав «Быстрый трек», и загрузить подтверждающие документы (дипломы, сертификаты, ссылки на проекты)"
                },
                {
                  title: "Критерии",
                  text: "Твои достижения будут оценены на соответствие нашим критериям"
                },
                {
                  title: "Что дальше",
                  text: "Мы быстро проверим твою заявку и уведомим о результатах"
                }
              ].map((item, index) => (
                <p 
                  key={index}
                  className="text-sm leading-relaxed
                             sm:text-base sm:leading-relaxed
                             md:text-[32px] md:leading-[32px]
                             font-medium font-['Raleway'] text-[#2c2c2c]"
                >
                  <span className="font-bold">{item.title}</span>: {item.text}
                </p>
              ))}
            </div>
          </Card>
          
          <Card 
            variant="red" 
            className="flex-1 text-white md:rounded-[30px] rounded-2xl"
          >
            <h3 
              className="text-2xl leading-tight mb-6 sm:text-3xl sm:mb-8 md:text-[40px] md:leading-[47px] md:mb-12 font-bold font-['Raleway'] text-center"
            >
              Стандартный трек
            </h3>
            
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {[
                {
                  title: "Для кого",
                  text: "Этот путь открыт для всех мотивированных старшеклассников и студжентов, готовых продемонстрировать свои навыки"
                },
                {
                  title: "Что нужно сделать",
                  text: "Подать заявку, выбрав «Стандартный трек», и получить доступ к решению кейса от компании-партнера или специальному заданию, сгенерированным нашим ИИ"
                },
                {
                  title: "Критерии",
                  text: "Оценивается твой подход к решению задачи, логика рассуждений и глубина прорабротки"
                },
                {
                  title: "Что дальше",
                  text: "Загрузи свое решение в указанный срок. Мы рассмотрим его и сообщим о результатх отбора"
                }
              ].map((item, index) => (
                <p 
                  key={index}
                  className="text-sm leading-relaxed sm:text-base sm:leading-relaxed md:text-[32px] md:leading-[32px] font-medium font-['Raleway']"
                >
                  <span className="font-bold">{item.title}</span>: {item.text}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;