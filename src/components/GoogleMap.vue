<script setup lang="ts">
import { GoogleMap, CustomMarker } from 'vue3-google-map';
import proj4 from 'proj4';
import { onMounted, ref, Ref } from 'vue';
import pixelToWebMercator from '../helper/pixelToWebMercator';

type RobotType = {
  title: string;
  x: number;
  y: number;
  heading: number;
  label?: string;
  showInMap?: boolean;
};

type RobotMarkerType = {
  title: string;
  position: {
    lat: number;
    lng: number;
  };
  heading: number;
  label?: string;
  showInMap?: boolean;
};

const API_KEY = '';
const BUILDING_CENTER_LAT = 1.3016000023376049;
const BUILDING_CENTER_LNG = 103.77836792559908;
const SCALE_FACTOR = 0.22;
const zoom = 19;
const robotMarkers: Ref<RobotMarkerType[]> = ref([]);
const data: Ref<RobotType> = ref({
  title: '',
  x: 0,
  y: 0,
  heading: 0,
  label: '',
  showInMap: true,
});

const convertRobotCoords = (
  pixelX: number,
  pixelY: number,
  originLat: number,
  originLon: number,
  pixelScale: number
): number[] => {
  let [originX, originY] = proj4('EPSG:4326', 'EPSG:3857', [originLon, originLat]);
  let [mercatorX, mercatorY] = pixelToWebMercator(pixelX, pixelY, originX, originY, pixelScale);
  let [lon, lat] = proj4('EPSG:3857', 'EPSG:4326', [mercatorX, mercatorY]);
  return [lat, lon];
};

const robots: Ref<RobotType[]> = ref([
  {
    title: 'Robot 001',
    x: 406,
    y: 334,
    heading: 0,
    showInMap: true,
  },
  {
    title: 'Robot 002',
    x: 1101,
    y: 613,
    heading: 60,
    showInMap: true,
  },
  {
    title: 'Robot 003',
    x: 922,
    y: 946,
    heading: 240,
    showInMap: true,
  },
  {
    title: 'Robot 004',
    x: 863,
    y: 324,
    heading: 330,
    showInMap: true,
  },
]);

const addNewRobot = () => {
  const [lat, lng] = convertRobotCoords(
    data.value.x,
    data.value.y,
    BUILDING_CENTER_LAT,
    BUILDING_CENTER_LNG,
    SCALE_FACTOR
  );
  const payload = {
    label: data.value.title,
    title: data.value.title,
    heading: data.value.heading,
    position: {
      lng,
      lat,
    },
    showInMap: data.value.showInMap,
  };

  data.value = {
    title: '',
    x: 0,
    y: 0,
    heading: 0,
    label: '',
    showInMap: true,
  };
  return robotMarkers.value.push(payload);
};

const toggleRobotVisibility = (index: number) => {
  robotMarkers.value[index].showInMap = !robotMarkers.value[index].showInMap;
};

const removeRobot = (index: number) => {
  robotMarkers.value.splice(index, 1);
};

onMounted(() => {
  proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
  proj4.defs('EPSG:32648', '+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs +type=crs');
  robotMarkers.value = robots.value.map((robot) => {
    const [lat, lng] = convertRobotCoords(
      robot.x,
      robot.y,
      BUILDING_CENTER_LAT,
      BUILDING_CENTER_LNG,
      SCALE_FACTOR
    );

    return {
      label: robot.title,
      title: robot.title,
      heading: robot.heading,
      position: {
        lng,
        lat,
      },
      showInMap: robot.showInMap,
    };
  });
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="mb-8 bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Add New Robot</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Robot Title</label>
          <input
            v-model="data.title"
            type="text"
            id="title"
            placeholder="Robot title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="x" class="block text-sm font-medium text-gray-700">X Position</label>
          <input
            v-model="data.x"
            type="number"
            id="x"
            placeholder="Robot X position"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="y" class="block text-sm font-medium text-gray-700">Y Position</label>
          <input
            v-model="data.y"
            type="number"
            id="y"
            placeholder="Robot Y position"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label for="heading" class="block text-sm font-medium text-gray-700">Heading</label>
          <input
            v-model="data.heading"
            type="number"
            id="heading"
            placeholder="Robot heading"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div class="flex items-center">
          <input
            v-model="data.showInMap"
            type="checkbox"
            id="showInMap"
            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label for="showInMap" class="ml-2 block text-sm text-gray-900">Show in Map</label>
        </div>
      </div>
      <button
        @click="addNewRobot"
        class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add new robot
      </button>
    </div>

    <div class="mb-8 bg-white shadow-md rounded-lg overflow-hidden">
      <h2 class="text-2xl font-bold p-4 bg-gray-50">Robot Information</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Long
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lat
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Heading
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Show in Map
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(robot, index) in robotMarkers" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">{{ robot.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ robot.position.lng.toFixed(6) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ robot.position.lat.toFixed(6) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ robot.heading }}°</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="robot.showInMap"
                  @change="toggleRobotVisibility(index)"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="removeRobot(index)"
                  class="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-8">
      <GoogleMap
        :api-key="API_KEY"
        class="w-full h-[600px] rounded-lg shadow-lg"
        :center="{ lat: BUILDING_CENTER_LAT, lng: BUILDING_CENTER_LNG }"
        :zoom="zoom"
      >
        <CustomMarker
          v-for="(marker, index) in robotMarkers.filter((m) => m.showInMap)"
          :key="index"
          :options="marker"
        >
          <div :style="{ textAlign: 'center', transform: `rotate(${marker.heading}deg)` }">
            <div class="text-md font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
              {{ marker.title }}
            </div>
            <img
              src="https://agarrobot.com/wp-content/uploads/2023/11/Agar-Robot-top-view.png"
              alt="Robot"
              class="h-12 mt-2"
            />
          </div>
        </CustomMarker>
      </GoogleMap>
    </div>
  </div>
</template>
