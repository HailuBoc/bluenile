// import { connectToDB } from "@/lib/database"; // your DB connection function
// import Car from "@/models/Car"; // your Car model

// export async function POST(req, { params }) {
//   const { id } = params; // get car ID from URL
//   try {
//     await connectToDB();

//     const car = await Car.findById(id);
//     if (!car)
//       return new Response(JSON.stringify({ message: "Car not found" }), {
//         status: 404,
//       });

//     car.likes = (car.likes || 0) + 1;
//     await car.save();

//     return new Response(JSON.stringify({ likes: car.likes }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: error.message }), {
//       status: 500,
//     });
//   }
// }
