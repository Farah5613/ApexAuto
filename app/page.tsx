'use client';

import { useEffect, useState } from 'react';
import InsertCar from './components/InsertCar';

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State برای مدیریت حالت ویرایش ماشین
  const [editingCar, setEditingCar] = useState<any>(null);

  // تابع خواندن ماشین‌ها (Read)
  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cars');
      if (!res.ok) {
        throw new Error(`Failed to fetch cars: ${res.status}`);
      }
      const data = await res.json();
      setCars(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // تابع حذف ماشین (Delete)
// (Delete) تابع حذف ماشین
  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این ماشین را حذف کنید؟')) {
      return;
    }

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete car');
      }
      fetchCars();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // تابع انتخاب ماشین برای ویرایش (Update)
  const handleEdit = (car: any) => {
    setEditingCar(car);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSuccess = () => {
    setEditingCar(null);
    fetchCars();
  };

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Luxury & Sports Car Gallery</h1>

      {/* فرم ثبت یا ویرایش خودرو */}
      <div className="mb-8">
        <InsertCar
          car={editingCar}
          onUpdateSuccess={handleUpdateSuccess}
          onAddSuccess={fetchCars}
        />
      </div>

      {cars.length === 0 ? (
        <p className="text-center text-gray-500">No cars found in the database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cars.map((car: any) => (
            <div 
              key={car._id || car.id} 
              className="border p-4 rounded-lg shadow bg-white group hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* دکمه‌های ویرایش و حذف روی کارت */}
              <div className="absolute top-3 right-3 flex gap-2 bg-white/80 p-1 rounded-md shadow-sm">
                <button
                  onClick={() => handleEdit(car)}
                  className="px-2.5 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car._id || car.id)}
                  className="px-2.5 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>

              {car.image && (
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800">{car.title}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {car.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}