import { useState, type ChangeEvent } from "react"
import { ExecuteRegister } from "../Services/HomeService"
import { useNavigate } from "react-router";
import { signIn, store } from "../Store";


export default function RegistryForm() {

    const navigate = useNavigate();
    const [Name, setName] = useState("")
    const [Surname, setSurname] = useState("")
    const [Fatname, setFatname] = useState("")
    const [Login, setLogin] = useState("")
    const [Password, setPassword] = useState("")
    const [Class, setClass] = useState("1")
    const [Message, setMessage] = useState("")

    function handleNameChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setName(event.target.value)
    }

    function handleSurnameChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setSurname(event.target.value)
    }

    function handleFatnameChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setFatname(event.target.value)
    }

    function handleLoginChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setLogin(event.target.value)
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setPassword(event.target.value)
    }

    function handleClassChange(event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>): void {
        setClass(event.target.value)
    }

    function handleRegistry(): void {
        let res = ExecuteRegister(Login, Password, Name, Surname, Fatname, Class)
        res.then((res) => {
            if (res.errors === undefined) {
                if (res.success) {
                    store.dispatch(signIn(Login))
                    localStorage.setItem("authFlag", "true")
                    localStorage.setItem("login", Login)
                    navigate("/Games")
                }
                else {
                    setMessage(res.message)
                }
            }
            else
                setMessage(Object.values(res.errors)[0])
        })
    }

    return (
        <>
            <div className="centered">
                <div className="block">
                    <h2>Регистрация</h2>
                    <table>
                        <tbody>
                            <tr className="label">
                                <td>
                                    Имя
                                </td>
                                <td>
                                    <input type="text" value={Name} onChange={handleNameChange} />
                                </td>
                            </tr>
                            <tr className="label">
                                <td>
                                    Фамилия
                                </td>
                                <td>
                                    <input type="text" value={Surname} onChange={handleSurnameChange} />
                                </td>
                            </tr>
                            <tr className="label">
                                <td>
                                    Отчество
                                </td>
                                <td>
                                    <input type="text" value={Fatname} onChange={handleFatnameChange} />
                                </td>
                            </tr>
                            <tr className="label">
                                <td>
                                    Логин
                                </td>
                                <td>
                                    <input type="text" value={Login} onChange={handleLoginChange} />
                                </td>
                            </tr>
                            <tr className="label">
                                <td>
                                    Пароль
                                </td>
                                <td>
                                    <input type="password" value={Password} onChange={handlePasswordChange} />
                                </td>
                            </tr>
                            <tr className="label">
                                <td>
                                    Класс
                                </td>
                                <td>
                                    <select value={Class} onChange={handleClassChange}>
                                        <option value={"1"}>1</option>
                                        <option value={"2"}>2</option>
                                        <option value={"3"}>3</option>
                                        <option value={"4"}>4</option>
                                        <option value={"5"}>5</option>
                                        <option value={"6"}>6</option>
                                        <option value={"7"}>7</option>
                                        <option value={"8"}>8</option>
                                        <option value={"9"}>9</option>
                                        <option value={"10"}>10</option>
                                        <option value={"11"}>11</option>
                                        <option value={"not class"}>not class</option>
                                    </select>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <input type="button" onClick={handleRegistry} value="Зарегистрироваться" />
                    {Message}
                </div>
            </div>
        </>
    )
}