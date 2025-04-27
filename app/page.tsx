import WorldMap from "./components/map/Map";
import { LiveData } from "./types";

export default async function Home() {
  const API_URL = process.env.API_URL;

  const res = await fetch(`${API_URL}/cdn/live`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    cache: 'no-store',
  });

  const liveData: LiveData[] = await res.json();

  return (
    <div className="w-full h-full">
      <WorldMap data={liveData} />
    </div>
  );
}
