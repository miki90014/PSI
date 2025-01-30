import json
import jwt
import requests

COGNITO_REGION = "us-east-1" # dodac region
USER_POOL_ID = "us-east-1_cerLz9VIH" # dodac user pool 
JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json" # zmienic url

response = requests.get(JWKS_URL)
jwks = response.json()

ALLOWED_ROUTES = {
    "employee": ["/api/employee"],
    "customer": ["/api/customer"],
    "administrator": ["/api/employee", "/api/customer"]
}

def lambda_handler(event, context):
    token = event.get("authorizationToken", "").replace("Bearer ", "")
    path = event.get("path", "")

    if not token:
        return {"statusCode": 401, "body": "Unauthorized: No token"}

    try:
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]

        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            return {"statusCode": 401, "body": "Unauthorized: Invalid token"}

        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))

        decoded_token = jwt.decode(token, public_key, algorithms=["RS256"], audience="your-client-id")
        groups = decoded_token.get("cognito:groups", [])

        for group in groups:
            if path in ALLOWED_ROUTES.get(group, []):
                return {
                    "statusCode": 200,
                    "body": json.dumps({"message": "Authorized", "user": decoded_token})
                }

        return {"statusCode": 403, "body": "Forbidden: No access"}

    except Exception as e:
        print("Authorization error:", str(e))
        return {"statusCode": 401, "body": "Unauthorized: Invalid token"}
