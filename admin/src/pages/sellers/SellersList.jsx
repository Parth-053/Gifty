import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import SellerTable from '../../components/tables/SellerTable';
import Pagination from '../../components/common/Pagination';

const SellersList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const sellers = [
    { id: 1, storeName: "TechWorld", ownerName: "Rahul Kumar", email: "rahul@tech.com", status: "Verified" },
    { id: 2, storeName: "FashionHub", ownerName: "Sita Verma", email: "sita@hub.com", status: "Pending" },
    { id: 3, storeName: "GadgetStore", ownerName: "Amit Singh", email: "amit@gadget.com", status: "Rejected" },
  ];

  const filteredSellers = sellers.filter(s => 
    s.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>
          <p className="text-sm text-gray-500">Manage registered vendors.</p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
         <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-lg py-2.5 w-full sm:w-80 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
               type="text" 
               placeholder="Search by store name..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent outline-none text-sm w-full font-medium"
            />
         </div>
      </div>

      <SellerTable sellers={filteredSellers} onView={(id) => navigate(`/sellers/${id}`)} />
      <Pagination currentPage={1} totalPages={3} onPageChange={()=>{}} />
    </div>
  );
};

export default SellersList;