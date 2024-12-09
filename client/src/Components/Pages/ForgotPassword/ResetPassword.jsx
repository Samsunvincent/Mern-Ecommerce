import { useCallback, useState } from "react"
import { useParams } from "react-router-dom"
import ResetRoute from "../../functionalities/AdminFunctionalities/ResetPasswordRoute"


export default function ResetPassword() {

    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    
    let params = new URLSearchParams(window.location.search);
    let token = params.get('token');
    console.log("token",token)

    const handleResetSubmit = useCallback(() =>{
        const resetRoute = async () =>{
            const data = {
                newPassword,
                confirmPassword
            }
            const ResetPassword = await ResetRoute(data,token)
            console.log("resetTOken",ResetPassword)
        };
        resetRoute()
    })
    return (
        <>
            <div>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                        <form onSubmit={handleResetSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="new-password"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    name="new-password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new password"
                                    required=""
                                    onChange={(e) =>setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm-password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Confirm new password"
                                    required=""
                                    onChange={(e) =>setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}