import cohere
from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv
import json

co = cohere.ClientV2(api_key=os.getenv("COHERE_TOKEN"))

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


supabase = init_supabase()


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


def get_neighbourhood_info(city: str) -> dict:
    """
    Get information about a neighborhood using Cohere's chat API.
    """
    res = co.chat(
        model="command-r-plus-08-2024",
        messages=[
            {
                "role": "user",
                "content": f"You are an expert historian able to tell stories meaningfully and impactfully. You like giving fun facts and often engross the user with your stories. You are omniscient and know everything about Toronto, Canada from the beginning. given a neighbourhood in Toronto, I want you to give a brief description with credible information from the web as well as fun facts and stories about the life in that time. these stories can be fictional but should be relatable to the period of time and be rich in information. Generate a json with the the fields name, description, fun_facts, stories, interactive_questions: Make sure to keep your response brief and concise so it's readable and digestible to the user. Outline the important facts and key information of different time periods, especially the development over time. give be a description of the {city} neighbourhood in Toronto",
            }
        ],
        response_format={
            "type": "json_object",
            "schema": {
                "type": "object",
                "required": [
                    "name",
                    "stories",
                    "fun_facts",
                    "description",
                    "interactive_questions",
                ],
                "properties": {
                    "name": {"type": "string"},
                    "stories": {"type": "string"},
                    "fun_facts": {"type": "array", "items": {"type": "string"}},
                    "description": {"type": "string"},
                    "interactive_questions": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                },
            },
        },
    )
    return res.message.content[0].text


def update_city_data(supabase: Client, city: str, bio_data: dict):
    """
    Update the bio data for an existing neighborhood in the Supabase table.
    """
    try:
        # Define the table name where the data will be updated
        table_name = "neighbourhoods"

        # Prepare the data to update (in this case, updating the bio column)
        data_to_update = {
            "bio": bio_data  # Assuming you want to update the 'bio' field
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
        print(f"Error updating data for {city} in Supabase: {e}")


# Iterate over each neighborhood and process the information
for city in neighbourhoods:
    try:
        # Get information about the neighborhood from Cohere
        bio_data = json.loads(get_neighbourhood_info(city))
        # print(bio_data)
        print(f"Got bio data for {city}")
        # Upload the data to Supabase
        update_city_data(supabase, city, bio_data)
        print(f"Uploaded bio data for {city}")

    except Exception as e:
        print(f"An error occurred for {city}: {e}")
