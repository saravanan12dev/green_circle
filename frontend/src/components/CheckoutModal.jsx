import React, { useEffect, useMemo, useState } from 'react';
import { placeOrder } from '../services/orderApi';
import './CheckoutModal.css';

const idTypes = ['Aadhar Card', 'PAN Card'];
const paymentOptions = [
  { value: 'cash', label: 'Cash on Delivery' },
  { value: 'gpay', label: 'Google Pay' },
  { value: 'bank', label: 'Bank Transfer' },
];

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getInitialViewDate = (product) => {
  const today = new Date();
  const productStart = product?.availableFrom ? parseDateKey(product.availableFrom) : null;
  if (productStart && productStart > today) {
    return new Date(productStart.getFullYear(), productStart.getMonth(), 1);
  }
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

export default function CheckoutModal({ product, user, onClose, onPlaceOrder }) {
  const ownerName = product?.adminName || product?.ownerName || user?.name || 'Green Circle Host';
  const ownerPhone = product?.adminPhone || product?.ownerPhone || user?.phone || 'Not shared';
  const ownerAddress = product?.adminAddress || product?.ownerAddress || user?.address || 'Not shared';

  const [form, setForm] = useState({
    customerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    rentedName: product?.title || '',
    bookingDates: [],
    idType: 'Aadhar Card',
    idNumber: '',
    paymentMethod: 'cash',
    otp: '',
  });
  const [sentOtp, setSentOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [viewDate, setViewDate] = useState(() => getInitialViewDate(product));
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    setViewDate(getInitialViewDate(product));
    setForm((prev) => ({
      ...prev,
      rentedName: product?.title || '',
      bookingDates: [],
    }));
    setSelectedDates([]);
    setOtpVerified(false);
    setOtpMessage('');
  }, [product?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (dateKey) => {
    const parsedDate = parseDateKey(dateKey);
    const blockedDates = new Set((product?.blockedDates || []).filter(Boolean));
    const startDate = product?.availableFrom ? parseDateKey(product.availableFrom) : null;
    const endDate = product?.availableUntil ? parseDateKey(product.availableUntil) : null;
    const hasRange = Boolean(startDate || endDate);
    const isAvailable = (!hasRange || (parsedDate && (!startDate || parsedDate >= startDate) && (!endDate || parsedDate <= endDate))) && !blockedDates.has(dateKey);

    if (!parsedDate || !isAvailable) return;

    setSelectedDates((prev) => {
      const nextDates = prev.includes(dateKey)
        ? prev.filter((item) => item !== dateKey)
        : [...prev, dateKey];
      setForm((formState) => ({ ...formState, bookingDates: nextDates }));
      return nextDates;
    });
  };

  const handleSendOtp = () => {
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    setSentOtp(generatedOtp);
    setOtpVerified(false);
    setOtpMessage(`OTP sent to ${form.email || form.phone || 'your registered contact'}. Demo code: ${generatedOtp}`);
  };

  const handleVerifyOtp = () => {
    if (!sentOtp) {
      setOtpMessage('Send OTP first to verify your identity.');
      return;
    }
    if (form.otp === sentOtp) {
      setOtpVerified(true);
      setOtpMessage('OTP verified successfully.');
      return;
    }
    setOtpVerified(false);
    setOtpMessage('OTP mismatch. Please re-enter the code.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.customerName || !form.email || !form.phone || !form.address || !form.rentedName) {
      setOtpMessage('Please fill the required customer details.');
      return;
    }
    if (!otpVerified) {
      setOtpMessage('Please verify your OTP before placing the order.');
      return;
    }
    if (!form.paymentMethod) {
      setOtpMessage('Please choose a payment method.');
      return;
    }
    if (!form.bookingDates.length) {
      setOtpMessage('Please choose at least one available booking date from the calendar.');
      return;
    }

    const orderPayload = {
      productId: product?.id,
      productTitle: form.rentedName,
      productCategory: product?.category,
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      idType: form.idType,
      idNumber: form.idNumber,
      paymentMethod: form.paymentMethod,
      pricePerDay: product?.pricePerDay || 0,
      rentedName: form.rentedName,
      bookingDates: form.bookingDates,
      productOwnerName: ownerName,
      productOwnerPhone: ownerPhone,
      productOwnerAddress: ownerAddress,
    };

    try {
      await placeOrder(orderPayload);
      onPlaceOrder(orderPayload);
      onClose();
    } catch (error) {
      console.warn('Order placement via backend failed, using local state:', error);
      onPlaceOrder(orderPayload);
      onClose();
    }
  };

  const summaryText = useMemo(() => {
    if (!product) return 'Select a rental product';
    return `${product.title} • ₹${product.pricePerDay}/day`;
  }, [product]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingDays = firstDay.getDay();
    const cells = [];
    const blockedDates = new Set((product?.blockedDates || []).filter(Boolean));
    const startDate = product?.availableFrom ? parseDateKey(product.availableFrom) : null;
    const endDate = product?.availableUntil ? parseDateKey(product.availableUntil) : null;
    const hasRange = Boolean(startDate || endDate);

    for (let index = leadingDays; index > 0; index -= 1) {
      const date = new Date(year, month, 1 - index);
      cells.push({ date, isCurrentMonth: false, dateKey: formatDateKey(date), isAvailable: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const isBlocked = blockedDates.has(dateKey);
      const isInRange = !hasRange || (date >= (startDate || date) && date <= (endDate || date));
      const isAvailable = !isBlocked && isInRange;
      cells.push({ date, isCurrentMonth: true, dateKey, isAvailable });
    }

    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day += 1) {
      const date = new Date(year, month + 1, day);
      cells.push({ date, isCurrentMonth: false, dateKey: formatDateKey(date), isAvailable: false });
    }

    return cells;
  }, [product?.availableFrom, product?.availableUntil, product?.blockedDates, viewDate]);

  const monthLabel = viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(event) => event.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <p className="checkout-eyebrow">Secure checkout</p>
            <h3>Rent Now</h3>
          </div>
          <button type="button" className="checkout-close" onClick={onClose} aria-label="Close checkout" title="Close">×</button>
        </div>

        <div className="checkout-summary">{summaryText}</div>

        <div className="owner-details-card">
          <h4>Product owner details</h4>
          <div className="owner-detail-row"><span>Name</span><strong>{ownerName}</strong></div>
          <div className="owner-detail-row"><span>Phone</span><strong>{ownerPhone}</strong></div>
          <div className="owner-detail-row"><span>Address</span><strong>{ownerAddress}</strong></div>
        </div>

        <div className="availability-card">
          <div className="availability-header">
            <div>
              <h4>Choose a booking date</h4>
              <p>Tap available dates to select them. Every chosen date will turn green.</p>
            </div>
            <div className="availability-nav">
              <button type="button" className="month-nav-btn" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>◀</button>
              <span>{monthLabel}</span>
              <button type="button" className="month-nav-btn" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>▶</button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day) => {
              const isSelected = selectedDates.includes(day.dateKey) || form.bookingDates.includes(day.dateKey);
              const cellClassName = [
                'calendar-day',
                !day.isCurrentMonth ? 'muted' : '',
                day.isAvailable ? 'available' : '',
                !day.isAvailable && day.isCurrentMonth ? 'unavailable' : '',
                isSelected ? 'selected' : '',
              ].filter(Boolean).join(' ');

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  className={cellClassName}
                  onClick={() => handleDateSelect(day.dateKey)}
                  disabled={!day.isCurrentMonth || !day.isAvailable}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="availability-legend">
            <span><i className="legend-dot available" /> Available</span>
            <span><i className="legend-dot unavailable" /> Unavailable</span>
            <span><i className="legend-dot selected" /> Selected</span>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Booking dates
            <input readOnly name="bookingDates" value={form.bookingDates.join(', ')} placeholder="Select one or more dates from the calendar" />
          </label>

          <div className="checkout-grid">
            <label>
              Customer name
              <input required name="customerName" value={form.customerName} onChange={handleChange} placeholder="Enter your full name" />
            </label>
            <label>
              Email
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </label>
          </div>

          <div className="checkout-grid">
            <label>
              Phone number
              <input required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
            </label>
            <label>
              Address
              <input required name="address" value={form.address} onChange={handleChange} placeholder="Enter your address" />
            </label>
          </div>

          <div className="checkout-grid">
            <label>
              Rented product
              <input readOnly name="rentedName" value={form.rentedName} onChange={handleChange} />
            </label>
          </div>

          <div className="checkout-grid">
            <label>
              ID verification
              <select name="idType" value={form.idType} onChange={handleChange}>
                {idTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              ID number
              <input required name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="Enter ID number" />
            </label>
          </div>

          <div className="otp-card">
            <div className="otp-actions">
              <button type="button" className="otp-btn" onClick={handleSendOtp}>Send OTP</button>
              <input
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                inputMode="numeric"
                maxLength="6"
              />
              <button type="button" className="otp-btn secondary" onClick={handleVerifyOtp}>Verify</button>
            </div>
            {otpMessage && <p className={`otp-message ${otpVerified ? 'success' : ''}`}>{otpMessage}</p>}
          </div>

          <fieldset className="payment-fieldset">
            <legend>Payment method</legend>
            {paymentOptions.map((option) => (
              <label key={option.value} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={form.paymentMethod === option.value}
                  onChange={handleChange}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          <button type="submit" className="place-order-btn">Place Order</button>
        </form>
      </div>
    </div>
  );
}
