import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import axios from '../../api/axios';
import { getPublicSettings } from '../../api/settingsApi';

const shopLinks = [
  { label: 'All products', to: '/products' },
  { label: 'Skincare', to: '/products?category=skincare' },
  { label: 'Makeup', to: '/products?category=makeup' },
  { label: 'Haircare', to: '/products?category=haircare' },
  { label: 'Fragrance', to: '/products?category=fragrance' },
  { label: 'Wellness', to: '/products?category=wellness' },
];

const serviceLinks = [
  { label: 'Track order', to: '/orders' },
  { label: 'My account', to: '/profile' },
  { label: 'Shipping info', to: '/shipping' },
  { label: 'Returns', to: '/returns' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

const fallbackSocials = [
  { label: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
  { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
  { label: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
  { label: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
  { label: 'Pinterest', href: 'https://pinterest.com', icon: FaPinterestP },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings();
        setSettings(data);
      } catch {
        setSettings(null);
      }
    };

    fetchSettings();
  }, []);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setSubscribing(true);
      await axios.post('/newsletter/subscribe', { email: email.trim() });
      toast.success('You are subscribed to the Aureva edit.');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const socialLinks = [
    settings?.facebookUrl && { label: 'Facebook', href: settings.facebookUrl, icon: FaFacebookF },
    settings?.instagramUrl && { label: 'Instagram', href: settings.instagramUrl, icon: FaInstagram },
    settings?.twitterUrl && { label: 'Twitter', href: settings.twitterUrl, icon: FaTwitter },
    settings?.youtubeUrl && { label: 'YouTube', href: settings.youtubeUrl, icon: FaYoutube },
    settings?.whatsappUrl && { label: 'WhatsApp', href: settings.whatsappUrl, icon: FaWhatsapp },
  ].filter(Boolean);

  const visibleSocials = socialLinks.length ? socialLinks : fallbackSocials;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
      <div className="container-custom py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1.15fr]">
          <section>
            <Link to="/" className="inline-flex items-baseline gap-3 text-white">
              <span className="font-serif text-3xl font-semibold leading-none">A</span>
              <span className="text-2xl font-semibold">Aureva</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
              Premium beauty essentials curated for skincare, makeup, fragrance,
              haircare, and everyday personal care.
            </p>

            <div className="mt-6 space-y-3">
              <ContactRow icon={FiMail} href={`mailto:${settings?.contactEmail || 'support@aureva.com'}`}>
                {settings?.contactEmail || 'support@aureva.com'}
              </ContactRow>
              <ContactRow icon={FiPhone} href={`tel:${settings?.phone || '+15551234567'}`}>
                {settings?.phone || '+1 (555) 123-4567'}
              </ContactRow>
              <ContactRow icon={FiMapPin}>
                {settings?.address || '123 Beauty Avenue, New York, NY 10001'}
              </ContactRow>
            </div>
          </section>

          <FooterLinks title="Shop" links={shopLinks} />
          <FooterLinks title="Support" links={serviceLinks} />

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-normal text-white">The Aureva edit</h3>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              New launches, restocks, and care notes worth opening.
            </p>

            <form onSubmit={handleNewsletterSubscribe} className="mt-5">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="min-w-0 flex-1 rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-rose-300 focus:ring-4 focus:ring-white/10"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-plum-900 transition hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Subscribe"
                >
                  {subscribing ? <BiLoaderAlt className="h-5 w-5 animate-spin" /> : <FiSend className="h-5 w-5" />}
                </button>
              </div>
            </form>

            <div className="mt-7">
              <h4 className="text-sm font-semibold text-white">Follow us</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {visibleSocials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-700 text-stone-400 transition hover:border-white hover:bg-white hover:text-plum-900"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-stone-800 pt-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-stone-500">
              (c) {currentYear} Aureva Beauty. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {companyLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-stone-500 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({ icon, href, children }) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-800 text-stone-400">
        {icon({ className: 'h-4 w-4' })}
      </span>
      <span className="text-sm text-stone-400">{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex items-center gap-3 transition hover:text-white">
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-3">{content}</div>;
}

function FooterLinks({ title, links }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-normal text-white">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-stone-400 transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
