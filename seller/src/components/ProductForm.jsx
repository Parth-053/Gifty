import { useState } from "react";
import API_URL from "../config/api";

const ProductForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // customization states
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [allowImage, setAllowImage] = useState(false);
  const [allowText, setAllowText] = useState(false);
  const [minImages, setMinImages] = useState(0);
  const [maxImages, setMaxImages] = useState(0);
  const [allowRandomize, setAllowRandomize] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description);

      images.forEach((img) => formData.append("images", img));

      // customization object
      const customization = {
        isCustomizable,
        mandatoryUploads: {
          images: allowImage,
          text: allowText,
        },
        uploadLimits: {
          minImages: Number(minImages),
          maxImages: Number(maxImages),
        },
        allowRandomize,
      };

      formData.append("customization", JSON.stringify(customization));

      const res = await fetch(`${API_URL}/api/seller/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add product");
      }

      alert("✅ Product added successfully");

      // reset
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImages([]);
      setIsCustomizable(false);
      setAllowImage(false);
      setAllowText(false);
      setMinImages(0);
      setMaxImages(0);
      setAllowRandomize(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        className="w-full border p-2 rounded"
        placeholder="Product title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files))}
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={isCustomizable}
          onChange={(e) => setIsCustomizable(e.target.checked)}
        />
        Customizable product
      </label>

      {isCustomizable && (
        <div className="border p-3 rounded space-y-2">
          <label>
            <input
              type="checkbox"
              checked={allowImage}
              onChange={(e) => setAllowImage(e.target.checked)}
            />{" "}
            Allow image upload
          </label>

          <label>
            <input
              type="checkbox"
              checked={allowText}
              onChange={(e) => setAllowText(e.target.checked)}
            />{" "}
            Allow text input
          </label>

          <input
            type="number"
            placeholder="Min images"
            value={minImages}
            onChange={(e) => setMinImages(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max images"
            value={maxImages}
            onChange={(e) => setMaxImages(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={allowRandomize}
              onChange={(e) => setAllowRandomize(e.target.checked)}
            />{" "}
            Allow randomize
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
