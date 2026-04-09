"use client";

interface PostProps {
  title: string;
  description: string;
  price: number;
  location: string;
}

export default function Post({ title, description, price, location }: PostProps) {
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <p>{description}</p>
      <p className="font-semibold mt-2">${price}</p>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  );
}