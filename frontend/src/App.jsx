import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getNotesFromAPI } from "./features/notes";
import NotesList from "./components/NotesList";
import Sidebar from "./components/Sidebar";
import SideNotes from "./components/SideNotes";
import DisplayNote from "./components/DisplayNote";
import Edit from "./components/Edit";

function App() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes);

  if (!notes.list) {
    dispatch(getNotesFromAPI());
  }

  console.log(notes);
  return (
    <div className="bg-slate-800 min-h-screen flex">
      <BrowserRouter>
        <Sidebar />
        <SideNotes />
        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/editer" element={<Edit />} />
          <Route path="/editer/:id" element={<Edit />} />
          <Route path="/note/:id" element={<DisplayNote />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
