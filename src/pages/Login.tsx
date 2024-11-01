"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2 } from "lucide-react"
import axios from "axios"
import qs from "qs";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        setIsLoading(false);
        return;
      }

      const formData = {
        email,
        password
      }
      console.log(formData);
  
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/token`,
        qs.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const token = response.data.access_token;
      sessionStorage.setItem("token", token);
  
      navigate("/QueryAmi");
    } catch (error: any) {
      console.error("Error response:", error.response);
  
      if (error.response && error.response.data && error.response.data.detail) {
        const errorMessages = error.response.data.detail.map((err: any) => {
          return `${err.loc[1]}: ${err.msg}`;
        });
        setErrorMessage(errorMessages.join(", "));
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-500 p-2 rounded-full">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Sign in to QueryAmie</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-200">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <a onClick={() => {navigate("/ForgotPassword")}} className="cursor-pointer text-sm text-blue-400 hover:text-blue-300">
              Forgot your password?
            </a>
          </div>
          {errorMessage && <p className="text-red-600 text-sm mt-2.5 text-center">{errorMessage}</p>}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a onClick={() => {navigate("/Register")}} className="cursor-pointer text-blue-400 hover:text-blue-300">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}