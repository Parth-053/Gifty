import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ReviewsList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
        <p className="text-gray-500 font-medium">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Customer Reviews ({reviews.length})</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {review.user?.name?.charAt(0) || <User size={20} />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{review.user?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;