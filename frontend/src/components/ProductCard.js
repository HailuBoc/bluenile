export default function ProductCard({ image, title, location, price }) {
  return (
    <div className="cursor-pointer hover:scale-105 transform transition duration-300 ease-out">
      <div className="relative h-60 w-full overflow-hidden rounded-xl shadow-md">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold">{location}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-sm font-medium text-gray-800">{price}</p>
      </div>
    </div>
  );
}
