import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft, FiCheckCircle, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

const eligibleItems = [
  'Unopened products in original packaging within 30 days',
  'Opened products within 14 days when you are not satisfied',
  'Defective or damaged products',
  'Wrong items received',
];

const ineligibleItems = [
  'Opened makeup products unless defective',
  'Used makeup brushes or applicators',
  'Opened intimate care products',
  'Products without original packaging or tags',
  'Final sale or clearance items',
];

const returnSteps = [
  ['Log into your account', 'Open your Aureva account and go to My Orders.'],
  ['Select your order', 'Choose the delivered order that contains the item you want to return.'],
  ['Request the return', 'Choose a reason and add any notes that help our team review it.'],
  ['Pack the item', 'Use secure packaging and include all original accessories or inserts.'],
  ['Ship your return', 'Use the provided instructions or support guidance to send the item back.'],
];

export default function Returns() {
  return (
    <div className="min-h-screen bg-ivory">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-plum-900 hover:text-plum-700">
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-semibold text-stone-950 sm:text-5xl">Returns & Exchanges</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Clear return windows, eligibility rules, and refund timing for beauty and skincare purchases.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
              <FiRefreshCw className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-stone-950">Return Policy</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Unopened products can be returned within 30 days. Opened products can be returned within 14 days when they are eligible and meet hygiene requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <EligibilityPanel icon={FiCheckCircle} title="Eligible for Return" items={eligibleItems} tone="green" />
          <EligibilityPanel icon={FiXCircle} title="Not Eligible for Return" items={ineligibleItems} tone="red" />
        </section>

        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-950">How to Return an Item</h2>
          <div className="mt-6 grid gap-5">
            {returnSteps.map(([title, text], index) => (
              <div key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoBox title="Refund Information">
            <InfoRow title="Processing time" text="Refunds are processed within 5-7 business days after we receive and inspect your return." />
            <InfoRow title="Refund method" text="Refunds are issued to the original payment method. Your bank may need another 3-5 business days to post it." />
            <InfoRow title="Shipping costs" text="Original shipping costs are non-refundable unless the return is due to our error or a defective product." />
          </InfoBox>

          <InfoBox title="Exchanges">
            <p className="text-sm leading-6 text-stone-600">
              We do not currently offer direct exchanges. Return the original item for a refund, then place a new order for the product you want.
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Damaged or defective items are handled separately. Contact support with photos so we can arrange a replacement or full refund.
            </p>
          </InfoBox>
        </section>

        <section className="mt-8 rounded-lg bg-plum-900 p-6 text-center text-white shadow-sm">
          <h2 className="text-xl font-semibold">Need help with a return?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/80">
            Our support team can review return eligibility, damaged items, and refund timing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-plum-900 transition hover:bg-ivory-100">
              Contact Support
            </Link>
            <Link to="/orders" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              View My Orders
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function EligibilityPanel({ icon: Icon, title, items, tone }) {
  const toneClasses = tone === 'green' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses}`}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={tone === 'green' ? 'text-green-600' : 'text-red-600'}>{tone === 'green' ? '+' : '-'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function InfoBox({ title, children }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </article>
  );
}

function InfoRow({ title, text }) {
  return (
    <div className="flex gap-3">
      <FiAlertCircle className="mt-1 h-5 w-5 shrink-0 text-plum-900" />
      <div>
        <h3 className="font-semibold text-stone-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
      </div>
    </div>
  );
}
