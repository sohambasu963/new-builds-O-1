# Import Libraries
import requests
from bs4 import BeautifulSoup
import os

# List of all neighbourhoods in the TPL database
neighbourhoods = [
    "Agincourt",
    "Alderwood",
    "Amesbury Park",
    "Annex",
    "Armour Heights",
    "Bayview Village",
    "Beach",
    "Bendale",
    "Birch Cliff",
    "Bloor West Village",
    "Bridle Path-Sunnybrook",
    "Brockton",
    "Cabbagetown",
    "Cedarvale",
    "Clairlea-Golden Mile",
    "Cliffside-Cliffcrest",
    "Danforth",
    "Deer Park",
    "Don Mills",
    "Don Valley Village",
    "Dorset Park",
    "Dovercourt",
    "Downsview",
    "Downtown",
    "Dufferin Grove-Bickford Park",
    "Earlscourt",
    "East York",
    "Eatonville",
    "Elia-Branson",
    "Emery",
    "Eringate",
    "Exhibition",
    "Fairbank",
    "Financial District",
    "Flemingdon Park",
    "Forest Hill",
    "Garrison",
    "Guildwood",
    "Harbour",
    "Henry Farm",
    "High Park",
    "Highland Creek",
    "Hillcrest Village",
    "Humber Bay",
    "Humber Summit",
    "Humber Valley",
    "Islington",
    "Junction",
    "Kensington-Grange",
    "King-Spadina",
    "Kingsway",
    "Knob Hill",
    "Lambton",
    "L’Amoreaux",
    "Lansing",
    "Lawrence Manor",
    "Leaside",
    "Leslieville",
    "Long Branch",
    "Malvern",
    "Maple Leaf",
    "Maryvale",
    "Milliken",
    "Mimico",
    "Mount Dennis",
    "New Toronto",
    "Newtonbrook",
    "North Toronto",
    "Oakridge",
    "Oakwood-Vaughan",
    "Palmerston-Sussex Ulster",
    "Parkdale",
    "Pleasant View",
    "Port Lands",
    "Port Union-West Rouge",
    "Railway Lands",
    "Regent Park",
    "Rexdale",
    "Richview",
    "Riverdale",
    "Rosedale-Moore Park",
    "Rouge",
    "Scarborough Junction",
    "Scarborough Village",
    "Seaton Village",
    "Silverthorn",
    "St. James Town",
    "St. Lawrence",
    "Sunnylea",
    "Sunnyside",
    "Swansea",
    "Thistletown",
    "Thorncliffe Park",
    "Toronto Islands",
    "Trinity Bellwoods",
    "University",
    "Upper Beach",
    "Upper Rouge",
    "West Hill",
    "Weston",
    "Wexford",
    "Willowdale",
    "Woburn",
    "Wychwood-Hillcrest",
    "York Mills",
    "York University-Black Creek",
    "Yorkville",
]


# Basic scraper template
def get_soup(url):
    """
    Fetch the content of a webpage and return a BeautifulSoup object.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return BeautifulSoup(response.content, "html.parser")
    else:
        print(f"Failed to retrieve {url}. Status code: {response.status_code}")
        return None


# Scraper function
def fetch_city_data(city):
    """
    Fetch data for a given city from the specified street_base_url.
    """
    # Replace city name dynamically in the base URL
    street_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6719409"

    try:
        response = requests.get(street_base_url)
        if response.status_code == 200:
            city_data = response.json()
            print(f"Data for {city}:")
            print(city_data)
        else:
            print(
                f"Failed to retrieve data for {city}. Status code: {response.status_code}"
            )
    except Exception as e:
        print(f"Error fetching data for {city}: {e}")


if __name__ == "__main__":
    city = "Alderwood"
    fetch_city_data(city)


# # Save Image Function
# def save_image(image_url, save_path, image_name):
#     """
#     Save an image from a given URL to a specified path.
#     """
#     try:
#         response = requests.get(image_url)
#         if response.status_code == 200:
#             with open(os.path.join(save_path, f"{image_name}.jpg"), "wb") as f:
#                 f.write(response.content)
#             print(f"Image saved: {image_name}")
#         else:
#             print(
#                 f"Failed to retrieve image {image_name}. Status code: {response.status_code}"
#             )
#     except Exception as e:
#         print(f"Error saving image {image_name}: {e}")
