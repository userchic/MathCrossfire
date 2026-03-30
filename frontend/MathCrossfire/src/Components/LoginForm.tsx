import { useState, type ChangeEvent, type MouseEventHandler } from "react"
import { ExecuteLogin } from "../Services/HomeService"
import { useNavigate } from "react-router"
import { signIn, store } from "../Store";

export default function LoginForm() {
    const navigate = useNavigate();
    const [Login, setLogin] = useState("")
    const [Password, setPassword] = useState("")
    const [Message, setMessage] = useState("")

    function handleLoginChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setLogin(event.target.value)
    }
    function handlePasswordChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
        setPassword(event.target.value)
    }
    function handleLogin(): void {
        let response = ExecuteLogin(Login, Password)
        response.then((res) => {
            if (res.errors === undefined) {
                if (res.success) {
                    localStorage.setItem("authFlag", "true");
                    localStorage.setItem("login", Login)
                    store.dispatch(signIn(Login))
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
                    <h2>Вход в систему</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    Логин
                                </td>
                                <td>
                                    <input type="text" value={Login} onChange={handleLoginChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Пароль
                                </td>
                                <td>
                                    <input type="password" value={Password} onChange={handlePasswordChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <input type="button" onClick={handleLogin} value="Войти" />
                    {Message}
                </div>
            </div>
        </>
    )
}