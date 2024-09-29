export function processPeopleImages(dataArray: any[]): any[] {
  return dataArray.map((data) => {
    const result = {
      image: data.primaryMedia.value.replace("src: ", ""),
      title: data.title.value,
      year: "",
      month: "",
    };

    const date = parseDate(data.date);
    result.year = date[0];
    result.month = date[1];

    return result;
  });
}

function parseDate(dateString: string): [string, string] {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date,
  );
  return [year, month];
}
