// import { NextResponse } from "next/server";
// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI; // ✅ add this in .env.local
// const client = new MongoClient(uri);

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     await client.connect();
//     const db = client.db("realestate"); // database name
//     const collection = db.collection("properties");

//     const result = await collection.insertOne(body);

//     return NextResponse.json(
//       { message: "Property posted successfully", id: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error saving property:", error);
//     return NextResponse.json(
//       { error: "Failed to save property" },
//       { status: 500 }
//     );
//   } finally {
//     await client.close();
//   }
// }
