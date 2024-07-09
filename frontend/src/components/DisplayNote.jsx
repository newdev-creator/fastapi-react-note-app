import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteNoteById } from "../features/notes";

export default function DisplayNote() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes);
  const { id } = useParams();
  const noteId = parseInt(id, 10);
  const actualNote = notes.list?.find((note) => note.id === noteId);

  return (
    <div className="p-10">
      <Link
        to="/"
        className="px-2 py-1 text-slate-800 bg-slate-300 rounded mr-2"
      >
        Notes
      </Link>
      <Link
        to={`/editer/${id}`}
        className="px-2 py-1 text-slate-200 bg-green-600 rounded mr-2"
      >
        Mettre à jour
      </Link>
      <button
        onClick={() => {
          dispatch(deleteNoteById(id));
          navigate("/");
        }}
        className="px-2 py-1 text-slate-200 bg-red-600 rounded mr-2"
      >
        Supprimer
      </button>
      <p className="text-slate-100 text-4xl mb-2 mt-8">{actualNote?.title}</p>
      <p className="text-slate-200 text-xl mb-4">{actualNote?.subtitle}</p>
      <p className="text-slate-300">{actualNote?.body_text}</p>
    </div>
  );
}
