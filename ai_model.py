import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

result = fal_client.subscribe(
    "fal-ai/flux-2/klein/4b/base/edit/lora",
    arguments={
        "prompt": "Remove the background from the image",
        "model_name": None,
        "loras": [{
            "path": "https://huggingface.co/fal/flux-2-klein-4B-background-remove-lora/resolve/main/flux-background-remove-lora.safetensors",
            "scale": 1.1
        }],
        "embeddings": [],
        "image_urls": ["https://your-image.png"]
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
