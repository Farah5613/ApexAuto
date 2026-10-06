'use client';

import { FormEvent, useState, useEffect } from 'react';

interface InsertCarProps {
  car?: any;
  onUpdateSuccess?: () => void;
  onAddSuccess?: () => void;
}

export default function InsertCar({ car, onUpdateSuccess, onAddSuccess }: InsertCarProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // هر زمان که کاربری روی دکمه Edit کلیک کرد و car تغییر کرد، فرم پر شود و باز شود
  useEffect(() => {
    if (car) {
      setTitle(car.title || '');
      setDescription(car.description || '');
      setImage(car.image || '');
      setOpen(true); // فرم باز شود تا کاربر بتواند ویرایش کند
    }
  }, [car]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const isEditing = !!car;
      const carId = car?._id || car?.id;
      const url = isEditing ? `/api/cars/${carId}` : '/api/cars';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, image }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setImage('');
        setOpen(false);

        if (isEditing && onUpdateSuccess) {
          onUpdateSuccess();
        } else if (!isEditing && onAddSuccess) {
          onAddSuccess();
        } else {
          window.location.reload();
        }
      } else {
        console.error('Failed to save car');
      }
    } catch (error) {
      console.error('Error saving car:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          // اگر خواست ماشین جدید اضافه کند، فرم پاک شود
          setTitle('');
          setDescription('');
          setImage('');
          setOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        افزودن خودروی جدید
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6 space-y-4">
      <h2 className="text-lg font-bold">{car ? 'ویرایش خودرو' : 'فرم ثبت خودرو'}</h2>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">عنوان خودرو</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border-2 border-black px-3 py-2 rounded text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">توضیحات</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-2 border-black px-3 py-2 rounded text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900  mb-1">لینک تصویر خودرو</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="w-full border-2 border-black px-3 py-2 rounded text-gray-900"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? '... در حال ارسال' : car ? 'ویرایش اطلاعات' : 'ذخیره خودرو'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
