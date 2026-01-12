import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaData {
  areaName: string;
  population: number;
  businessPotential: number;
  recommendedBusinesses: string[];
  socialMediaStats: {
    facebook: number;
    instagram: number;
    tiktok: number;
    youtube: number;
  };
  marketTrends: Array<{ month: string; growth: number }>;
}

export const ReportGraphics: React.FC<{ data: AreaData }> = ({ data }) => {
  const socialMediaData = [
    { name: 'Facebook', value: data.socialMediaStats.facebook, fill: '#1877F2' },
    { name: 'Instagram', value: data.socialMediaStats.instagram, fill: '#E4405F' },
    { name: 'TikTok', value: data.socialMediaStats.tiktok, fill: '#000000' },
    { name: 'YouTube', value: data.socialMediaStats.youtube, fill: '#FF0000' },
  ];

  const marketData = [
    { category: 'Business Potential', value: data.businessPotential },
    { category: 'Competition', value: 100 - data.businessPotential },
  ];

  return (
    <div className="report-graphics space-y-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{data.areaName} - বাজার বিশ্লেষণ রিপোর্ট</h2>
        <p className="text-gray-600">সম্পূর্ণ ডেটা-চালিত ব্যবসায়িক অন্তর্দৃষ্টি</p>
      </div>

      {/* Population Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📊 জনসংখ্যা এবং বাজার সম্ভাবনা</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: 'জনসংখ্যা', value: data.population }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" name="মোট জনসংখ্যা" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-gray-700">
            <strong>মোট জনসংখ্যা:</strong> {data.population.toLocaleString('bn-BD')} জন
          </p>
          <p className="text-gray-700 mt-2">
            <strong>ব্যবসা সম্ভাবনা:</strong> <span className="text-green-600 font-bold">{data.businessPotential}%</span>
          </p>
        </div>
      </div>

      {/* Social Media Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📱 সোশ্যাল মিডিয়া উপস্থিতি</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={socialMediaData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {socialMediaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialMediaData.map((platform) => (
            <div key={platform.name} className="p-4 bg-gray-50 rounded text-center">
              <p className="font-bold text-gray-800">{platform.name}</p>
              <p className="text-2xl font-bold" style={{ color: platform.fill }}>
                {platform.value}%
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
          <p className="text-gray-700 font-semibold mb-2">💡 মার্কেটিং সুপারিশ:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {data.socialMediaStats.facebook >= 30 && <li>Facebook এ বেশি ফোকাস করুন (বয়স্ক দর্শক)</li>}
            {data.socialMediaStats.instagram >= 25 && <li>Instagram Reels দিয়ে তরুণদের টার্গেট করুন</li>}
            {data.socialMediaStats.tiktok >= 20 && <li>TikTok এ ভাইরাল কন্টেন্ট তৈরি করুন</li>}
            {data.socialMediaStats.youtube >= 25 && <li>YouTube এ টিউটোরিয়াল এবং প্রোডাক্ট ডেমো দিন</li>}
          </ul>
        </div>
      </div>

      {/* Recommended Businesses */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🏪 সুপারিশকৃত ব্যবসা</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendedBusinesses.map((business, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-300">
              <p className="font-bold text-gray-800">{index + 1}. {business}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📈 বাজারের প্রবণতা</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.marketTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="growth" stroke="#3B82F6" strokeWidth={2} name="বৃদ্ধির হার (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CTA - Consultation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-bold mb-4">পরামর্শ এবং পার্টনারশিপ সেবা</h3>
        <p className="mb-6 text-blue-100">
          আপনার ব্যবসা শুরু করতে বা বৃদ্ধি করতে আমাদের বিশেষজ্ঞ দলের সাথে যোগাযোগ করুন
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
          সেবা নিতে যোগাযোগ করুন
        </button>
      </div>
    </div>
  );
};