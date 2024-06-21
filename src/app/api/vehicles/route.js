import { NextResponse } from "next/server";
import Vehicle from "../(models)/Vehicle";

export async function GET() {
  try {
    const vehicles = await Vehicle.find();

    return NextResponse.json({
      message: "Araçlar bulundu",
      data: vehicles,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Araç verilerini alırken bir sorun oluştu",
      },
      { status: 500 }
    );
  }
}
