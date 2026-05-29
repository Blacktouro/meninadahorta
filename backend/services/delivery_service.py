import os
import requests

ORS_API_KEY = os.getenv("ORS_API_KEY")

BASE_ADDRESS = os.getenv(
    "BASE_ADDRESS",
    "Beco do Aterro S/N, 2525-792 Peniche, Portugal"
)

BASE_LAT = os.getenv("BASE_LAT")
BASE_LNG = os.getenv("BASE_LNG")


def geocode_address(address):

    url = "https://api.openrouteservice.org/geocode/search"

    params = {
        "api_key": ORS_API_KEY,
        "text": address,
        "boundary.country": "PT",
        "size": 1
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    if not data.get("features"):
        return None

    feature = data["features"][0]

    coords = feature["geometry"]["coordinates"]

    return {
        "lng": coords[0],
        "lat": coords[1],
        "label": feature["properties"].get(
            "label",
            address
        )
    }


def get_origin_coordinates():

    if BASE_LAT and BASE_LNG:

        return {
            "lat": float(BASE_LAT),
            "lng": float(BASE_LNG),
            "label": BASE_ADDRESS
        }

    return geocode_address(BASE_ADDRESS)


def get_destination_coordinates(data, morada):

    destination_lat = data.get("destination_lat")
    destination_lng = data.get("destination_lng")

    if destination_lat and destination_lng:

        return {
            "lat": float(destination_lat),
            "lng": float(destination_lng),
            "label": "Ponto escolhido no mapa"
        }

    return geocode_address(morada)


def get_distance_km(origin, destination):

    url = "https://api.openrouteservice.org/v2/directions/driving-car/json"

    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [
            [origin["lng"], origin["lat"]],
            [destination["lng"], destination["lat"]]
        ]
    }

    response = requests.post(
        url,
        json=body,
        headers=headers,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    route = data["routes"][0]["summary"]

    return {
        "distance_km": round(route["distance"] / 1000, 2),
        "duration_min": round(route["duration"] / 60)
    }


def calculate_delivery_fee(distance_km, subtotal):

    if subtotal >= 50 and distance_km <= 5:
        return 0

    if distance_km <= 3:
        return 2.50

    if distance_km <= 6:
        return 3.50

    if distance_km <= 10:
        return 5.00

    if distance_km <= 15:
        return 7.00

    return None


def process_delivery_calculation(data):

    morada = data.get("morada", "").strip()

    subtotal = float(data.get("subtotal", 0))

    origin = get_origin_coordinates()

    destination = get_destination_coordinates(
        data,
        morada
    )

    distance_data = get_distance_km(
        origin,
        destination
    )

    distance_km = distance_data["distance_km"]

    duration_min = distance_data["duration_min"]

    delivery_fee = calculate_delivery_fee(
        distance_km,
        subtotal
    )

    total = subtotal + (delivery_fee or 0)

    return {
        "success": True,
        "distance_km": distance_km,
        "duration_min": duration_min,
        "delivery_fee": delivery_fee,
        "total": round(total, 2)
    }
