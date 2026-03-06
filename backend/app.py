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

@app.get("/")
def home():
    return {"message": "DeepCacher API running"}

@app.post("/compress")
async def compress_file(file: UploadFile = File(...)):

    os.makedirs("temp", exist_ok=True)

    input_path = f"temp/{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output_path = compressor.compress(input_path)

    return FileResponse(
        output_path,
        filename="compressed_" + file.filename + ".deepcacher",
        media_type="application/octet-stream"
    )