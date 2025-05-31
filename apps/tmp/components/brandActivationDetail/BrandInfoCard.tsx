import React from 'react';
import { PASTEL_COLORS } from '../../constants';

interface BrandInfoCardProps {
  description: string;
}

const BrandInfoCard: React.FC<BrandInfoCardProps> = ({ description }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">About this Activation</h3>
      <p className={`text-sm ${PASTEL_COLORS.textLight}`}>{description}</p>
    </div>
  );
};

export default BrandInfoCard;