import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { Search, Filter, ArrowUpRight } from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]); // Default empty array
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchPayouts = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/finance/payouts?page=${page}`);
      
      // structure: data.data.payouts
      setPayouts(data.data.payouts || []); 
      setPagination({
        page: data.data.currentPage,
        totalPages: Math.ceil(data.data.total / 10)
      });
    } catch (error) {
      console.error("Error fetching payouts:", error);
      toast.error("Failed to load payouts");
      setPayouts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Seller Payouts</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search Seller..." className="pl-10 pr-4 py-2 border rounded-xl outline-none text-sm" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-bold text-gray-600">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4">Payout ID</th>
              <th className="px-6 py-4">Seller / Store</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : payouts.length > 0 ? (
              payouts.map((payout) => (
                <tr key={payout._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{payout.payoutId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{payout.sellerId?.storeName || 'Unknown Store'}</div>
                    <div className="text-xs text-gray-500">{payout.sellerId?.ownerName}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{payout.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      payout.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                      payout.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline text-sm font-bold">Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-10 text-gray-400">No payouts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {!loading && payouts.length > 0 && (
        <Pagination 
          currentPage={pagination.page} 
          totalPages={pagination.totalPages} 
          onPageChange={(page) => fetchPayouts(page)} 
        />
      )}
    </div>
  );
};

export default Payouts;