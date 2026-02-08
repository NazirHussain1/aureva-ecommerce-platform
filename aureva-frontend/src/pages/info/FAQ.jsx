import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Footer from '../../components/common/Footer';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days delivery. International orders may take 7-14 business days depending on the destination.'
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on all orders over $50 within the United States. International shipping rates vary by location.'
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page.'
        },
        {
          q: 'Can I change or cancel my order?',
          a: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact our customer service team for assistance.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy for unopened products in their original packaging. Opened products can be returned within 14 days if you\'re not satisfied.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Log into your account, go to Orders, select the order you want to return, and click "Request Return". Follow the instructions to print your return label.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.'
        },
        {
          q: 'Are there any items that cannot be returned?',
          a: 'For hygiene reasons, we cannot accept returns on opened makeup products, brushes, or intimate care items unless they are defective.'
        }
      ]
    },
    {
      category: 'Products',
      questions: [
        {
          q: 'Are your products authentic?',
          a: 'Absolutely! We source all our products directly from authorized distributors and brands. Every product is 100% authentic and comes with a satisfaction guarantee.'
        },
        {
          q: 'How do I know which products are right for me?',
          a: 'Each product page includes detailed descriptions, ingredients, and customer reviews. You can also contact our beauty experts for personalized recommendations.'
        },
        {
          q: 'Do you test on animals?',
          a: 'We are committed to cruelty-free beauty. We only partner with brands that do not test on animals and clearly label cruelty-free products.'
        },
        {
          q: 'How should I store my beauty products?',
          a: 'Most products should be stored in a cool, dry place away from direct sunlight. Check individual product pages for specific storage instructions.'
        }
      ]
    },
    {
      category: 'Account & Payment',
      questions: [
        {
          q: 'Do I need an account to place an order?',
          a: 'While you can checkout as a guest, creating an account allows you to track orders, save favorites, and enjoy faster checkout.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes! We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details.'
        },
        {
          q: 'Can I use multiple payment methods?',
          a: 'Currently, we only accept one payment method per order. However, you can use gift cards in combination with other payment methods.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90">Find answers to common questions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-600 text-lg mb-4">
            Can't find what you're looking for? Contact our customer support team at{' '}
            <Link to="/contact" className="text-purple-600 hover:underline font-semibold">
              support@aureva.com
            </Link>{' '}
            or call us at <span className="font-semibold">+1 (555) 123-4567</span>
          </p>
        </div>

        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.category}</h2>
            <div className="space-y-3">
              {category.questions.map((faq, questionIndex) => {
                const index = `${categoryIndex}-${questionIndex}`;
                const isOpen = openIndex === index;
                
                return (
                  <div key={questionIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-800 text-left">{faq.q}</span>
                      {isOpen ? (
                        <FiChevronUp className="text-purple-600 text-xl flex-shrink-0 ml-4" />
                      ) : (
                        <FiChevronDown className="text-gray-400 text-xl flex-shrink-0 ml-4" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">Our customer support team is here to help!</p>
          <Link
            to="/contact"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
