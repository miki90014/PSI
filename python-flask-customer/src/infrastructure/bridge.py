import requests
import os
backend_url = os.getenv("BACKEND_URL_EMPLOYEE")
def get_movie_by_id(id):
    response = requests.get(f"{backend_url}/employee/movie/{id}")
    return response.json()

def get_room_by_id(id):
    response = requests.get(f"{backend_url}/employee/room/{id}")
    return response.json()

def get_seat_by_id(id):
    response = requests.get(f"{backend_url}/employee/seat/{id}")
    return response.json()