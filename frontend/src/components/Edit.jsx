import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createNote, updateNote } from "../features/notes";

export default function Edit() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes);
  const { id } = useParams();
  const [inputsStates, setInputsStates] = useState({
    title: "",
    subtitle: "",
    body_text: "",
  });
  const [showValidation, setShowValidation] = useState({
    title: false,
    subtitle: false,
    body_text: false,
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (Object.values(inputsStates).every((value) => value)) {
      setShowValidation({
        title: false,
        subtitle: false,
        body_text: false,
      });

      if (id && notes.list) {
        dispatch(updateNote({ ...inputsStates, id: parseInt(id) }));
      } else {
        const newId =
          notes.list.length > 0
            ? Math.max(...notes.list.map((note) => note.id)) + 1
            : 1;
        dispatch(createNote({ ...inputsStates, id: newId }));
        setInputsStates({
          title: "",
          subtitle: "",
          body_text: "",
        });
      }
    } else {
      for (const [key, value] of Object.entries(inputsStates)) {
        if (value.length === 0) {
          setShowValidation((state) => ({ ...state, [key]: true }));
        } else {
          setShowValidation((state) => ({ ...state, [key]: false }));
        }
      }
    }
  }

  useEffect(() => {
    if (id && notes.list && notes.list.length > 0) {
      const existingNote = notes.list.find((note) => note.id === parseInt(id));
      if (existingNote) {
        setInputsStates({
          title: existingNote.title,
          subtitle: existingNote.subtitle,
          body_text: existingNote.body_text,
        });
      } else {
        console.error(`Note with ID ${id} not found.`);
      }
    } else {
      setInputsStates({
        title: "",
        subtitle: "",
        body_text: "",
      });
    }
  }, [id, notes.list]);

  return (
    <div className="w-full p-10">
      <p className="text-slate-100 text-xl mb-4">Ajouter une note</p>

      <form onSubmit={handleSubmit}>
        <label className="mb-2 block text-slate-100" htmlFor="title">
          Le titre
        </label>
        <input
          onChange={(e) =>
            setInputsStates({ ...inputsStates, title: e.target.value })
          }
          className="p-2 text-md block w-full rounded bg-slate-200"
          value={inputsStates.title}
          type="text"
          id="title"
          spellCheck="false"
        />
        {showValidation.title && (
          <p className="text-red-400 mb-2">Veuillez renseigner un titre.</p>
        )}

        <label className="mb-2 mt-4 block text-slate-100" htmlFor="subtitle">
          Le sous-titre
        </label>
        <input
          onChange={(e) =>
            setInputsStates({ ...inputsStates, subtitle: e.target.value })
          }
          className="p-2 text-md block w-full rounded bg-slate-200"
          value={inputsStates.subtitle}
          type="text"
          id="subtitle"
          spellCheck="false"
        />
        {showValidation.subtitle && (
          <p className="text-red-400 mb-2">
            Veuillez renseigner un sous-titre.
          </p>
        )}

        <label className="mb-2 mt-4 block text-slate-100" htmlFor="body_text">
          Contenue de la note
        </label>
        <textarea
          onChange={(e) =>
            setInputsStates({ ...inputsStates, body_text: e.target.value })
          }
          className="w-full min-h-[300px] p-2 rounded bg-slate-200"
          value={inputsStates.body_text}
          id="body_text"
          spellCheck="false"
        ></textarea>
        {showValidation.body_text && (
          <p className="text-red-400 mb-2">Veuillez écrire du contenue.</p>
        )}
        <button className="mt-4 px-3 py-1 bg-slate-100 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
