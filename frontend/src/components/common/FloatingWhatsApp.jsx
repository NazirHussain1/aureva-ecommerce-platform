import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { getPublicSettings } from '../../api/settingsApi';

export default function FloatingWhatsApp() {
  const [phone, setPhone] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getPublicSettings()
      .then((data) => {
        const phoneNumber = data.whatsappNumber || data.phone;
        if (phoneNumber) {
          setPhone(phoneNumber.replace(/\D/g, ''));
        }
      })
      .catch(() => {});
    
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (phone) {
      const message = encodeURIComponent('Hello! I have a question about your products.');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  if (!phone) return null;

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
        isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us
      </span>
    </button>
  );
}
