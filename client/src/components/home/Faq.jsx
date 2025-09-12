import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { RiQuestionnaireLine } from "react-icons/ri";
const Faq = () => {
  const faqItems = [
    {
      question: "How does NepTask compare to other task management tools?",
      answer:
        "NepTask stands out with its smart scheduling, comprehensive analytics dashboard, and seamless team collaboration features. It's designed for efficiency, collaboration, and productivity, offering a unique blend of features for all types of users.",
    },
    {
      question: "How secure is my data with NepTask?",
      answer:
        "Security is our top priority. NepTask employs end-to-end encryption for all data, both in transit and at rest. We maintain SOC 2 Type II, GDPR, and HIPAA compliance for organizations with strict security requirements.",
    },
    {
      question: "What kind of analytics does NepTask provide?",
      answer:
        "Our analytics suite offers comprehensive insights into productivity patterns at individual and team levels. You'll get visual representations of task completion rates, time spent per category, bottleneck identification, and resource allocation efficiency.",
    },
    {
      question: "What makes NepTask's mobile experience unique?",
      answer:
        "Our mobile app is designed for productivity on the go with offline capabilities, voice command task creation, and location-based reminders. The interface adapts to your usage patterns, bringing frequently used features to the forefront.",
    },
    {
      question: "What customization options does NepTask offer?",
      answer:
        "NepTask offers extensive customization including personalized dashboards, custom fields for tasks, configurable workflows, and branded workspaces for teams. You can create custom views, filters, and sorting options tailored to your specific needs.",
    },
  ];
  const [activeAccordion, setActiveAccordion] = useState(null);
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 w-full ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-orange-500 uppercase font-bold mb-8 flex items-center justify-center gap-2">
            <RiQuestionnaireLine className="text-3xl" /> <span>FAQ</span>
          </h2>
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mt-4 mb-6">
            Frequently Asked Questions
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about NepTask.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="accordion-item mb-5 group rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <button
                className="accordion-header sm:text-[20px] duration-300 group-hover:text-orange-500 cursor-pointer w-full p-5 text-left font-semibold flex justify-between items-center"
                onClick={() => toggleAccordion(index)}>
                <span>{item.question}</span>
                <ChevronRight
                  className={`text-xl transition-transform group-hover:text-orange-500 ${
                    activeAccordion === index ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`accordion-content text-[16.5px] sm:text-[18px]  px-5 overflow-hidden transition-all duration-300 ${
                  activeAccordion === index ? "max-h-96 pb-5" : "max-h-0"
                }`}>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
