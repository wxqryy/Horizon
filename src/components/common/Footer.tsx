'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2c2c2c] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-[40px] font-normal font-['Unbounded'] mb-6">Horizon</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div>
              <ul className="space-y-4">
                <li>
                  <Link href="/support" className="text-[20px] hover:text-gray-300">
                    Поддержка
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-[20px] hover:text-gray-300">
                    Партнеры
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-[20px] hover:text-gray-300">
                    Политика конфиденциальности
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;