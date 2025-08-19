// import { connectDB } from "../lib/mongodb";
// import Property from "../model/Property";

// // POST: Add a new property
// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json(); // get form data from frontend
//     const property = new Property(body);
//     await property.save();

//     return new Response(JSON.stringify({ success: true, property }), {
//       status: 201,
//     });
//   } catch (error) {
//     console.error("Error posting property:", error);
//     return new Response(JSON.stringify({ success: false, error }), {
//       status: 500,
//     });
//   }
// }

// // GET: Get all properties
// export async function GET() {
//   try {
//     await connectDB();

//     const properties = await Property.find();
//     return new Response(JSON.stringify({ success: true, properties }), {
//       status: 200,
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ success: false, error }), {
//       status: 500,
//     });
//   }
// }
