import { Suspense } from "react";
import CandidatesPage from "./CandidatesPage";

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <CandidatesPage />
        </Suspense>
    );
}
