import Markdown from "react-markdown";

const md = `
# BnuuyMemes
#### By Titanplayz

## About
This website was made to showcase and archive a niche section of TETR.IO's community, who edit videos to use SFX and music from TETR.IO. These are posted in the thread called [bnuuy](https://discord.com/channels/673303546107658242/917245246449016853) under the funposting channel of [TETR.IO's discord](https://discord.com/invite/tetrio).
###
This site is made as a personal project, just thought it would be cool to try new things like learning nextjs and databases and stuff, as well as parsing data from discord.


## Acknowledgements
This would not be possible without the creator and maintainer of the thread, [ZaptorZap](https://zaptorz.app), so a great deal of thanks goes out to him.

Also want to credit [fily.gif]() for coming up with the original idea for creating such a website, and who was actively working on their own version for a long time before I created this.

Finally I thank everyone who has posted any of these edits or memes.
###
TETR.IO - [tetr.io](https://tetr.io)

TETR.IO's Discord - [Invite link](https://discord.com/invite/tetrio)

Icons - [The noun project](https://thenounproject.com)
#
### Design heavily inspired by:
Tetra Channel  - [ch.tetr.io](https://ch.tetr.io)

As well as the FAQ (created by ZaptorZap) - [tetrio.github.io/faq](https://tetrio.github.io/faq)

## Guidelines
Please respect everyone who uses this website, and do not create or spam unecessary tags, or ruin the experience of others, as well as being respectful in the bnuuy thread.

### Contact / Report
If you want to report or suggest anything just send it on the bnuuy thread or feel free to dm me (titanplayz) on discord.

Report issues regarding the website by creating a new [github issue here](https://github.com/TitanPlayz100/BnuuyMemes/issues)

## Contributing
Feel free to make any suggestions or merge requests, I'll most likely accept them. 

`

export default function InfoPage() {
  return <div className="m-5 md:mx-65 text-text-second text-lg pb-20">
    <Markdown components={{
      h1: ({ node, ...props }) => <h1 className="text-text text-6xl font-bold pt-5" {...props} />,
      h2: ({ node, ...props }) => <h2 className="text-text text-4xl font-semibold py-2 pt-8" {...props} />,
      h3: ({ node, ...props }) => <h3 className="text-text text-2xl font-semibold py-2" {...props} />,
      h4: ({ node, ...props }) => <h4 className="text-text-second text-xl font-semibold pb-2" {...props} />,
      p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
      li: ({ node, ...props }) => <li className="list-disc" {...props} />,
      a: ({ node, ...props }) => <a className="text-blue-400 underline" {...props} />,
    }}>{md}</Markdown>
  </div>
}
