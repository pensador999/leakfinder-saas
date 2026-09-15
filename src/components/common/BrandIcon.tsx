import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faBullseye, 
  faTriangleExclamation, 
  faBolt, 
  faCheck, 
  faChartLine, 
  faArrowRight, 
  faMagnifyingGlass, 
  faBuilding, 
  faPhone, 
  faStore, 
  faSliders, 
  faCircleExclamation, 
  faEye, 
  faRobot, 
  faLayerGroup,
  faWheatAwn,
  faFish,
  faFire,
  faBagShopping,
  faCreditCard,
  faClock,
  faFileLines
} from '@fortawesome/free-solid-svg-icons';
import { faMeta, faWhatsapp, faShopify, faGoogle } from '@fortawesome/free-brands-svg-icons';

export const FaIcons = {
  Shield: faShieldHalved,
  Target: faBullseye,
  Warning: faTriangleExclamation,
  Bolt: faBolt,
  Check: faCheck,
  Chart: faChartLine,
  ArrowRight: faArrowRight,
  Search: faMagnifyingGlass,
  Building: faBuilding,
  Phone: faPhone,
  Store: faStore,
  Sliders: faSliders,
  Alert: faCircleExclamation,
  Eye: faEye,
  Robot: faRobot,
  Layers: faLayerGroup,
  Wheat: faWheatAwn,
  Fish: faFish,
  Fire: faFire,
  Bag: faBagShopping,
  Card: faCreditCard,
  Clock: faClock,
  Doc: faFileLines,
  Meta: faMeta,
  WhatsApp: faWhatsapp,
  Shopify: faShopify,
  Google: faGoogle
};

interface FaIconProps {
  icon: keyof typeof FaIcons;
  className?: string;
}

export const AppIcon: React.FC<FaIconProps> = ({ icon, className = 'w-4 h-4' }) => {
  return <FontAwesomeIcon icon={FaIcons[icon]} className={className} />;
};
