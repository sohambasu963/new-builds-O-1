// fetch from 10,000+ images of people -> every time you reload you will get a new memory made by a person.
// the memories in toronto are so rich in culture and history.

// connecting new with old, because we create an instagram like experience if people from then could share pictures

// structure : primaryMaker (poster), primaryMedia(media), title (caption), date (date)
// if no date then pick a random date from 1955-1986

// Elton John : https://digitalarchive.tpl.ca/internal/media/dispatcher/1995177/full
export async function GET() {
  // Fetch the JSON data from the given URL
  const res = await fetch(
    "https://digitalarchive.tpl.ca/search/*/objects/json?filter=classifications%3APicture%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6718023",
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // Parse the JSON data
  const data = await res.json();

  // Check if the results array exists and has data
  if (data.count > 0 && data.results.length > 0) {
    const totalResults = data.results.length;
    const numberOfImagesToFetch = Math.min(15, totalResults);
    const randomImages = [];

    // Create a copy of the results array to avoid modifying the original
    const availableResults = [...data.results];

    for (let i = 0; i < numberOfImagesToFetch; i++) {
      // Randomly select an object from the available results
      const randomIndex = Math.floor(Math.random() * availableResults.length);
      const randomObject = availableResults.splice(randomIndex, 1)[0];

      // Process the random object
      const processedImage = {
        primaryMaker: randomObject.primaryMaker,
        primaryMedia: randomObject.primaryMedia,
        title: randomObject.title,
        date: randomObject.date || getRandomDate(1955, 1986),
      };

      randomImages.push(processedImage);
    }

    // Return the random objects as a JSON response
    return new Response(JSON.stringify({ data: randomImages }), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // Return an error if no results are found
    return new Response(JSON.stringify({ error: "No results found." }), {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }
}

// Helper function to generate a random date between two years
function getRandomDate(start: number, end: number) {
  const year = Math.floor(Math.random() * (end - start + 1) + start);
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Simplification: all months have 28 days
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
