import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  Shirt, 
  Sparkles, 
  Package, 
  Footprints,
  Briefcase
} from 'lucide-react';

export interface ProductImageWithFallbackProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  imgClassName?: string;
}

export const ProductImageWithFallback: React.FC<ProductImageWithFallbackProps> = ({
  src,
  alt,
  category = 'geral',
  className = 'w-16 h-16',
  imgClassName = 'w-full h-full object-cover rounded-xl'
}) => {
  const [hasError, setHasError] = useState<boolean>(!src);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(src));

  const normalizedCategory = (category || '').toLowerCase();
  const normalizedAlt = (alt || '').toLowerCase();

  // Determina o ícone semântico baseado na categoria e título real do produto
  const getSemanticCategoryDetails = () => {
    if (normalizedAlt.includes('óculos') || normalizedAlt.includes('oculos') || normalizedCategory.includes('óculos') || normalizedCategory.includes('oculos')) {
      return { icon: Eye, label: 'ÓCULOS', color: 'text-[#00BAE2]', bg: 'bg-[#00BAE2]/10', border: 'border-[#00BAE2]/20' };
    }
    if (normalizedAlt.includes('bota') || normalizedAlt.includes('sapatênis') || normalizedAlt.includes('sapatenis') || normalizedAlt.includes('sapato') || normalizedAlt.includes('tênis') || normalizedAlt.includes('tenis') || normalizedAlt.includes('coturno') || normalizedCategory.includes('calçado') || normalizedCategory.includes('tenis')) {
      return { icon: Footprints, label: 'CALÇADO', color: 'text-[#FF8709]', bg: 'bg-[#FF8709]/10', border: 'border-[#FF8709]/20' };
    }
    if (normalizedAlt.includes('camisa') || normalizedAlt.includes('camiseta') || normalizedAlt.includes('moletom') || normalizedAlt.includes('calça') || normalizedAlt.includes('jeans') || normalizedAlt.includes('vestuário') || normalizedAlt.includes('legging')) {
      return { icon: Shirt, label: 'VESTUÁRIO', color: 'text-[#0AE448]', bg: 'bg-[#0AE448]/10', border: 'border-[#0AE448]/20' };
    }
    if (normalizedAlt.includes('mochila') || normalizedAlt.includes('bolsa') || normalizedAlt.includes('carteira')) {
      return { icon: Briefcase, label: 'ACESSÓRIO', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    }
    if (normalizedAlt.includes('chapéu') || normalizedAlt.includes('chapeu') || normalizedAlt.includes('boné') || normalizedAlt.includes('bone')) {
      return { icon: Sparkles, label: 'CHAPELARIA', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
    }
    return { icon: ShoppingBag, label: 'PRODUTO', color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10' };
  };

  const details = getSemanticCategoryDetails();
  const IconComponent = details.icon;

  if (hasError || !src) {
    return (
      <div 
        className={`${className} rounded-xl ${details.bg} border ${details.border} flex flex-col items-center justify-center p-1 text-center shrink-0 relative overflow-hidden group shadow-2xs`}
        title={`${alt} (${details.label})`}
      >
        <IconComponent className={`w-5 h-5 ${details.color} shrink-0 mb-0.5`} />
        <span className={`text-[8px] font-mono font-black ${details.color} uppercase tracking-wider leading-none truncate max-w-full px-1`}>
          {details.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className} shrink-0 overflow-hidden rounded-xl bg-[#141716] border border-white/10`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <Package className="w-4 h-4 text-white/20 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${imgClassName} transition-all duration-300 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};
