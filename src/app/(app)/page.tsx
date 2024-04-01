import AvatarStack from "@/components/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { EnvelopeClosedIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Profile Information Box */}
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 my-24">
        <AvatarStack
          className="relative h-32 w-32 md:w-[230px] md:h-[230px]"
          images={["/images/ProfilePicture2.jpg", "/images/ProfilePicture.jpg"]}
        />
        <div className="mt-4 space-y-2">
          {/* Name */}
          <h1 className="font-cal text-2xl md:text-5xl font-bold dark:text-white text-center">
            Royce Mathew
          </h1>

          {/* Badges */}
          <div className="flex items-center space-x-2">
            <Badge>🎓 3rd Year Student</Badge>
            <Badge>💻 Software Engineer</Badge>
            <Badge>🎮 Game Developer</Badge>
          </div>

          {/* Contact Information */}
          <div className="flex justify-between items-center ">
            <div className="space-x-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://github.com/royce-mathew"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.github className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link
                  href="https://www.linkedin.com/in/royce-mathew"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInLogoIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href="mailto:royce1mathew@gmail.com">
                  <Icons.envelope className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <Button asChild variant="outline">
              <Link
                href="/files/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.pnpm className="mr-2 h-4 w-4" /> Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="bg-black bg-opacity-5 dark:bg-opacity-15 flex flex-col items-center justify-center p-5 border">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          About Me
        </h1>

        <article className="prose dark:prose-invert max-w-[950px]">
          <h2>Introduction</h2>
          <p>
            I'm Royce Mathew, a passionate software developer currently in his
            third year studying at @OntarioTech University. I am currently
            working as a Cloud Developer at{" "}
            <span className="hyperlink"> RBC</span>.
          </p>
          <p>
            I love working on games in my free time and contributing to open
            source software. I have been developing games and programming on the
            ROBLOX Engine for 5 years.
          </p>
          <h2>Experience</h2>
          <p>
            Throughout my career, I have recieved multiple opportunities to work
            on a variety of fields in Computer Science. I have worked on
            projects in fields ranging from Web Development, Game Development,
            and Neural Networks, and Low Level Programming.
          </p>
          <h3>Game Development Career</h3>
          <p>
            I have worked on multiple games utilizing the ROBLOX engine. One of
            my commissions were on the game known as{" "}
            <a href="https://www.roblox.com/games/6573910231/Project-Star">
              Project Star
            </a>{" "}
            which has over 20 Million player visits.
          </p>
        </article>
      </div>
    </main>
  );
}
