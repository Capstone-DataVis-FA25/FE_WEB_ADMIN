import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Create a function to logout user
const logoutUser = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/login'
    }
}

class ApiClient {
    private instance: AxiosInstance

    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // Add auth token if available
                const token = localStorage.getItem('authToken')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }

                // Add timestamp to request
                config.headers['X-Request-Time'] = new Date().toISOString()

                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // Response interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Handle successful responses
                return response.data
            },
            (error) => {
                // Handle error responses
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    logoutUser()
                }

                if (error.response?.status === 500) {
                    // Handle server errors
                    console.error('Server error occurred')
                }

                return Promise.reject(error)
            }
        )
    }

    // GET request
    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.get(url, config)
    }

    // POST request
    public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.post(url, data, config)
    }

    // PUT request
    public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.put(url, data, config)
    }

    // DELETE request
    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.delete(url, config)
    }

    // PATCH request
    public patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.instance.patch(url, data, config)
    }
}

export default new ApiClient()