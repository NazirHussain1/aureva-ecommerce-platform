import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiHelpCircle, FiMail } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      ['How long does shipping take?', 'Standard shipping usually takes 3-5 business days. Express shipping takes 1-2 business days. International delivery timing depends on the destination and customs processing.'],
      ['Do you offer free shipping?', 'Yes. Standard shipping is free on eligible US orders over $50. Shipping charges for smaller orders and international orders are shown at checkout.'],
      ['How can I track my order?', 'Once your order ships, you will receive tracking by email. You can also log into your account and open My Orders.'],
      ['Can I change or cancel my order?', 'Orders can usually be changed or cancelled before they enter processing. If the order has already shipped, you can request a return after delivery.'],
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      ['What is your return policy?', 'Unopened products can be returned within 30 days. Eligible opened products can be returned within 14 days. Some hygiene-sensitive products are final sale once opened.'],
      ['How do I start a return?', 'Log into your account, open My Orders, select the order, and follow the return request flow. You can also contact support for help.'],
      ['When will I receive my refund?', 'Refunds are processed within 5-7 business days after your return is received and inspected. Your payment provider may need additional time to post it.'],
      ['Which items cannot be returned?', 'Opened makeup, used brushes, opened intimate care products, and final sale items cannot be returned unless they are defective or incorrect.'],
    ],
  },
  {
    category: 'Products',
    questions: [
      ['Are your products authentic?', 'Yes. We source products from authorized brands and distributors.'],
      ['How do I choose the right product?', 'Check product details, ingredients, and skin type guidance on the product page. For more help, contact our support team.'],
      ['Are products cruelty-free?', 'We label cruelty-free products where brand information is available and prioritize brands with responsible beauty standards.'],
      ['How should I store beauty products?', 'Most products should be stored in a cool, dry place away from direct sunlight. Follow any product-specific storage instructions on the packaging.'],
    ],
  },
  {
    category: 'Account & Payment',
    questions: [
      ['Do I need an account to place an order?', 'An account helps you track orders, manage addresses, and save wishlist items. Protected checkout pages require login in this store.'],
      ['What payment methods do you accept?', 'Accepted payment methods depend on the checkout configuration and may include card, cash on delivery, JazzCash, Easypaisa, or bank transfer.'],
      ['Is my payment information secure?', 'Checkout uses secure HTTPS connections. Full card details should be handled by the payment provider, not stored by Aureva.'],
      ['Can I update my profile information?', 'Yes. Go to Profile to update your name, email, password, and profile picture.'],
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState('0-0');

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-plum-900 hover:text-plum-700">
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-semibold text-stone-950 sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Quick answers about orders, shipping, returns, products, account settings, and payment.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ivory-100 text-plum-900">
                <FiHelpCircle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-stone-950">Need a faster answer?</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Send your question with your order number if it is about an existing purchase.
                </p>
              </div>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-plum-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-plum-950">
              <FiMail className="h-4 w-4" />
              Contact Support
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <p className="px-2 text-xs font-semibold uppercase tracking-normal text-stone-500">Categories</p>
            <div className="mt-3 space-y-1">
              {faqs.map((category, categoryIndex) => (
                <button
                  key={category.category}
                  type="button"
                  onClick={() => setOpenIndex(`${categoryIndex}-0`)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                    String(openIndex).startsWith(`${categoryIndex}-`)
                      ? 'bg-ivory-100 text-plum-900'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <section key={category.category}>
                <h2 className="text-2xl font-semibold text-stone-950">{category.category}</h2>
                <div className="mt-4 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm">
                  {category.questions.map(([question, answer], questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <article key={question}>
                        <button
                          type="button"
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="font-semibold text-stone-950">{question}</span>
                          <FiChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition ${isOpen ? 'rotate-180 text-plum-900' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-sm leading-6 text-stone-600">
                            {answer}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
