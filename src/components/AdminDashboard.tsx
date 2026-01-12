import React, { useState, useEffect } from 'react';
import { getConsultationRequests } from '../lib/firebase';

interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  serviceType: string;
  message: string;
  area: string;
  status: string;
  createdAt: any;
}

export const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'consultation' | 'partnership' | 'agency'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getConsultationRequests();
      setRequests(data as ConsultationRequest[]);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return req.status === 'pending';
    return req.serviceType === filter;
  });

  return (
    <div className="admin-dashboard p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">পরামর্শ অনুরোধ ড্যাশবোর্ড</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg font-bold">মোট অনুরোধ</p>
          <p className="text-4xl font-bold">{requests.length}</p>
        </div>
        <div className="bg-yellow-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg font-bold">পেন্ডিং</p>
          <p className="text-4xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg font-bold">পার্টনারশিপ</p>
          <p className="text-4xl font-bold">{requests.filter(r => r.serviceType === 'partnership').length}</p>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow">
          <p className="text-lg font-bold">এজেন্সি</p>
          <p className="text-4xl font-bold">{requests.filter(r => r.serviceType === 'agency').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(['all', 'pending', 'consultation', 'partnership', 'agency'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'সব' : f === 'pending' ? 'পেন্ডিং' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      {loading ? (
        <p className="text-center text-gray-600">লোড হচ্ছে...</p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-center text-gray-600 bg-white p-6 rounded">কোনো অনুরোধ নেই</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-800">নাম</th>
                <th className="px-6 py-3 text-left font-bold text-gray-800">ইমেইল</th>
                <th className="px-6 py-3 text-left font-bold text-gray-800">ফোন</th>
                <th className="px-6 py-3 text-left font-bold text-gray-800">এলাকা</th>
                <th className="px-6 py-3 text-left font-bold text-gray-800">সেবা ধরন</th>
                <th className="px-6 py-3 text-left font-bold text-gray-800">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{req.name}</td>
                  <td className="px-6 py-3">{req.email}</td>
                  <td className="px-6 py-3">{req.phone}</td>
                  <td className="px-6 py-3">{req.area}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      req.serviceType === 'agency' ? 'bg-purple-100 text-purple-800' :
                      req.serviceType === 'partnership' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {req.serviceType === 'agency' ? '🏢 এজেন্সি' :
                       req.serviceType === 'partnership' ? '🤝 পার্টনারশিপ' :
                       '💡 পরামর্শ'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-blue-600 hover:text-blue-800 font-bold">
                      বিস্তারিত দেখুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};