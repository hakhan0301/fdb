const lorum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;
function ContentItem({ text }: { text: string }) {

  return (
    <div className="flex flex-col py-4 gap-4 bg-amber-100 md:border-x border-y border-yellow-600 border-opacity-20">
      <div className="flex flex-row px-4 items-center gap-4">
        <img className="w-12 h-12 rounded-2xl shadow-md" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg" />

        <div className="flex flex-col">
          <h1 className="text-lg font-bold">The Guy's Name</h1>
          <h1 className="text-sm text-gray-600">1/2/2022</h1>
        </div>
      </div>

      <div className="flex flex-row gap-4 px-4">
        <div className="w-12 justify-self-center shrink-0">
          <h1 className="text-center text-xl cursor-pointer hover:text-green-400">^</h1>
          <h1 className="text-center text-xl">3</h1>
          <h1 className="text-center text-xl cursor-pointer hover:text-red-500 rotate-180">^</h1>
        </div>
        <p>{text}</p>

      </div>
    </div>
  )
}



export default function ContentList({ blogPosts }) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col">
        {blogPosts.map(blogPost => <ContentItem {...blogPost} />)}
      </div>
    </div>
  )
}
