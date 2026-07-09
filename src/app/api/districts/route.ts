import { NextResponse } from "next/server";

const districts = [
  { name: "Dhaka", delivery_charge: 80 },
  { name: "Chattogram", delivery_charge: 150 },
  { name: "Sylhet", delivery_charge: 150 },
  { name: "Rajshahi", delivery_charge: 150 },
  { name: "Barishal", delivery_charge: 150 },
  { name: "Khulna", delivery_charge: 150 },
  { name: "Rangpur", delivery_charge: 150 },
  { name: "Mymensingh", delivery_charge: 150 },
];

export async function GET() {
  return NextResponse.json(districts);
}
