// "use client";
// import React, { useState } from "react";

// const initialCart = [
//   {
//     id: 1,
//     img: "/chemo.jpg",
//     title: "Chemistry",
//     desc: "Explore reactions, elements, and formulas.",
//     rating: 4.5,
//     price: 50, // per day price in birr
//     quantity: 1,
//   },
//   {
//     id: 2,
//     img: "/bio.jpg",
//     title: "Biology",
//     desc: "Understand life from cells to systems.",
//     rating: 4.2,
//     price: 50,
//     quantity: 2,
//   },
// ];

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState(initialCart);

//   // Increase quantity
//   const increaseQty = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   // Decrease quantity
//   const decreaseQty = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//   };

//   // Remove item
//   const removeItem = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // Calculate total price
//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-[#0c0c0c] text-white py-12 px-4">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-green-400">Your Cart</h1>

//         {cartItems.length === 0 ? (
//           <p className="text-center text-gray-400 text-xl">
//             Your cart is empty. Add some subjects to get started!
//           </p>
//         ) : (
//           <>
//             <div className="space-y-6">
//               {cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex flex-col md:flex-row bg-[#111111] rounded-xl p-6 gap-6 items-center"
//                 >
//                   <img
//                     src={item.img}
//                     alt={item.title}
//                     className="w-36 h-24 rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-semibold mb-1">
//                       {item.title}
//                     </h2>
//                     <p className="text-gray-400 mb-2">{item.desc}</p>
//                     <p className="text-yellow-400 font-medium mb-2">
//                       Rating: {item.rating} ⭐
//                     </p>
//                     <p className="text-green-400 font-semibold mb-2">
//                       Price: {item.price} birr / day
//                     </p>
//                     <div className="flex items-center gap-4">
//                       <button
//                         onClick={() => decreaseQty(item.id)}
//                         className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
//                         aria-label={`Decrease quantity of ${item.title}`}
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-semibold">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() => increaseQty(item.id)}
//                         className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
//                         aria-label={`Increase quantity of ${item.title}`}
//                       >
//                         +
//                       </button>

//                       <button
//                         onClick={() => removeItem(item.id)}
//                         className="ml-6 text-red-500 hover:text-red-600 font-semibold"
//                         aria-label={`Remove ${item.title} from cart`}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Total & Checkout */}
//             <div className="mt-10 flex flex-col md:flex-row justify-between items-center bg-[#111] rounded-xl p-6">
//               <h3 className="text-2xl font-bold text-green-400">
//                 Total: {totalPrice} birr
//               </h3>
//               <button
//                 onClick={() =>
//                   alert("Proceed to checkout functionality coming soon!")
//                 }
//                 className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition"
//               >
//                 Checkout
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;
