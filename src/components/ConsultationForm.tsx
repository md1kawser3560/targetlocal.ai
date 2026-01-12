import React, { useState } from 'react';

interface ConsultationRequest {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  serviceType: 'consultation' | 'partnership' | 'agency';
  message: string;
  area: string;
}

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<ConsultationRequest>({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    serviceType: 'consultation',
    message: '',
    area: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firebase Firestore-এ save করব
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessType: '',
          serviceType: 'consultation',
          message: '',
          area: '',
        });

        // ৫ সেকেন্ড পর reset করি
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('ত্রুটি: ফর্ম জমা দিতে পারা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-form max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">পরামর্শ সেবা</h2>
      <p className="text-center text-gray-600 mb-8">আমাদের বিশেষজ্ঞ দলের সাথে যোগাযোগ করুন</p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 p-6 rounded text-center">
          <h3 className="text-xl font-bold text-green-600 mb-2">✅ অনুরোধ সফলভাবে জমা হয়েছে</h3>
          <p className="text-gray-700">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* নাম */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">আপনার নাম *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="আপনার সম্পূর্ণ নাম"
            />
          </div>

          {/* ইমেইল */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">ইমেইল *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="আপনার ইমেইল"
            />
          </div>

          {/* ফোন */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">ফোন নম্বর *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="+880 1XXX XXXXXX"
            />
          </div>

          {/* এলাকা */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">এলাকা *</label>
            <input
              type="text"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="যেমন: মুরাদপুর, উত্তরা"
            />
          </div>

          {/* ব্যবসার ধরন */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">আপনার ব্যবসার ধরন *</label>
            <input
              type="text"
              required
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="যেমন: খাদ্য ব্যবসা, কসমেটিক্স"
            />
          </div>

          {/* সেবার ধরন */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">কি সেবা প্রয়োজন? *</label>
            <div className="space-y-3">
              {[
                { value: 'consultation', label: '💡 ব্যবসায়িক পরামর্শ' },
                { value: 'partnership', label: '🤝 পার্টনারশিপ' },
                { value: 'agency', label: '🏢 এজেন্সি পার্টনারশিপ (কমিশন ভিত্তিক)' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="serviceType"
                    value={option.value}
                    checked={formData.serviceType === option.value}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* বার্তা */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">আপনার বার্তা</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="আপনার প্রয়োজন সম্পর্কে বিস্তারিত বলুন..."
            />
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'পাঠাচ্ছি...' : 'অনুরোধ পাঠান'}
          </button>
        </form>
      )}
    </div>
  );
};