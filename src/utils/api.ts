
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchApi<T>(endpoint: string, params: Record<string, string | number>): Promise<ApiResponse<T>> {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  try {
    const response = await fetch(`/api/${endpoint}?${queryString}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return { data: data as T };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
} 