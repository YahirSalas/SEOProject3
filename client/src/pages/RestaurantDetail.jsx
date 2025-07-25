// src/pages/RestaurantDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurant() {
      const res = await fetch(`http://localhost:5000/api/restaurants/${id}`);
      const data = await res.json();
      setRestaurant(data.restaurant);
      setDeals(data.deals);
      setLoading(false);
    }
    fetchRestaurant();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
      <p className="text-gray-600 mb-4">{restaurant.address}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Deals</h2>
      {deals.length === 0 ? (
        <p>No deals available for this restaurant.</p>
      ) : (
        <div className="space-y-4">
          {deals.map((deal, i) => (
            <div key={i} className="border p-4 rounded shadow-sm bg-white">
              <h3 className="font-bold text-lg">{deal.title}</h3>
              <p className="text-gray-700 mb-2">{deal.description}</p>

              <div className="text-sm text-gray-600 mb-2">
                {deal.discount && <span className="font-medium text-green-700">Discount: {deal.discount}%</span>}
                {deal.price && <span className="font-medium text-green-700 ml-2">Price: ${deal.price}</span>}
              </div>

              <div className="text-sm text-gray-700">
                <strong>Food Type:</strong> {deal.food_types || '—'}
              </div>

              <div className="text-sm text-gray-700 mt-1">
                <strong>Availability:</strong>{' '}
                {deal.availability?.type === 'recurring'
                  ? `Every ${deal.availability.days?.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}`
                  : `${deal.availability?.startDate} → ${deal.availability?.endDate}`}
                {' '}
                {!deal.availability?.isAllDay &&
                  deal.availability?.startTime &&
                  `(${deal.availability.startTime} – ${deal.availability.endTime})`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
