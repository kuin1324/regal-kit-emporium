"""Uploadt public/collectie en public/thumbs naar de Lovable asset-CDN.

Padschema: /collectie/x.webp -> /__l5e/assets-v1/<AID>/collectie__x.webp
Gebruik: python3 scripts/upload-photos-cdn.py
"""
import boto3, os, sys, threading
from concurrent.futures import ThreadPoolExecutor
from botocore.config import Config

PID = "4201af0c-cf08-4206-bc81-ae8c5b2ca2cb"
BUCKET = os.environ["LOVABLE_ASSETS_BUCKET"]
AID = "a750d26f-5765-4be1-a189-53d7875775ce"
PREFIX = f"a/v1/{PID}/{AID}"
ROOT = os.getcwd()

session = boto3.session.Session(
    aws_access_key_id=os.environ["LOVABLE_ASSETS_AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["LOVABLE_ASSETS_AWS_SECRET_ACCESS_KEY"],
    aws_session_token=os.environ.get("LOVABLE_ASSETS_AWS_SESSION_TOKEN"),
    region_name="auto",
)
local = threading.local()


def client():
    if not hasattr(local, "c"):
        local.c = session.client(
            "s3",
            endpoint_url=os.environ["LOVABLE_ASSETS_ENDPOINT_URL"],
            config=Config(max_pool_connections=64, retries={"max_attempts": 5}),
        )
    return local.c


TYPES = {".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".avif": "image/avif"}

files = []
for base in ("public/collectie", "public/thumbs"):
    for dirpath, _, names in os.walk(base):
        for n in names:
            ext = os.path.splitext(n)[1].lower()
            if ext in TYPES:
                p = os.path.join(dirpath, n)
                files.append((p, PREFIX + "/" + os.path.relpath(p, "public").replace("/", "__"), TYPES[ext]))

print(f"{len(files)} bestanden", flush=True)
done = 0
lock = threading.Lock()
errors = []


def up(job):
    global done
    path, key, ct = job
    try:
        client().upload_file(path, BUCKET, key, ExtraArgs={"ContentType": ct, "CacheControl": "public, max-age=31536000, immutable"})
    except Exception as e:  # noqa: BLE001
        errors.append((path, str(e)))
    with lock:
        done += 1
        if done % 500 == 0:
            print(f"… {done}/{len(files)}", flush=True)


with ThreadPoolExecutor(max_workers=48) as ex:
    list(ex.map(up, files))

print(f"klaar: {done} geüpload, {len(errors)} fouten", flush=True)
for e in errors[:20]:
    print("FOUT", e, file=sys.stderr)
