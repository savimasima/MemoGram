export type MemeApiItem = {
    postLink: string;
    subreddit: string;
    title: string;
    url: string;       
    nsfw: boolean;
    spoiler: boolean;
    author: string;
    ups: number;
    preview?: string[]; 
  };
  
  export type MemeApiList =
    | { count: number; memes: MemeApiItem[] }
    | MemeApiItem; 
  
  const BASE = "https://meme-api.com";
  
  export async function fetchMemes(opts?: {
    count?: number;            
    subreddit?: string;        
    signal?: AbortSignal;
  }): Promise<MemeApiItem[]> {
    const count = Math.min(Math.max(opts?.count ?? 12, 1), 50);
    const path = opts?.subreddit
      ? `/gimme/${encodeURIComponent(opts.subreddit)}/${count}`
      : `/gimme/${count}`;
  
    const res = await fetch(`${BASE}${path}`, { signal: opts?.signal });
    if (!res.ok) throw new Error(`Meme API error ${res.status}`);
  
    const data: MemeApiList = await res.json();
    return "memes" in data ? data.memes : [data];
  }
  