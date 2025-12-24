import { useQuery } from '@tanstack/react-query'

export function usePosts() {
    return useQuery({
        queryKey: ['top-products'],
        queryFn: async () => {
            const res = await fetch(
                'https://activecaresupplies.techphproject.com/api/top-products',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        // 'X-API-Key': '023ef43c0b85b92518b5a30e6d947a9a8db3d28760716b1b0d590cfa57b1b61c',
                    },
                    credentials: 'include',
                }
            )

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.message || 'Failed to fetch top products')
            }

            const json = await res.json()
            return json.data
        },
        staleTime: 1000 * 60, // 1 minute caching for test
    })
}
