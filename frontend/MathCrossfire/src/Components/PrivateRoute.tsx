import { Navigate, Outlet, useLocation } from "react-router";



export const PrivateRoute = () => {

    return (
        <>
            {
                localStorage.getItem("authFlag") === "true" === true ?
                    <Outlet />
                    :
                    <Navigate to="/login" replace />
            }
        </>
    )
};