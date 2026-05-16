import { Link } from 'react-router-dom';
import { FiAward, FiHeart, FiShield, FiTruck, FiUsers } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import heroImage from '../../assets/beauty-hero.png';

const stats = [
  ['500+', 'curated products'],
  ['50K+', 'customers served'],
  ['98%', 'positive feedback'],
  ['4+', 'years in beauty'],
];

const values = [
  {
    title: 'Selective sourcing',
    copy: 'We prioritize products with clear purpose, dependable quality, and practical everyday value.',
    icon: FiAward,
  },
  {
    title: 'Customer-first support',
    copy: 'From product discovery to returns, the shopping experience should feel simple and human.',
    icon: FiUsers,
  },
  {
    title: 'Trust over noise',
    copy: 'We avoid overcomplicated claims and focus on products customers can understand and use confidently.',
    icon: FiShield,
  },
  {
    title: 'Better daily rituals',
    copy: 'Beauty should fit into real life, with routines that feel calm, repeatable, and personal.',
    icon: FiHeart,
  },
];

const promises = [
  { icon: FiShield, label: 'Secure checkout' },
  { icon: FiTruck, label: 'Clear delivery' },
  { icon: FiHeart, label: 'Helpful care' },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <main className="mt-20">
        <section className="relative overflow-hidden bg-ivory">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/95 to-ivory/35" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
          </div>

          <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="max-w-2xl">
              <Link to="/" className="mb-8 inline-flex text-sm font-semibold text-plum-800 hover:text-plum-900">
                Back to home
              </Link>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">About Aureva</p>
              <h1 className="mb-6 text-5xl font-semibold tracking-normal text-stone-950 sm:text-6xl">
                Beauty shopping, made more considered.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-stone-700">
                Aureva brings together skincare, makeup, fragrance, haircare, and wellness products for customers who want quality choices without a complicated shopping experience.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">Our story</p>
                <h2 className="text-4xl font-semibold tracking-normal text-stone-950">
                  We curate beauty products for real routines.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-stone-700">
                <p>
                  Aureva Beauty was built around a simple idea: customers should be able to find dependable beauty essentials quickly, understand what they are buying, and feel confident at checkout.
                </p>
                <p>
                  Our collection focuses on everyday skincare, color, scent, personal care, and wellness categories. Each product experience is shaped around clear information, accessible support, and a calm path from browsing to delivery.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-semibold text-stone-950">{value}</p>
                  <p className="mt-2 text-sm font-medium text-stone-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">What guides us</p>
              <h2 className="text-4xl font-semibold tracking-normal text-stone-950">Simple values customers can feel.</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="flex gap-5 rounded-xl border border-stone-200 bg-ivory p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white text-plum-800 shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stone-950">{value.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">{value.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-plum-800">
                  <HiSparkles className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-semibold tracking-normal text-stone-950">Our promise</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {promises.map((promise) => {
                  const PromiseIcon = promise.icon;
                  return (
                    <div key={promise.label} className="rounded-xl bg-ivory p-5">
                      <PromiseIcon className="mb-4 h-6 w-6 text-plum-800" />
                      <p className="text-sm font-semibold text-stone-950">{promise.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-8 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-plum-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-plum-900"
              >
                Shop products
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-rose-200 hover:bg-rose-50"
              >
                Contact support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
