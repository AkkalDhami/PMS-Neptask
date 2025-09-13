import { useState } from "react";
import {
  RiSunLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine,
  RiRocketLine,
  RiPriceTag3Line,
  RiQuestionnaireLine,
  RiChatSmileLine,
  RiSurveyLine,
  RiTaskLine,
  RiFlagLine,
  RiCalendarCheckLine,
  RiFolderLine,
  RiBarChartLine,
  RiCheckLine,
  RiNotification3Line,
  RiLoopRightLine,
  RiMoonClearLine,
  RiListCheck2,
  RiTeamLine,
  RiShareForwardLine,
  RiStarLine,
  RiBuildingLine,
  RiShieldCheckLine,
  RiDoubleQuotesL,
  RiDoubleQuotesR,
  RiStarFill,
  RiMapPinLine,
  RiMailLine,
  RiPhoneLine,
  RiGithubLine,
  RiLinkedinLine,
  RiTwitterXLine,
} from "react-icons/ri";
import { FaRocket, FaInfoCircle } from "react-icons/fa";
import FeatureCard from "../../components/home/FeatureCard";
import ThemeToggle from "../../components/layout/ThemeToggle";
import { ChevronRight } from "lucide-react";
import AppLogo from "../../components/home/AppLogo";
import Faq from "../../components/home/Faq";
import HeroSection from "../../components/home/HeroSection";

const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pricingToggle, setPricingToggle] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const togglePricing = () => {
    setPricingToggle(!pricingToggle);
  };

  const features = [
    {
      icon: <RiTaskLine className="text-2xl text-orange-600" />,
      title: "Smart Task Management",
      description: "Easily add, edit, and delete tasks to stay organized.",
      color: "bg-orange-600/10",
    },
    {
      icon: <RiPriceTag3Line className="text-2xl text-pink-600" />,
      title: "Task Prioritization",
      description: "Prioritize tasks based on their importance and urgency.",
      color: "bg-pink-600/10",
    },

    {
      icon: <RiCalendarCheckLine className="text-2xl text-green-600" />,
      title: "Smart Scheduling",
      description: "Set due dates with intelligent reminders.",
      color: "bg-green-600/10",
    },
    {
      icon: <RiFolderLine className="text-2xl text-cyan-600" />,
      title: "Categories",
      description: "Organize tasks into categories for easy navigation.",
      color: "bg-cyan-600/10",
    },
    {
      icon: <RiBarChartLine className="text-2xl text-yellow-600" />,
      title: "Advanced Analytics",
      description: "Track tasks using bar and pie charts for insights.",
      color: "bg-yellow-600/10",
    },
    {
      icon: <RiCheckLine className="text-4xl text-emerald-600" />,
      title: "Progress Tracking",
      description: "Track your daily, weekly, and monthly achievements.",
      color: "bg-emerald-600/10",
    },
    {
      icon: <RiNotification3Line className="text-2xl text-orange-600" />,
      title: "Task Reminders",
      description: "Set reminders to never forget an important task.",
      color: "bg-orange-600/10",
    },
    {
      icon: <RiLoopRightLine className="text-2xl text-red-600" />,
      title: "Recurring Tasks",
      description:
        "Set up recurring tasks for daily, weekly, or monthly tasks.",
      color: "bg-red-600/10",
    },
    {
      icon: <RiMoonClearLine className="text-2xl text-indigo-600" />,
      title: "Dark Mode",
      description: "Switch to a dark mode for a more immersive experience.",
      color: "bg-indigo-600/10",
    },
    {
      icon: <RiListCheck2 className="text-4xl text-emerald-600" />,
      title: "Subtasks",
      description:
        "Break tasks into actionable steps with nested checklist functionality.",
      color: "bg-emerald-600/10",
    },
    {
      icon: <RiTeamLine className="text-4xl text-orange-600" />,
      title: "Collaboration",
      description: "Share tasks with team members and collaborate on projects.",
      color: "bg-orange-600/10",
    },
    {
      icon: <RiShareForwardLine className="text-4xl text-pink-600" />,
      title: "Task Sharing",
      description: "Share tasks with team members and collaborate on projects.",
      color: "bg-pink-600/10",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager, TechCorp",
      text: "NepTask transformed how our team manages projects. The analytics feature helps us identify bottlenecks and improve our workflow efficiency.",
      initials: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Independent Designer",
      text: "As a freelancer juggling multiple clients, NepTask keeps me organized and on schedule. The recurring tasks feature is a game-changer for my business.",
      initials: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Director, GlobalCo",
      text: "Our productivity increased by 35% after implementing NepTask across our department. The team collaboration features are exceptional.",
      initials: "ER",
    },
  ];

  return (
    <div className="min-h-full flex w-full items-center flex-col justify-center font-poppins transition-colors duration-300 bg-gray-50 to-gray-100 dark:bg-slate-950">
      {/* Header */}
      <header className="fixed backdrop-blur-lg top-0 left-0 right-0 border-b-2 border-zinc-600/10 w-full z-40 bg-white/80 dark:bg-slate-900/80">
        <nav className="mx-auto px-5 max-w-[1400px] py-3 flex justify-between items-center">
          <AppLogo />

          <div className="flex items-center gap-0 sm:gap-4">
            <ul className="hidden md:flex">
              <li className="inline-block cursor-pointer mx-2 text-[16px] hover:text-orange-600 transition-colors">
                <a href="#home">Home</a>
              </li>
              <li className="inline-block cursor-pointer mx-2 text-[16px] hover:text-orange-600 transition-colors">
                <a href="#features">Features</a>
              </li>
              <li className="inline-block cursor-pointer mx-2 text-[16px] hover:text-orange-600 transition-colors">
                <a href="#pricing">Pricing</a>
              </li>
              <li className="inline-block cursor-pointer mx-2 text-[16px] hover:text-orange-600 transition-colors">
                <a href="#testimonials">Testimonials</a>
              </li>
              <li className="inline-block cursor-pointer mx-2 text-[16px] hover:text-orange-600 transition-colors">
                <a href="#faq">FAQ</a>
              </li>
              <li className="inline-block cursor-pointer mx-2 text-[16px] hover:text-orange-600 transition-colors">
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => (window.location.href = "/login")}
              className="group items-center relative border border-zinc-500/30 hidden md:flex px-6 group py-1.5 cursor-pointer rounded-md duration-300 transition-all">
              Get Started
              <div className="absolute -bottom-px via-orange-600 left-1/2 -translate-x-1/2 h-px w-[calc(100%-2px)] bg-gradient-to-r from-transparent group-hover:via-orange-600 group-hover:dark:via-zinc-100 to-transparent"></div>
            </button>
            <ThemeToggle />
          </div>

          <button
            className="md:hidden cursor-pointer text-2xl p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            onClick={toggleSidebar}>
            <RiMenuLine />
          </button>
        </nav>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-50 z-50 transition-opacity ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}>
        <div
          className={`h-full w-64 max-w-xs shadow-xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sidebar-content bg-white dark:bg-slate-900`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-orange-600">NepTask.</h3>
            </div>
            <button
              className="text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              onClick={closeSidebar}>
              <RiCloseLine className="text-2xl" />
            </button>
          </div>

          <nav className="p-6 max-h-[90vh] overflow-y-auto">
            <ul className="space-y-4">
              <li onClick={closeSidebar}>
                <a
                  href="#home"
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Home
                </a>
              </li>
              <li onClick={closeSidebar}>
                <a
                  href="#features"
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Features
                </a>
              </li>
              <li onClick={closeSidebar}>
                <a
                  href="#pricing"
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li onClick={closeSidebar}>
                <a
                  href="#testimonials"
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Testimonials
                </a>
              </li>
              <li onClick={closeSidebar}>
                <a
                  href="#faq"
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li onClick={closeSidebar}>
                <a
                  href="#contact"
                  className="block py-2 text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  Contact
                </a>
              </li>

              <li
                onClick={closeSidebar}
                className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  onClick={() => (window.location.href = "./html/login.html")}
                  className="border-[2px] border-orange-500 px-8 group py-3 cursor-pointer rounded-full font-semibold hover:bg-orange-500 text-orange-600 hover:text-white duration-300 transition-all w-full">
                  Get Started{" "}
                  <RiArrowRightLine className="ml-2 inline group-hover:translate-x-1 transition-transform" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>


      <HeroSection />
      {/* Feature Section */}
      <section id="features" className="py-20 w-full ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-orange-500 uppercase font-bold mb-8 flex items-center justify-center gap-2">
              <RiRocketLine className="text-3xl" /> <span>Features</span>
            </h2>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">
              Everything You Need to Stay Productive
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive task management platform comes packed with
              professional tools designed to streamline your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 w-full ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-orange-500 uppercase font-bold mb-8 flex items-center justify-center gap-2">
              <RiPriceTag3Line className="text-3xl" /> <span>Pricing</span>
            </h2>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">
              Choose the Perfect Plan
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Flexible pricing options designed to fit your needs, from
              individuals to enterprise teams.
            </p>
          </div>

          {/* Pricing toggle */}
          <div className="flex justify-center items-center mb-12">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Monthly
            </span>
            <label className="relative inline-flex items-center mx-4 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={pricingToggle}
                onChange={togglePricing}
              />
              <div className="w-14 h-7 peer-focus:outline-none border-2 border-orange-500 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-orange-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Annually
              <span className="text-orange-600 text-sm font-bold ml-1">
                Save 20%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className=" rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <RiRocketLine className="text-orange-500 mr-2" />
                  Free
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Perfect for getting started
                </p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $0
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2 pb-1">
                    /month
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Up to 5 tasks</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Basic task management</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Calendar view</span>
                  </li>
                  <li className="flex items-center text-gray-400 dark:text-gray-500">
                    <RiCloseLine className="text-gray-400 mr-3" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center text-gray-400 dark:text-gray-500">
                    <RiCloseLine className="text-gray-400 mr-3" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <button
                  onClick={() =>
                    (window.location.href = "./html/workspace.html")
                  }
                  className="w-full py-3 px-6 rounded-xl border-2 border-orange-500 text-gray-900 dark:text-white font-medium hover:border-orange-600 transition-colors hover:text-orange-600">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className=" relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-orange-500">
              <div className="absolute top-0 right-0 bg-orange-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                MOST POPULAR
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <RiStarLine className="text-yellow-400 mr-2" /> Pro
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Perfect for individuals and freelancers
                </p>
                <div className="flex items-end mb-6">
                  {pricingToggle ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        $9.45
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2 pb-1">
                        / annually
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        $12
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2 pb-1">
                        / monthly
                      </span>
                    </>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Unlimited tasks</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Advanced task management</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Multiple views (List, Board, Calendar)</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Recurring tasks</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <button className="w-full py-3 px-6 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            {/* Business Plan */}
            <div className=" rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <RiBuildingLine className="text-orange-500 mr-2" /> Business
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Perfect for teams and organizations
                </p>
                <div className="flex items-end mb-6">
                  {pricingToggle ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        $23.20
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2 pb-1">
                        / annually
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        $29
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2 pb-1">
                        / monthly
                      </span>
                    </>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Custom fields & workflows</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <RiCheckLine className="text-orange-600 mr-3" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <div className="px-8 pb-8">
                <button className="w-full py-3 px-6 rounded-xl border-2 border-orange-500 text-gray-900 dark:text-white font-medium hover:border-orange-600 transition-colors hover:text-orange-600">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="flex items-center justify-center mb-4">
              <RiShieldCheckLine className="text-3xl text-orange-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                14-Day Money-Back Guarantee
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Try any paid plan risk-free. If you're not completely satisfied,
              cancel within 14 days for a full refund.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-tr from-orange-600 to-indigo-600 w-full">
        <div className="text-white py-12 mx-auto rounded-md max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl mb-3 font-extrabold sm:text-4xl md:text-5xl">
              Ready to Boost Your Productivity?
            </h2>
            <p className="mt-6 text-xl text-white/90 max-w-5xl mx-auto">
              Join thousands of teams who are already managing their tasks more
              efficiently. Try our task management system today and experience
              the difference!
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="./html/workspace.html"
                className="inline-flex items-center justify-center px-6 py-4 border-2 border-white text-[15px] sm:text-xl font-medium rounded-full hover:bg-white hover:text-orange-600 transition duration-300">
                Get Started Free 🚀
              </a>
            </div>
          </div>
        </div>
      </section>

      <Faq />
      {/* Testimonial Section */}
      <section id="testimonials" className="py-20 w-full ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-orange-500 uppercase font-bold mb-8 flex items-center justify-center gap-2">
              <RiChatSmileLine className="text-3xl" /> <span>Testimonials</span>
            </h2>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">
              What Our Users Say
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how NepTask has transformed productivity for
              professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card p-8 rounded-xl  border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    <RiStarFill />
                    <RiStarFill />
                    <RiStarFill />
                    <RiStarFill />
                    <RiStarFill />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  <RiDoubleQuotesL className="text-xl text-orange-500 inline mr-1" />
                  {testimonial.text}
                  <RiDoubleQuotesR className="text-xl text-orange-500 inline ml-1" />
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4 flex items-center justify-center text-orange-600 font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 w-full ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-orange-500 uppercase font-bold mb-8 flex items-center justify-center gap-2">
              <RiSurveyLine className="text-3xl" /> <span>Contact Us</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mt-4 mb-6">
                Get in Touch
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Have questions about NepTask? Our team is here to help you find
                the perfect solution for your needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-4">
                    <RiMapPinLine className="text-xl text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">
                      Our Location
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Main Street, Kathmandu Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-4">
                    <RiMailLine className="text-xl text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">
                      Email Us
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      support@NepTask.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-4">
                    <RiPhoneLine className="text-xl text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">
                      Call Us
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg mr-4">
                    <RiChatSmileLine className="text-xl text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">
                      Chat with Us
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Live chat is available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <form className="border border-orange-500/20 p-8 rounded-2xl shadow-sm ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 resize-none rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your message here..."></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 flex gap-3 items-center justify-center text-white font-medium py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t-2 border-orange-500/20 ">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-orange-500">NepTask.</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Empowering your productivity with smart task management and
                insightful analytics.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
                  <RiTwitterXLine />
                </a>
                <a
                  href="https://github.com/AkkalDhami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
                  <RiGithubLine />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
                  <RiLinkedinLine />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Us
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <RiMailLine className="text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    support@NepTask.com
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <RiPhoneLine className="text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    +1 (555) 123-4567
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <RiMapPinLine className="text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    123 Task Street, TO 12345
                  </span>
                </li>
              </ul>
            </div>

            {/* Email Subscription */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Newsletter
              </h3>
              <form className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    id="footerEmail"
                    name="email"
                    className="w-full px-4 py-2 outline-0 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Stay updated with productivity tips
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-orange-500/20 text-center text-gray-600 dark:text-gray-300">
            <div className="text-sm sm:text-lg flex items-center justify-center gap-2 flex-wrap">
              © 2025
              <span className="font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                NepTask.
              </span>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
