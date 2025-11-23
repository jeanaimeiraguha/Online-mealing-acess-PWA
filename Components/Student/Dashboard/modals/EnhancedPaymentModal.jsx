import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaKey, FaSpinner, FaCheckCircle, FaPhone, FaCopy } from 'react-icons/fa';
import { modalMotion, tapAnimation } from '../utils/animations';
import { formatAmount, validatePhoneNumber, generateOTP } from '../utils/helpers';

const EnhancedPaymentModal = ({ defaultAmount = 10000, onPay, onClose, processing, setProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(defaultAmount);
  const [feeOption, setFeeOption] = useState('no-fee');
  const [phoneError, setPhoneError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sentOTP, setSentOTP] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showUSSD, setShowUSSD] = useState(false);

  const fees = {
    'no-fee': 0,
    'half-month': Math.ceil(amount * 0.01),
    'monthly': Math.ceil(amount * 0.02),
  };

  const totalAmount = amount + fees[feeOption];

  const validatePhone = () => {
    const isValid = validatePhoneNumber(phoneNumber, paymentMethod);
    if (!isValid) {
      const provider = paymentMethod === 'mtn' ? 'MTN (078/079)' : 'Airtel (072/073)';
      setPhoneError(`Please enter a valid ${provider} number`);
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10 || !amount || amount <= 0) return;
    if (!validatePhone()) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const otp = generateOTP();
    setSentOTP(otp);
    setProcessing(false);
    setShowOTP(true);
    console.log('📱 OTP Code:', otp);
  };

  const handleOTPVerification = async () => {
    if (otpCode !== sentOTP) {
      setOtpError('Invalid OTP code. Please try again.');
      return;
    }

    setOtpError('');
    setProcessing(true);
    onPay(paymentMethod, phoneNumber, totalAmount); // Pass arguments to onPay
    await new Promise(resolve => setTimeout(resolve, 1000)); // Keep promise for visual feedback
  };

  const handleShowUSSD = () => {
    setShowUSSD(true);
  };

  const ussdCode = paymentMethod === 'mtn' ? '*182*8*1#' : '*500#';

  if (showOTP) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 shadow-2xl m-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaKey className="text-white text-2xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter OTP Code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We sent a 6-digit code to <strong>{phoneNumber}</strong>
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Demo OTP: {sentOTP}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setOtpError('');
                }}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full h-14 text-center text-2xl font-mono tracking-widest bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 text-gray-900 dark:text-white"
                autoFocus
              />
              {otpError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-2 text-center">
                  {otpError}
                </motion.p>
              )}
            </div>

            <motion.button
              whileTap={tapAnimation}
              onClick={handleOTPVerification}
              disabled={processing || otpCode.length !== 6}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Verify & Pay</>}
            </motion.button>

            <div className="text-center">
              <button
                onClick={handleShowUSSD}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Didn't receive code? Use USSD
              </button>
            </div>

            {showUSSD && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FaPhone className="text-yellow-600" />
                  Alternative: Dial USSD Code
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Dial this code on your phone to approve the payment:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border border-gray-300 dark:border-gray-600">
                  <code className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ussdCode}</code>
                  <motion.button
                    whileTap={tapAnimation}
                    onClick={() => {
                      navigator.clipboard.writeText(ussdCode);
                      alert('USSD code copied!');
                    }}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center gap-1"
                  >
                    <FaCopy /> Copy
                  </motion.button>
                </div>
              </motion.div>
            )}

            <motion.button
              whileTap={tapAnimation}
              onClick={() => {
                setShowOTP(false);
                setOtpCode('');
                setSentOTP('');
                setOtpError('');
                setShowUSSD(false);
              }}
              className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
            >
              Back
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div variants={modalMotion} initial="initial" animate="animate" exit="exit" onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 shadow-2xl m-4 overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Add Money to Card</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Amount (RWF)</label>
            <input type="number" min="500" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} placeholder="Enter amount e.g., 10000" className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Processing Fee Options</label>
            <div className="space-y-2">
              {[
                { key: 'no-fee', label: 'No Fee', desc: 'Standard processing', fee: fees['no-fee'] },
                { key: 'half-month', label: 'Half Month Fee', desc: 'Slightly faster', fee: fees['half-month'] },
                { key: 'monthly', label: 'Monthly Fee', desc: 'Priority processing', fee: fees['monthly'] },
              ].map(option => (
                <motion.button
                  key={option.key}
                  whileTap={tapAnimation}
                  onClick={() => setFeeOption(option.key)}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex justify-between items-center ${feeOption === option.key
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">+RWF {formatAmount(option.fee)}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button whileTap={tapAnimation} onClick={() => { setPaymentMethod('mtn'); setPhoneError(''); }} className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'mtn' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-black">MTN</span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">MTN MoMo</p>
                <p className="text-[10px] text-gray-500 text-center mt-1">078/079</p>
              </motion.button>

              <motion.button whileTap={tapAnimation} onClick={() => { setPaymentMethod('airtel'); setPhoneError(''); }} className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'airtel' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-white">airtel</span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Airtel Money</p>
                <p className="text-[10px] text-gray-500 text-center mt-1">072/073</p>
              </motion.button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError('');
              }}
              onBlur={validatePhone}
              placeholder={paymentMethod === 'mtn' ? '078XXXXXXX' : '072XXXXXXX'}
              className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border ${phoneError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            />
            {phoneError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                {phoneError}
              </motion.p>
            )}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">Amount</span>
              <span className="font-bold text-gray-900 dark:text-white">RWF {formatAmount(amount)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">Fee</span>
              <span className="font-bold text-gray-900 dark:text-white">RWF {formatAmount(fees[feeOption])}</span>
            </div>
            <div className="border-t border-blue-200 dark:border-blue-700 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-blue-600">RWF {formatAmount(totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button whileTap={tapAnimation} onClick={onClose} className="flex-1 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold" disabled={processing}>Cancel</motion.button>
            <motion.button whileTap={tapAnimation} onClick={handlePayment} disabled={processing || !phoneNumber || amount <= 0 || phoneError} className={`flex-[2] py-3 ${paymentMethod === 'mtn' ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'} rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2`}>
              {processing ? <FaSpinner className="animate-spin" /> : <>Continue</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedPaymentModal;
