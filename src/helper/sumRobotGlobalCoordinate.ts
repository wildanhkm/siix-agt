type PayloadType = {
  originLat: number;
  originLng: number;
  robotLat: number;
  robotLng: number;
};
export default function sumRobotGlobalCoordinate(payload: PayloadType) {
  return { lat: payload.originLat + payload.robotLat, lng: payload.originLng + payload.robotLng };
}
