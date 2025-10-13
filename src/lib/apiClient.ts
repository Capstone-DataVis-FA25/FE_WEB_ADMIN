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
    private isRefreshing = false
    private failedQueue: Array<{
        resolve: (value?: unknown) => void
        reject: (reason?: unknown) => void
    }> = []

    constructor() {
        // Use environment variable for API base URL, fallback to /api for proxy
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
                return response.data.data;
            },
            async (error) => {
                const originalRequest = error.config

                // Handle unauthorized access (401)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    // If we're already refreshing, queue this request
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject })
                        }).then(token => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token
                            return this.instance(originalRequest)
                        }).catch(err => {
                            return Promise.reject(err)
                        })
                    }

                    originalRequest._retry = true
                    this.isRefreshing = true

                    try {
                        const refreshToken = localStorage.getItem('refreshToken')
                        if (refreshToken) {
                            // Try to refresh the token
                            const response = await axios.post(
                                `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh`,
                                { refreshToken }
                            )

                            const { access_token } = response.data
                            localStorage.setItem('authToken', access_token)

                            // Process the queue
                            this.processQueue(null, access_token)

                            // Retry the original request
                            originalRequest.headers['Authorization'] = 'Bearer ' + access_token
                            return this.instance(originalRequest)
                        } else {
                            // No refresh token, logout
                            this.processQueue(new Error('No refresh token'), null)
                            logoutUser()
                        }
                    } catch (refreshError) {
                        // Refresh failed, logout
                        this.processQueue(refreshError as Error, null)
                        logoutUser()
                        return Promise.reject(refreshError)
                    } finally {
                        this.isRefreshing = false
                    }
                }

                if (error.response?.status === 500) {
                    // Handle server errors
                    console.error('Server error occurred')
                }

                return Promise.reject(error)
            }
        )
    }

    private processQueue(error: Error | null, token: string | null = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })

        this.failedQueue = []
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