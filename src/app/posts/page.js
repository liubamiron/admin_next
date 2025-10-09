'use client'

import { useQueryClient } from '@tanstack/react-query'
import {useState} from "react";
import {usePosts} from "../../hooks/usePosts";

export default function PostsPage() {
    const [postId, setPostId] = useState(null)
    const queryClient = useQueryClient()
    const { data, status, isFetching, error } = usePosts()

    return (
        <main className="flex flex-col items-center justify-center min-h-screen pt-24 px-4">
            <h1 className="text-3xl font-bold mb-4">Posts</h1>

            {status === 'loading' && <p>Loading...</p>}
            {status === 'error' && <p className="text-red-500">Error: {error.message}</p>}
            {status === 'success' && (
                <div className="w-full max-w-xl space-y-2">
                    {data.map((post) => (
                        <p key={post.id}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPostId(post.id)
                                }}
                                className={`hover:underline ${
                                    queryClient.getQueryData(['post', post.id])
                                        ? 'font-bold text-green-600'
                                        : 'text-gray-800'
                                }`}
                            >
                                {post.title}
                            </a>
                        </p>
                    ))}
                </div>
            )}

            {isFetching && <p className="mt-2 text-sm text-gray-500">Background Updating...</p>}

            {postId && (
                <div className="mt-6 p-4 border rounded w-full max-w-xl bg-gray-50">
                    <h2 className="font-bold">Selected Post ID: {postId}</h2>
                </div>
            )}
        </main>
    )
}
