import { useEffect, useState } from "react";
import { getExpensesFromServer } from "../../service/expenseService";
import { Expense } from "../../model/expense";
import styles from "./Expense.module.css";
import { useNavigate } from "react-router-dom";

interface TotalPerPerson {
    [payeeName: string]: number;
}

const Expenses = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [perPersonExpense, setPerPersonExpense] = useState<TotalPerPerson>({});
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const data = await getExpensesFromServer();
        const total: number = calculateTotalAmountSpent(data);
        const totalExpensePerPerson: TotalPerPerson = calculateTotalAmountSpentPerPerson(data);
        setPerPersonExpense(totalExpensePerPerson);
        setTotalExpense(total);
        setExpenses(data);
    };

    const calculateTotalAmountSpent = (expenses: Expense[]): number => {
        return expenses.reduce((total, expense) => total + expense.price, 0);
    };

    const calculateTotalAmountSpentPerPerson = (expenses: Expense[]): TotalPerPerson => {
        const totalPerPerson: TotalPerPerson = {};
        expenses.forEach((expense) => {
            const { payeeName, price } = expense;
            if (totalPerPerson[payeeName]) {
                totalPerPerson[payeeName] += price;
            } else {
                totalPerPerson[payeeName] = price;
            }
        });
        return totalPerPerson;
    };

    const getOwedMoney = () => {
        const values = Object.values(perPersonExpense);
        const difference = Math.abs(values[0] - values[1]);
        return difference;
    };

    const onAddBtnClick = () => {
        navigate("/add-expenses");
    };
    return (
        <div>
            <div className={styles.addBtnContainer}>
                <button className={styles.addBtn} onClick={onAddBtnClick}>
                    Add
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className={styles.tableCell}>Date</th>
                        <th className={styles.tableCell}>Product Purchased</th>
                        <th className={styles.tableCell}>Price</th>
                        <th className={styles.tableCell}>Payee</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((e) => (
                        <tr key={e.id}>
                            <td className={styles.tableCell}>{e.setDate}</td>
                            <td className={styles.tableCell}>{e.product}</td>
                            <td className={styles.tableCell}>{e.price}</td>
                            <td className={styles.tableCell}>{e.payeeName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr></hr>
            <div className={styles.row}>
                <div className={styles.resultCell}>Total:</div>
                <div className={styles.resultCell}>{totalExpense}</div>
            </div>
            {Object.entries(perPersonExpense).map(([payeeName, totalAmount]) => (
                <div key={payeeName} className={styles.row}>
                    <div className={styles.resultCell}>{payeeName} paid:</div>
                    <div className={styles.resultCell}>{totalAmount}</div>
                </div>
            ))}
            {Object.keys(perPersonExpense).length > 0 && (
                <div className={styles.row}>
                    <div className={styles.resultCell}>{`Pay ${Object.keys(perPersonExpense).reduce(
                        (maxKey, key) =>
                            perPersonExpense[key] > perPersonExpense[maxKey] ? key : maxKey
                    )}:`}</div>
                    <div className={styles.resultCell}>{getOwedMoney()}</div>
                </div>
            )}
        </div>
    );
};

export default Expenses;

