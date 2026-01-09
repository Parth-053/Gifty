import React from 'react';
import { Star } from 'lucide-react';

const ReviewsList = () => {
  // Dummy Reviews
  const reviews = [
    { id: 1, user: "Anjali M.", rating: 5, date: "2 days ago", comment: "Absolutely loved the quality! The print is very clear." },
    { id: 2, user: "Rahul S.", rating: 4, date: "1 week ago", comment: "Good product but delivery took a bit long." },
  ];

  return (
    <div className="mt-2 pt-6 border-t border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Reviews</h3>
      
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
               <div>
                  <p className="text-sm font-bold text-gray-900">{rev.user}</p>
                  <div className="flex text-yellow-400 mt-0.5">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < rev.rating ? "fill-current" : "text-gray-300"} />
                     ))}
                  </div>
               </div>
               <span className="text-[10px] text-gray-400">{rev.date}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">"{rev.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;