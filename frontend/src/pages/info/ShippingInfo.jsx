import { Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

const shippingOptions = [
  {
    title: 'Standard Shipping',
    time: '3-5 business days',
    price: 'Free on orders over $50',
    note: '$5.99 for orders under $50',
    icon: FiTruck,
  },
  {
    title: 'Express Shipping',
    time: '1-2 business days',
    price: '$14.99',
    note: 'Available for most US addresses',
    icon: FiClock,
  },
  {
    title: 'International Shipping',
    time: '7-14 business days',
    price: 'Calculated at checkout',
    note: 'Rates vary by destination',
    icon: FiMapPin,
  },
];

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-ivory">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-plum-900 hover:text-plum-700">
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-semibold text-stone-950 sm:text-5xl">Shipping Information</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Delivery options, processing times, tracking, and shipping restrictions for Aureva Beauty orders.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <article key={option.title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-stone-950">{option.title}</h2>
                <p className="mt-2 text-sm text-stone-600">{option.time}</p>
                <p className="mt-4 text-sm font-semibold text-plum-900">{option.price}</p>
                <p className="mt-1 text-sm text-stone-500">{option.note}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoPanel icon={FiClock} title="Processing Time">
            <p>Orders are usually processed within 1-2 business days. Orders placed on weekends or holidays are processed on the next business day.</p>
            <p>You will receive an order confirmation email after checkout and a shipping confirmation once tracking is available.</p>
          </InfoPanel>

          <InfoPanel icon={FiPackage} title="Order Tracking">
            <p>After your order ships, the tracking details are sent by email and are also available from your account orders page.</p>
            <ul className="space-y-2">
              <li>Use the tracking link in your shipping email.</li>
              <li>Log in and open My Orders.</li>
              <li>Contact support if tracking has not updated after 48 hours.</li>
            </ul>
          </InfoPanel>

          <InfoPanel icon={FiMapPin} title="Shipping Restrictions">
            <p>We currently ship to all 50 US states and selected international destinations. Some beauty products may be restricted by local regulations.</p>
            <p>PO boxes and APO/FPO addresses are not supported at this time.</p>
          </InfoPanel>

          <div className="rounded-lg bg-plum-900 p-6 text-white shadow-sm">
            <h2 className="text-xl font-semibold">Need help with delivery?</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Send us your order number and we will help with address changes, tracking questions, or delivery issues.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-plum-900 transition hover:bg-ivory-100">
                Contact Us
              </Link>
              <Link to="/faq" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                View FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InfoPanel({ icon: Icon, title, children }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      </div>
      <div className="mt-5 space-y-4 text-sm leading-6 text-stone-600">{children}</div>
    </article>
  );
}
