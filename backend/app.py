from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import compressor
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("temp", exist_ok=True)

last_output_path = None


@app.get("/")
def home():
    return {"message": "DeepCacher API running"}


@app.post("/compress")
async def compress_file(file: UploadFile = File(...)):
    global last_output_path

    input_path = f"temp/{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # run compression
    output_path = compressor.compress(input_path)
    last_output_path = output_path

    # stats
    original_size = os.path.getsize(input_path)
    compressed_size = os.path.getsize(output_path)

    compression_ratio = round(
        (1 - (compressed_size / original_size)) * 100, 2
    )

    return {
        "filename": file.filename,
        "original_size": original_size,
        "compressed_size": compressed_size,
        "compression_ratio": compression_ratio
    }


@app.get("/download")
def download_file():
    global last_output_path

    if not last_output_path:
        return {"error": "No file compressed yet"}

    return FileResponse(
        last_output_path,
        filename=os.path.basename(last_output_path),
        media_type="application/octet-stream"
    )
