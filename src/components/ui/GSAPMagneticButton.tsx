import React, { useRef, useState } from 'react';
import gsap from 'gsap';

interface GSAPMagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const GSAPMagneticButton: React.FC<GSAPMagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  icon
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flairPos, setFlairPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFlairPos({ x, y });

    // Efeito magnético suave no botão
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) * 0.15;
    const deltaY = (y - centerY) * 0.15;

    gsap.to(buttonRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)'
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const baseVariantClass = 
    variant === 'primary' 
      ? 'gsap-btn-primary' 
      : variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 text-white rounded-full px-6 py-3 font-semibold shadow-lg shadow-rose-950/40'
      : 'gsap-btn-secondary';

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseVariantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* GSAP Flair Radial Glow Effect */}
      {isHovered && variant === 'primary' && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-md opacity-30 bg-white"
          style={{
            left: `${flairPos.x}px`,
            top: `${flairPos.y}px`,
            width: '120px',
            height: '120px',
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {icon && <span className="relative z-10 flex items-center">{icon}</span>}
      <span className="relative z-10 font-bold">{children}</span>
    </button>
  );
};
