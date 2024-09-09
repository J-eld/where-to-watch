import { geolocation } from "@vercel/functions";
export function GET(request: Request) {
  const location = geolocation(request);

  return new Response(JSON.stringify(location));
}
