import type {Metadata} from "next";
import PageWrapper from "./pagewrapper";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined}>;
}

const OG_IMAGE = { url: "/images/pyxis-og.jpg", width: 1200, height: 630, alt: "Pyxis Search Engine" };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const query = searchParams.q;
    const title = typeof query === "string" && query ? `${query} - Books` : "Book Search";
    return {
        title,
        openGraph: { title, images: [OG_IMAGE] },
        twitter: { card: "summary_large_image", title, images: [OG_IMAGE.url] },
    };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND_API || "http://localhost:5000";

export default async function BookSearchPage(props: PageProps){
    const searchParams = await props.searchParams;
    const query = (searchParams.q as string) || "";
    
    let data = null;
    let relatedKeywords: string[]= [];
    let errorMessage = null; 

    if (query) {
        const [searchResponse, autocompleteResponse] = await Promise.allSettled([
            fetch(
                `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=books&page=1`, {next: {revalidate: 600}}
            ),
            fetch(
                `${API_BASE_URL}/autocomplete?q=${encodeURIComponent(query)}&max_results=10`,{next:{revalidate:600}}
            ),
        ]);
        
        if (searchResponse.status === "fulfilled" && searchResponse.value.ok){
            data = await searchResponse.value.json();
        } else {
            errorMessage = "Failed to load the book results."; 
        }
        
        if (autocompleteResponse.status === "fulfilled" && autocompleteResponse.value.ok){
            const autoData = await autocompleteResponse.value.json();
            relatedKeywords = autoData.suggestions || [];
        }
    }

    return (
        <PageWrapper
            data={data}
            relatedKeywords={relatedKeywords}
            errorMessage={errorMessage} 
            query={query}
        />
    );
}