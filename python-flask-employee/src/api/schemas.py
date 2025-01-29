from jsonschema import validate

moviesSchema = {
    "type": "object",
    "properties": {
        "ID": {"type": "integer"},
        "title": {"type": "string"},
        "imageURL": {"type": "string"},
    },
    "required": ["ID", "title"],
}
