from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import compressor
import os
from typing import List, Union

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
os.makedirs("temp", exist_ok=True)
os.makedirs("output", exist_ok=True)

last_output_path = None

@app.get("/")
def home():
    return {"message": "DeepCacher API running"}

@app.post("/compress")
async def compress_files(files: Union[UploadFile, List[UploadFile]] = File(...)):
    """
    Accept both single files and folder uploads.
    Compress everything into a single .deepcacher file.
    Returns JSON with file stats and download URL.
    """
    global last_output_path

    if not isinstance(files, list):
        files = [files]

    temp_folder = "temp/uploaded"

    if os.path.exists(temp_folder):
        shutil.rmtree(temp_folder)
    os.makedirs(temp_folder, exist_ok=True)

    file_stats = []

    for file in files:
        input_path = os.path.join(temp_folder, file.filename)
        os.makedirs(os.path.dirname(input_path), exist_ok=True)  
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        size = os.path.getsize(input_path)
        file_stats.append({
            "filename": file.filename,
            "original_size": size
        })

    
    output_filename = "compressed_files.deepcacher"
    output_path = os.path.join("output", output_filename)
    compressor.compress_folder(temp_folder, output_path)
    last_output_path = output_path


    total_compressed = os.path.getsize(output_path)
    total_original = sum(f["original_size"] for f in file_stats) or 1 
    for f in file_stats:
        f["compressed_size"] = round(f["original_size"] / total_original * total_compressed)
        f["compression_ratio"] = round(
            (1 - f["compressed_size"] / f["original_size"]) * 100 if f["original_size"] else 0,
            2
        )

    
    if len(files) == 1:
        return {
            "name": files[0].filename,
            "original_size": file_stats[0]["original_size"],
            "compressed_size": file_stats[0]["compressed_size"],
            "url": "/download"
        }
    else:
        return {
            "output_file": output_filename,
            "files": file_stats,
            "download_url": "/download"
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
