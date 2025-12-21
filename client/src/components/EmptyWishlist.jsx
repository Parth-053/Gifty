const EmptyWishlist = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
      <div className="text-4xl mb-2">❤️</div>
      <p>Your wishlist is empty</p>
      <p className="text-sm">
        Add gifts you love to wishlist
      </p>
    </div>
  );
};

export default EmptyWishlist;
