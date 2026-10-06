'use client';

import Image from 'next/image';

export default function CarCard({ car }: { car: any }) {
  const carId = car._id || car.id || car.key;

  const handleEdit = async () => {
    if (!carId) {
      alert("Error: Car ID is missing!");
      return;
    }

    const newTitle = prompt("Enter new title:", car.title);
    const newDescription = prompt("Enter new description:", car.description);

    if (newTitle && newDescription) {
      try {
        const res = await fetch('/api/cars/' + carId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            image: car.image,
            _rev: car._rev
          }),
        });

        const data = await res.json();
        if (res.ok) {
          window.location.reload();
        } else {
          alert("Error: " + (data.error || "Update failed"));
        }
      } catch (err) {
        console.error(err);
        alert("Network error during update!");
      }
    }
  };

  const handleDelete = async () => {
    if (!carId) {
      alert("Error: Car ID is missing!");
      return;
    }

    if (confirm("Are you sure you want to delete this car?")) {
      try {
       const res = await fetch(`/api/cars/${carId}`, {
  method: 'DELETE',
});
        

        const data = await res.json();
        if (res.ok) {
          window.location.reload();
        } else {
          alert("Error: " + (data.error || "Delete failed"));
        }
      } catch (err) {
        console.error(err);
        alert("Network error during delete!");
      }
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      {car.image && (
        <div className="relative h-48 w-full mb-4">
          <Image 
            src={car.image} 
            alt={car.title || 'Car'} 
            fill 
            className="object-cover rounded-md"
          />
        </div>
      )}
      <h2 className="text-xl font-bold mb-2">{car.title}</h2>
      <p className="text-gray-600 mb-4">{car.description}</p>
      
      <div className="flex gap-2">
        <button 
          onClick={handleEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}