export function processSupabaseData(dataArray: any[]): any[] {
  return dataArray.map((data) => {
    const result = {
      id: data.name ? data.name.toLowerCase() : undefined,
      name: data.name,
      images: [] as Array<{
        url: string;
        month: string;
        year: string;
        description: string;
      }>,
      description: "This is a sample description",
      coordinates: data.geo_coords ? parseCoordinates(data.geo_coords) : null,
    };

    if (data.street_data && data.street_data.length > 0) {
      // Randomly select up to 5 results first
      const selectedResults = getRandomItems(data.street_data, 8);

      result.images = selectedResults.map((item) => {
        const url =
          item.primaryMedia && item.primaryMedia.value
            ? item.primaryMedia.value.replace("src: ", "")
            : "";

        const year = item.standardized_year;
        const month = getRandomMonth();
        const description = item.title.value;

        return { url, month, year, description };
      });

      result.images.sort((a, b) => {
        const yearA = Number(a.year);
        const yearB = Number(b.year);

        if (yearA !== yearB) {
          if (isNaN(yearA) && isNaN(yearB)) return 0;
          if (isNaN(yearA)) return 1;
          if (isNaN(yearB)) return -1;
          return yearA - yearB;
        }

        const monthOrder = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
    }

    return result;
  });
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomMonth(): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[Math.floor(Math.random() * months.length)];
}

function parseCoordinates(coordString: string): [number, number] {
  // Remove degree symbols and split the string into latitude and longitude
  const [lat, lon] = coordString.replace(/°/g, "").split(",");

  // Parse latitude
  const latValue = parseFloat(lat);
  const latDir = lat.trim().slice(-1).toUpperCase();
  const latitude = latDir === "S" ? -latValue : latValue;

  // Parse longitude
  const lonValue = parseFloat(lon);
  const lonDir = lon.trim().slice(-1).toUpperCase();
  const longitude = lonDir === "W" ? -lonValue : lonValue;

  return [latitude, longitude];
}
