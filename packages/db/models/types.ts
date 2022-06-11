
export interface TextPost {
  type: 'text',
  body: string
}

export interface LinkPost {
  type: 'link',
  body: {
    title: string,
    url: string,
  }
}

export type PostContent = TextPost | LinkPost;