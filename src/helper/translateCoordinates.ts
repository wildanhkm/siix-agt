type LatLng = {
  lat: number;
  lng: number;
}

// latitude = y
// longitude = x
// Each degree of latitude will be approximately 111300 meters
export default function translateCoordinates(
  x: number,
  y: number,
  originLat: number,
  originLng: number,
  latPerPixel: number,
  lngPerPixel: number
): LatLng {
  console.log('Math.sin(1.3004538) :>> ', Math.sin(1.3004538));
  const lat = originLat + y * latPerPixel;
  const lng = originLng + x * lngPerPixel;
  return { lat, lng };
}