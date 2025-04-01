import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX } from 'react-icons/fi';
import { createProduct } from '../services/api';

const SellItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    size: '',
    condition: '',
    brand: '',
  });

  const categories = [
    'Women',
    'Men',
    'Kids',
    'Accessories',
    'Shoes',
  ];

  const conditions = ['new', 'like new', 'good', 'fair'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);

      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      images.forEach((image) => {
        data.append('images', image);
      });
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await createProduct(data);
      navigate(`/product/${response.data.id}`);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-domine font-bold text-gray-900 mb-6">
          Sell an Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            <div className="grid grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-w-1 aspect-h-1">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
              {previews.length < 8 && (
                <div className="aspect-w-1 aspect-h-1">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer"
                  >
                    <FiUpload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="e.g., Nike Air Max Sneakers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field mt-1"
              placeholder="Describe your item in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="e.g., M, L, 42, 8.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="e.g., Nike, Zara, H&M"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="btn-primary w-full"
          >
            {loading ? 'Publishing...' : 'Publish Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellItem;
