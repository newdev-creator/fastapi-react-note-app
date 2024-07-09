from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from dataclasses import dataclass, asdict
from typing import Union
import json

#===== Structure de données : Dictionnaire indexé par note id =====#
with open("notes.json", "r") as f:
    note_list = json.load(f)

list_notes = {k+1:v for k, v in enumerate(note_list)}

#======================================================================
@dataclass
class Note():
  id: int
  title: str
  subtitle: str
  body_text: str

#======================================================================

app = FastAPI()

# Configurer CORS
origins = [
   "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#====================GET===============================================
@app.get("/total-notes")
async def get_total_notes() -> dict:
  return {"total":len(note_list)}

@app.get("/notes")
async def get_all_notes() -> list[Note]:
  response = []
  for id in list_notes:
    response.append(Note(**list_notes[id]))

  return response

@app.get("/note/{id}")
async def get_list_by_id(id: int = Path(ge=1)) -> Note:
  if id not in list_notes:
    raise HTTPException(status_code=404, detail="Cette note n'existe pas")
   
  return Note(**list_notes[id])

@app.get("/notes/search")
async def search_notes(
  title: Union[str, None] = None,
  subtitle: Union[str, None] = None,
) -> Union[list[Note], None]:
  
  filtered_list = []
  response = []

  # Filtrer par titre
  if title is not None:
      for note in note_list:
          if title.lower() in note["title"].lower():
              filtered_list.append(note)

  # Filtrer par sous-titre
  if subtitle is not None:
      for note in note_list:
          if subtitle.lower() in note["subtitle"].lower():
              filtered_list.append(note)

  if filtered_list:
     for note in filtered_list:
        response.append(Note(**note))
        return response

  raise HTTPException(status_code=404, detail="Aucune note ne répond aux critères de recherche")

#===========================POST============================
@app.post("/note/")
async def create_note(note: Note) -> Note:
  if note.id in list_notes:
    raise HTTPException(status_code=404, detail=f"La note {note.id} existe déjà")
  
  list_notes[note.id] = asdict(note)
  
  return note

#===========================PUT============================
@app.put("/note/{id}")
async def update_note(note: Note, id: int = Path(ge=1)) -> Note:
  if id not in list_notes:
    raise HTTPException(status_code=404, detail=f"La note {id} n'existe pas")
  
  list_notes[id] = asdict(note)

  return note

#===========================DELETE============================
@app.delete("/note/{id}")
async def delete_note(id: int = Path(ge=1)) -> Note:
  if id in list_notes:
    note = Note(**list_notes[id])
    del list_notes[id]
    return note
  
  raise HTTPException(status_code=404, detail=f"La note {id} n'existe pas.")
