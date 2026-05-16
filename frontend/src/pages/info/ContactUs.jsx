import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiClock,
  FiHelpCircle,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
} from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { submitContactForm } from '../../api/contactApi';

const contactOptions = [
  {
    title: 'Order support',
    copy: 'Questions about delivery, returns, payment, or a recent purchase.',
    icon: FiMessageCircle,
  },
  {
    title: 'Product guidance',
    copy: 'Need help choosing skincare, fragrance, makeup, or daily care items.',
    icon: FiHelpCircle,
  },
  {
    title: 'Response window',
    copy: 'Most messages are reviewed within one business day.',
    icon: FiClock,
  },
];

const contactDetails = [
  {
    title: 'Email',
    primary: 'support@aureva.com',
    secondary: 'sales@aureva.com',
    icon: FiMail,
  },
  {
    title: 'Phone',
    primary: '+1 (555) 123-4567',
    secondary: 'Mon-Fri, 9AM-6PM',
    icon: FiPhone,
  },
  {
    title: 'Office',
    primary: '123 Beauty Avenue',
    secondary: 'New York, NY 10001',
    icon: FiMapPin,
  },
];

const initialFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactUs() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await submitContactForm(formData);
      toast.success(response.message || 'Message sent. We will get back to you shortly.');
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <main className="mt-20">
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Link to="/" className="mb-8 inline-flex text-sm font-semibold text-plum-800 hover:text-plum-900">
                  Back to home
                </Link>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-rose-700">Contact Aureva</p>
                <h1 className="max-w-2xl text-5xl font-semibold tracking-normal text-stone-950 sm:text-6xl">
                  We are here to help with your beauty order.
                </h1>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-stone-700">
                Send us a message for order questions, product guidance, returns, or partnership requests. Keep your order number handy if your message is about a purchase.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {contactOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-plum-800">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-stone-950">{option.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{option.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="space-y-4">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.title} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-ivory text-plum-800">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-stone-950">{detail.title}</h2>
                        <p className="mt-1 text-sm text-stone-700">{detail.primary}</p>
                        <p className="text-sm text-stone-500">{detail.secondary}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-xl border border-stone-200 bg-plum-900 p-6 text-white shadow-sm">
                <h2 className="text-lg font-semibold">Before you send</h2>
                <p className="mt-2 text-sm leading-6 text-rose-50/80">
                  For order support, include your order number and the email used at checkout. It helps us answer faster.
                </p>
              </div>
            </aside>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-700">Send a message</p>
                <h2 className="text-3xl font-semibold tracking-normal text-stone-950">Tell us what you need.</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-stone-800">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="input"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-stone-800">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="input"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-stone-800">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-stone-800">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    rows="6"
                    className="textarea"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-plum-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-plum-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <FiSend className="h-4 w-4" />
                  {submitting ? 'Sending message' : 'Send message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
