import { headers } from "next/headers";
import Card from "./(components)/Card";

const host = headers().get("host");
const protocol = headers().get("x-forwarded-proto");
export const baseUrl = `${protocol}://${host}`;

const getData = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/vehicles`);

    return res.json();
  } catch (error) {
    console.log(error);
  }
};
export default async function Home() {
  const data = await getData();

  console.log("DENEMEEEEEEEEEEE>>>>>>>", data);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="header">NEXT CARS</p>
      </div>
      {/* ÜRÜNLER */}
      <div className="container">
        {data?.data.map((vehicle) => (
          <Card vehicle={vehicle} key={vehicle._id} baseUrl={baseUrl} />
        ))}
      </div>
    </main>
  );
}
