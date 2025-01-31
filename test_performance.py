from locust import HttpUser, task, between, constant, LoadTestShape

API_ENDPOINT = "/test_performance"


class LoadTest(HttpUser):
    """
    Test obciążeniowy - symuluje umiarkowany ruch użytkowników.
    """

    wait_time = between(1, 2)  # Użytkownicy czekają 1-2 sekundy między żądaniami

    @task
    def load_test_endpoint(self):
        self.client.get(API_ENDPOINT)


class StressTest(HttpUser):
    """
    Test stresowy - maksymalne obciążenie serwera.
    """

    wait_time = constant(0.1)  # Maksymalna liczba żądań

    @task
    def stress_test_endpoint(self):
        self.client.get(API_ENDPOINT)


class StagedLoadShape(LoadTestShape):
    """
    Definiuje niestandardowy wzór wzrostu obciążenia:
    - stopniowy wzrost co 30 sek. do maksymalnej liczby użytkowników.
    """

    stages = [
        {"duration": 30, "users": 10, "spawn_rate": 5},  # 10 użytkowników po 30 sek.
        {"duration": 60, "users": 50, "spawn_rate": 10},  # 50 użytkowników po 60 sek.
        {"duration": 90, "users": 100, "spawn_rate": 20},  # 100 użytkowników po 90 sek.
        {
            "duration": 120,
            "users": 200,
            "spawn_rate": 50,
        },  # 200 użytkowników po 120 sek.
    ]

    def tick(self):
        run_time = self.get_run_time()

        for stage in self.stages:
            if run_time < stage["duration"]:
                return stage["users"], stage["spawn_rate"]

        return None


# python -m locust -f test_performance.py --headless -u 100 -r 10 --run-time 2m --host http://localhost:5001/customer (API GATEWAY, test trwa 2 minuty)
