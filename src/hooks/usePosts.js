import { useQuery } from '@tanstack/react-query'

export function usePosts() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts')
            if (!res.ok) throw new Error('Failed to fetch posts')
            return res.json()
        },
    })
}
