import axios from "axios";
import { Expense, Person } from "../model/expense";
import { NewExpense } from "../pages/AddExpenses/AddExpenses";

export const getExpensesFromServer = async () => {
    const response = await axios
        .get<Expense[]>("http://localhost:3000/items")
        .then((response) => response.data);
    return response;
};

export const getUsers = async () => {
    const response = await axios
        .get<Person[]>("http://localhost:3000/people")
        .then((response) => response.data);
    return response;
};

export const addNewExpense = async (newItem: NewExpense) => {
    const response = await axios
        .post<Expense>("http://localhost:3000/items", newItem, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.data);
    return response;
};

