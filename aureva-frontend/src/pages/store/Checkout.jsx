import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../features/cart/cartSlice';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { FiCreditCard, FiTruck, FiMapPin, FiPhone, FiChevronRight, FiChevronLeft, FiHome, FiPackage, FiEdit2, FiPlus, FiUser } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { MdCheckCircle, MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    paymentMethod: 'cash_on_delivery',
    accountNumber: '',
    accountTitle: '',
    bankName: ''
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const steps = [
    { number: 1, title: 'Shipping', icon: FiTruck },
    { number: 2, title: 'Payment', icon: FiCreditCard },
    { number: 3, title: 'Review', icon: FiPackage }
  ];

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    if (user) {
      fetchAddresses();
    }
    document.title = 'Checkout - Aureva Beauty';
    
    return () => {
      document.title = 'Aureva Beauty';
    };
  }, [items, navigate, user]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/addresses');
      setAddresses(response.data || []);
      const defaultAddr = response.data?.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!useNewAddress && !selectedAddress) {
        toast.error('Please select a shipping address');
        return;
      }
      if (useNewAddress) {
        if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.zipCode) {
          toast.error('Please fill in all shipping details');
          return;
        }
      }
    }
    if (currentStep === 2) {
      if ((formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa') && !formData.accountNumber) {
        toast.error('Please enter your account number');
        return;
      }
      if (formData.paymentMethod === 'bank_transfer' && (!formData.bankName || !formData.accountTitle || !formData.accountNumber)) {
        toast.error('Please fill in all bank transfer details');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      let shippingAddress;
      if (useNewAddress) {
        shippingAddress = {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.addressLine1 + (formData.addressLine2 ? ', ' + formData.addressLine2 : ''),
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        };
      } else {
        shippingAddress = {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.addressLine1 + (selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''),
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country
        };
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          accountNumber: formData.accountNumber,
          accountTitle: formData.accountTitle,
          bankName: formData.bankName
        },
        totalAmount: total
      };

      const response = await axios.post('/api/orders', orderData);
      
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      navigate(`/orders`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in {3 - currentStep + 1} simple steps</p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                      : currentStep === step.number 
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl scale-110' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <MdCheckCircle className="text-2xl" />
                    ) : (
                      <step.icon className="text-2xl" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-semibold ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 animate-slideInUp">
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                      <FiTruck className="text-2xl text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                  </div>

                  {addresses.length > 0 && !useNewAddress && (
                    <div className="space-y-4 mb-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Select a saved address:</p>
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedAddress?.id === address.id
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {selectedAddress?.id === address.id ? (
                                <MdRadioButtonChecked className="text-2xl text-purple-600" />
                              ) : (
                                <MdRadioButtonUnchecked className="text-2xl text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900">{address.fullName}</h3>
                                {address.isDefault && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{address.addressLine1}</p>
                              {address.addressLine2 && <p className="text-sm text-gray-600 mb-1">{address.addressLine2}</p>}
                              <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                <FiPhone className="w-4 h-4" />
                                {address.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(!useNewAddress)}
                      className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-300 mb-6"
                    >
                      <FiPlus className="text-lg" />
                      {useNewAddress ? 'Use saved address' : 'Add new address'}
                    </button>
                  )}

                  {(useNewAddress || addresses.length === 0) && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400 text-lg" />
                          </div>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="input pl-12"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400 text-lg" />
                          </div>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input pl-12"
                            placeholder="+92 300 1234567"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiHome className="text-gray-400 text-lg" />
                          </div>
                          <input
                            type="text"
                            value={formData.addressLine1}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            className="input pl-12"
                            placeholder="House/Flat No, Street Name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.addressLine2}
                          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                          className="input"
                          placeholder="Apartment, Suite, Unit"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="input"
                            placeholder="Karachi"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            State/Province *
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="input"
                            placeholder="Sindh"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            className="input"
                            placeholder="75500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                      <FiCreditCard className="text-2xl text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cash_on_delivery' })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'cash_on_delivery'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {formData.paymentMethod === 'cash_on_delivery' ? (
                          <MdRadioButtonChecked className="text-2xl text-purple-600 flex-shrink-0" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">💵 Cash on Delivery</h3>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'jazzcash' })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'jazzcash'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {formData.paymentMethod === 'jazzcash' ? (
                          <MdRadioButtonChecked className="text-2xl text-purple-600 flex-shrink-0" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">📱 JazzCash</h3>
                          <p className="text-sm text-gray-600">Pay via JazzCash mobile wallet</p>
                        </div>
                      </div>
                      {formData.paymentMethod === 'jazzcash' && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Payment Instructions:</h4>
                            <div className="space-y-1 text-xs text-blue-800">
                              <p>1. Send payment to: <span className="font-mono bg-white px-2 py-1 rounded">03XX-XXXXXXX</span></p>
                              <p>2. Enter your JazzCash number below</p>
                              <p>3. We'll verify and confirm your order</p>
                            </div>
                          </div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your JazzCash Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="input"
                            placeholder="03XX-XXXXXXX"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'easypaisa' })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'easypaisa'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {formData.paymentMethod === 'easypaisa' ? (
                          <MdRadioButtonChecked className="text-2xl text-purple-600 flex-shrink-0" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">📱 EasyPaisa</h3>
                          <p className="text-sm text-gray-600">Pay via EasyPaisa mobile wallet</p>
                        </div>
                      </div>
                      {formData.paymentMethod === 'easypaisa' && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-green-900 mb-2 text-sm">Payment Instructions:</h4>
                            <div className="space-y-1 text-xs text-green-800">
                              <p>1. Send payment to: <span className="font-mono bg-white px-2 py-1 rounded">03XX-XXXXXXX</span></p>
                              <p>2. Enter your EasyPaisa number below</p>
                              <p>3. We'll verify and confirm your order</p>
                            </div>
                          </div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your EasyPaisa Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="input"
                            placeholder="03XX-XXXXXXX"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'bank_transfer'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {formData.paymentMethod === 'bank_transfer' ? (
                          <MdRadioButtonChecked className="text-2xl text-purple-600 flex-shrink-0" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">🏦 Bank Transfer</h3>
                          <p className="text-sm text-gray-600">Direct bank transfer</p>
                        </div>
                      </div>
                      {formData.paymentMethod === 'bank_transfer' && (
                        <div className="mt-4 pt-4 border-t border-purple-200 space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <h4 className="font-semibold text-green-900 mb-2 text-sm">Our Bank Details:</h4>
                            <div className="space-y-1 text-xs text-green-800">
                              <p><strong>Bank:</strong> Meezan Bank</p>
                              <p><strong>Account Title:</strong> Aureva Beauty</p>
                              <p><strong>Account:</strong> <span className="font-mono bg-white px-2 py-1 rounded">0123456789012345</span></p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Your Bank Name *
                            </label>
                            <select
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                              className="input"
                              required
                            >
                              <option value="">Select Bank</option>
                              <option value="Meezan Bank">Meezan Bank</option>
                              <option value="HBL">Habib Bank Limited (HBL)</option>
                              <option value="UBL">United Bank Limited (UBL)</option>
                              <option value="MCB">MCB Bank</option>
                              <option value="Allied Bank">Allied Bank</option>
                              <option value="Bank Alfalah">Bank Alfalah</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Account Title *
                            </label>
                            <input
                              type="text"
                              value={formData.accountTitle}
                              onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                              className="input"
                              placeholder="Your Name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Account Number *
                            </label>
                            <input
                              type="text"
                              value={formData.accountNumber}
                              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                              className="input"
                              placeholder="Your Account Number"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.paymentMethod === 'credit_card'
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {formData.paymentMethod === 'credit_card' ? (
                          <MdRadioButtonChecked className="text-2xl text-purple-600 flex-shrink-0" />
                        ) : (
                          <MdRadioButtonUnchecked className="text-2xl text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">💳 Credit/Debit Card</h3>
                          <p className="text-sm text-gray-600">Secure payment gateway</p>
                        </div>
                      </div>
                      {formData.paymentMethod === 'credit_card' && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <p className="text-sm text-purple-800">
                              You will be redirected to a secure payment gateway to complete your card payment.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                      <FiPackage className="text-2xl text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Review Order</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <FiMapPin className="text-purple-600" />
                          Shipping Address
                        </h3>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                      {useNewAddress ? (
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-semibold">{formData.fullName}</p>
                          <p>{formData.addressLine1}</p>
                          {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                          <p className="text-gray-600">{formData.phone}</p>
                        </div>
                      ) : selectedAddress && (
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-semibold">{selectedAddress.fullName}</p>
                          <p>{selectedAddress.addressLine1}</p>
                          {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                          <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                          <p className="text-gray-600">{selectedAddress.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <FiCreditCard className="text-purple-600" />
                          Payment Method
                        </h3>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 font-semibold capitalize">
                        {formData.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiPackage className="text-purple-600" />
                        Order Items ({items.length})
                      </h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 items-center p-3 bg-white rounded-xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.images && item.images[0] ? (
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <HiSparkles className="text-2xl text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-purple-600">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 font-bold flex items-center gap-2 active:scale-95 touch-target"
                  >
                    <FiChevronLeft className="text-xl" />
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 touch-target"
                  >
                    Continue
                    <FiChevronRight className="text-xl" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
                  >
                    {loading ? (
                      <>
                        <BiLoaderAlt className="animate-spin text-xl" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className="text-xl" />
                        Place Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-24 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiSparkles className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-purple-600 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-xl pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="flex items-start gap-3">
                  <MdCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Secure Checkout</p>
                    <p className="text-xs text-gray-600">Your payment information is protected with industry-standard encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
