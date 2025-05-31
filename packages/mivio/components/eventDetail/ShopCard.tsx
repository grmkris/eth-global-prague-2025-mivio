import React from 'react';
import { Shop } from '../../types';
import { PASTEL_COLORS } from '../../constants';

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl active:scale-[0.98]">
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 rounded-full ${shop.themeColor} flex items-center justify-center text-xl mr-3 shadow-sm`}>
           {shop.iconUrl && shop.iconUrl.length > 2 ? <img src={shop.iconUrl} alt="" className="w-6 h-6"/> : shop.iconUrl }
        </div>
        <h4 className="text-md font-semibold text-slate-700 flex-1 truncate">{shop.name}</h4>
      </div>
      <div className="mb-3">
        <p className={`text-sm ${PASTEL_COLORS.textLight}`}>Top item: {shop.topItem.name}</p>
        <span className={`${PASTEL_COLORS.mint.light} ${PASTEL_COLORS.mint.text} px-2 py-0.5 rounded-md text-xs font-semibold`}>
          {shop.topItem.currency} ${shop.topItem.price.toFixed(2)}
        </span>
      </div>
      <button 
        className={`${PASTEL_COLORS.sky.button} text-white w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400`}
      >
        View Shop
      </button>
    </div>
  );
};

export default ShopCard;
