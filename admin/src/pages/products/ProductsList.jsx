import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../store/productSlice";

// Components
import ProductTable from "../../components/tables/ProductTable";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Input from "../../components/common/Input";

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, totalProducts, loading, error } = useSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const params = { page, limit, sort: "-createdAt" };
    if (search) params.search = search;
    
    dispatch(fetchProducts(params));
  }, [dispatch, page, search]);

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  if (loading && products.length === 0) {
    return <div className="flex justify-center h-[80vh] items-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="mt-1 text-sm text-gray-500">Browse inventory from all sellers.</p>
        </div>
        <div className="w-full sm:w-64">
           <Input 
             placeholder="Search products..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">Error: {error}</div>
      )}

      {products.length > 0 ? (
        <>
          <ProductTable products={products} onView={handleView} />
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalItems={totalProducts}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        !loading && <EmptyState title="No products found" description="Try adjusting your search." />
      )}
    </div>
  );
};

export default ProductsList;