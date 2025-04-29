import { NextResponse } from "next/server"

export async function GET() {
  // This would normally fetch data from a database
  const bookings = [
    {
      id: "BK-001",
      customer: {
        name: "John & Lisa Davis",
        avatar: "JD",
        email: "john.davis@example.com",
      },
      tour: "Bali Luxury Retreat",
      date: "Jun 15 - Jun 22, 2025",
      travelers: 2,
      status: "Confirmed",
      paymentStatus: "Paid",
      amount: "$9,700",
      bookedOn: "Jan 15, 2025",
    },
    // More bookings...
  ]

  return NextResponse.json({ bookings })
}

export async function POST(request: Request) {
  const data = await request.json()

  // This would normally save to a database
  console.log("Creating new booking:", data)

  return NextResponse.json({
    success: true,
    message: "Booking created successfully",
    booking: {
      id: "BK-" + Math.floor(1000 + Math.random() * 9000),
      ...data,
      createdAt: new Date().toISOString(),
    },
  })
}
