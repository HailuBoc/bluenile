// import { NextResponse } from "next/server";
// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// let client;

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     if (!client) {
//       client = new MongoClient(uri);
//       await client.connect();
//     }

//     const db = client.db("realestate");
//     const collection = db.collection("properties");

//     const result = await collection.insertOne(body);

//     return NextResponse.json(
//       { message: "Property posted successfully", id: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ API error:", error);
//     return NextResponse.json(
//       { error: "Failed to save property", details: error.message },
//       { status: 500 }
//     );
//   }
// }
