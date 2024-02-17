import AddExpenses from "./pages/AddExpenses/AddExpenses";
import Expenses from "./pages/Expenses/Expenses";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Expenses />} />
            <Route path="/add-expenses" element={<AddExpenses />} />
        </Routes>
    );
};

export default App;

