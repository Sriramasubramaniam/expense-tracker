import { ChangeEvent, useEffect, useMemo, useState } from "react";
import styles from "./AddExpenses.module.css";
import { addNewExpense, getUsers } from "../../service/expenseService";
import { Expense, Person } from "../../model/expense";
import { getTodaysDate } from "./utility";
import { useNavigate } from "react-router-dom";

export interface NewExpense extends Omit<Expense, "id"> {}

const initialFormData: NewExpense = {
    payeeName: "",
    product: "",
    price: 0,
    setDate: getTodaysDate(),
};

const AddExpenses = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<Person[]>([]);
    const [formData, setFormData] = useState<NewExpense>(initialFormData);
    useEffect(() => {
        init();
    }, []);

    const userOptions = useMemo(() => {
        return users.map((user) => <option value={user.name}>{user.name}</option>);
    }, [users]);

    const init = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            payeeName: event.target.value,
        }));
    };

    const onInputChange = (key: string, event: ChangeEvent<HTMLInputElement>) => {
        const value = key === "price" ? parseInt(event.target.value) : event.target.value;
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    const onChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            setDate: event.target.value,
        }));
    };
    const onClose = () => {
        navigate("/");
    };
    const onSubmit = async () => {
        const response = await addNewExpense(formData);
        if (response) {
            navigate("/");
        }
    };
    return (
        <div className={styles.column}>
            <div className={styles.topCard}>
                <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "700" }}>
                    Add New Item
                </div>
                <div style={{ color: "red", fontWeight: "700" }}>
                    Read the below instructions before proceeding:
                </div>
                <div>Make sure you fill all the fields where * is provided</div>
            </div>
            <div className={styles.card}>
                <div style={{ fontWeight: "700" }}>
                    Name<span style={{ color: "red" }}>*</span>
                </div>
                <div>
                    <select value={formData.payeeName} onChange={onSelectChange}>
                        {userOptions}
                    </select>
                </div>
            </div>
            <div className={styles.card}>
                <div style={{ fontWeight: "700" }}>
                    Product purchased<span style={{ color: "red" }}>*</span>
                </div>
                <div>
                    <input
                        value={formData.product}
                        className={styles.inputElement}
                        onChange={(e) => onInputChange("product", e)}
                    />
                </div>
            </div>
            <div className={styles.card}>
                <div style={{ fontWeight: "700" }}>
                    Price<span style={{ color: "red" }}>*</span>
                </div>
                <div>
                    <input
                        value={formData.price}
                        className={styles.inputElement}
                        type={"number"}
                        onChange={(e) => onInputChange("price", e)}
                    />
                </div>
            </div>
            <div className={styles.card}>
                <div style={{ fontWeight: "700" }}>
                    Date<span style={{ color: "red" }}>*</span>
                </div>
                <div>
                    <input
                        value={formData.setDate}
                        className={styles.inputElement}
                        type={"date"}
                        onChange={onChangeDate}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div>
                    <button
                        className={styles.button}
                        disabled={!formData.price || !formData.product || !formData.setDate}
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div>
                    <button className={styles.button} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExpenses;

