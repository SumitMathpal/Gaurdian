from pathlib import Path
import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

from ai.face.embedding import generate_embedding


# --------------------------------
# Project root
# --------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]


# --------------------------------
# Qdrant
# --------------------------------

client = QdrantClient(
    path=str(BASE_DIR / "qdrant_data")
)

COLLECTION_NAME = "missing_person_faces"


def insert_face_embedding(
    image_path: str,
    missing_person_id: str
):

    # --------------------------------
    # 1. Generate face embedding
    # --------------------------------

    embedding = generate_embedding(image_path)

    if embedding is None:
        raise ValueError(
            "Could not generate face embedding"
        )

    print("Embedding generated successfully")
    print("Embedding dimension:", len(embedding))


    # --------------------------------
    # 2. Create Qdrant UUID
    # --------------------------------

    qdrant_id = str(
        uuid.uuid5(
            uuid.NAMESPACE_URL,
            missing_person_id
        )
    )


    # --------------------------------
    # 3. Insert into Qdrant
    # --------------------------------

    client.upsert(
        collection_name=COLLECTION_NAME,

        points=[
            PointStruct(
                id=qdrant_id,

                vector=embedding.tolist(),

                payload={
                    "missing_person_id": missing_person_id
                }
            )
        ]
    )


    print("Face embedding inserted successfully")
    print("Qdrant ID:", qdrant_id)
    print("MongoDB Missing Person ID:", missing_person_id)


# --------------------------------
# Test
# --------------------------------

if __name__ == "__main__":

    missing_person_id = "6a7b00bfa79dc89eb833b48a"

    image_path = "ai/face/test.png"

    insert_face_embedding(
        image_path,
        missing_person_id
    )