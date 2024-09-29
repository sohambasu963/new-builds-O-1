# Import Libraries
import requests
from bs4 import BeautifulSoup
import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
import re

# Load .env file from the root directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Access the environment variables
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")


def init_supabase() -> Client:
    """
    Initialize the connection to Supabase.
    """
    return create_client(SUPABASE_URL, SUPABASE_KEY)


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
    street_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6719409"
    people_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6718023"
    dwellings_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6714631"
    festivals_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6715063"
    automobiles_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6712759"
    industry_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6714425"
    public_buildings_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6718211"
    retail_stores_base_url = f"https://digitalarchive.tpl.ca/search/*/objects/json?filter=geoNeighbourhood%3A{city.replace(' ', '%20')}%3BsubjectThesFilter%3Ahttp%25255C%3A%252F%252Fnodes.emuseum.com%252FY8SQECAV%252Fapis%252Femuseum%252Fnetwork%252Fv1%252Fvocabularies%252FtermMaster6719376"

    try:
        response = requests.get(retail_stores_base_url)
        if response.status_code == 200:
            return response.json()
        else:
            print(
                f"Failed to retrieve data for {city}. Status code: {response.status_code}"
            )
            return None
    except Exception as e:
        print(f"Error fetching data for {city}: {e}")
        return None


# def fetch_source_details(source_id):
#     """
#     Fetch detailed data for a given source ID from the second endpoint.
#     """
#     detailed_url = f"https://digitalarchive.tpl.ca/objects/{source_id}/json"

#     try:
#         response = requests.get(detailed_url)
#         if response.status_code == 200:
#             return response.json()
#         else:
#             print(
#                 f"Failed to retrieve details for Source ID {source_id}. Status code: {response.status_code}"
#             )
#             return None
#     except Exception as e:
#         print(f"Error fetching details for Source ID {source_id}: {e}")
#         return None


def update_city_data(supabase: Client, city: str, data: dict, field_name: str):
    """
    Update the bio data for an existing neighborhood in the Supabase table.
    """
    try:
        # Define the table name where the data will be updated
        table_name = "neighbourhoods"

        # Prepare the data to update (in this case, updating the bio column)
        data_to_update = {
            f"{field_name}": data  # Assuming you want to update the 'bio' field
        }

        # Update the row where the 'name' matches the city
        response = (
            supabase.table(table_name).update(data_to_update).eq("name", city).execute()
        )

        # Check if the update was successful
        if response.get("status_code", 200) == 200 and response.get("data"):
            print(f"Data updated successfully for {city}: {response}")
        else:
            print(
                f"Failed to update data for {city}: {response.get('error', 'Unknown error')}"
            )

    except Exception as e:
        pass
        # print(f"Error updating data for {city} in Supabase: {e}")


def extract_year(display_date_value):
    """
    Extract 4 consecutive digits (representing a year) from the displayDate value.
    """
    match = re.search(
        r"\b\d{4}\b", display_date_value
    )  # Search for 4 consecutive digits
    if match:
        return match.group(0)  # Return the year in "YYYY" format
    else:
        return "Year not found"


def fetch_and_combine_data_for_city(city: str):
    """
    Fetch and combine all data for a given city, including source details for each result.
    Filter out results where no valid year is found in the 'displayDate'.
    """

    # Fetch data for the city
    city_data = fetch_city_data(city)

    if city_data and "results" in city_data:
        valid_results = []  # List to store valid results

        for result in city_data["results"]:
            display_date = result.get("displayDate", {}).get("value")
            if display_date:
                year = extract_year(display_date)
                if year != "Year not found":  # Only include results with a valid year
                    result["standardized_year"] = (
                        year  # Optionally, store the year in the result
                    )
                    valid_results.append(result)  # Add valid result to the list

        # Print or return the filtered valid results
        # print(f"Valid results for {city}: {valid_results}")
        return valid_results
    else:
        print("No results found.")
        return []

    ## Additional Source Details
    # if city_data and "results" in city_data:
    #     for result in city_data["results"]:
    #         source_id = result["sourceId"]["value"]

    #         # Fetch the detailed data using the source_id
    #         detailed_data = fetch_source_details(source_id)

    #         if detailed_data:
    #             # Combine the 'result' entry with 'detailed_data'
    #             combined_data = {
    #                 **result,
    #                 **detailed_data["object"][0],
    #             }  # Merge dictionaries
    #             combined_data_list.append(
    #                 combined_data
    #             )  # Add the combined data to the list
    # else:
    #     print(f"No data found for {city}")

    return city_data


def insert_combined_data_to_supabase(
    supabase: Client, city: str, combined_data_list: list
):
    """
    Insert combined data for a specific city into the Supabase table.
    """
    try:
        # Define the table name where the data will be stored
        table_name = "neighbourhoods"

        # Prepare the data to insert
        data_to_insert = {
            "name": city,
            "street_data": combined_data_list,  # Store the entire list of combined data as JSONB
        }

        # Insert the data into the Supabase table
        response = supabase.table(table_name).insert(data_to_insert).execute()
        print(f"Data inserted successfully for {city}: {response}")
    except Exception as e:
        pass
        # print(f"Error inserting data for {city} into Supabase: {e}")


if __name__ == "__main__":
    # Initialize Supabase connection
    supabase = init_supabase()
    # Loop through all cities in the neighbourhoods list
    for city in neighbourhoods:
        print(f"Processing data for {city}...")

        # Fetch and combine all data for the city
        combined_data_list = fetch_and_combine_data_for_city(city)

        if combined_data_list:
            # Upload all combined data to the Supabase table after processing the entire city
            update_city_data(
                supabase, city, combined_data_list, field_name="retail_stores"
            )
            print(f"Completed processing for {city}.\n")
