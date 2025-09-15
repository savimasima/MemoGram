export type Meme = {
  id: string;
  title: string;
  caption?: string;
  imageUrl?: string;   
  tags?: string[];
  createdAt?: string; 
  sourceLink?: string;
  author?: string;
  subreddit?: string;
};