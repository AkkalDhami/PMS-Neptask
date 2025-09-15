import { BorderTrail } from "@/components/ui/border-trail";
import { FaRocket } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="mt-0 w-full sm:h-[calc(100vh-64px)] pt-32 pb-20 px-4">
      <div className="flex flex-col items-center gap-7 sm:gap-12 max-w-6xl mx-auto">
        <div className="text-center px-4 sm:px-8 md:px-12 lg:px-16">
      
          <h1 className="text-4xl md:text-6xl font-bold sm:mb-8 bg-gradient bg-clip-text text-transparent">
            Transform Your Productivity
          </h1>

          <p className="text-lg md:text-xl text-center mt-12 max-w-4xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="font-semibold bg-gradient bg-clip-text text-transparent">
              NepTask
            </span>{" "}
            is your all-in-one project management solution designed to
            streamline your workflow and boost productivity. With a sleek,
            intuitive interface, NepTask helps teams stay focused, organized,
            and on track. Effortlessly plan tasks, collaborate in real time, and
            sync across all your devices — whether you're in the office or on
            the go.
          </p>
        </div>

        <div className="flex w-full sm:w-auto text-center flex-col px-3 sm:flex-row sm:mt-5 gap-6 sm:mb-8">
          <button
            onClick={() => (window.location.href = "/login")}
            className="relative h-[70px] flex items-center justify-center gap-4 w-[250px] overflow-hidden rounded-md border border-zinc-950/10 bg-white text-zinc-700 outline-hidden dark:border-zinc-50/20 dark:bg-zinc-950 dark:text-zinc-300">
            <span> Get Started </span>
            <FaRocket className="text-lg text-orange-600" />
            <BorderTrail
              className="bg-linear-to-l from-orange-200 via-orange-500 to-orange-200 dark:from-orange-400 dark:via-orange-500 dark:to-orange-700"
              size={120}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
