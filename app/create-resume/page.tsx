"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Heart,
  Wand2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import PersonalDetails from "../pages/PersonalDetails";
import EducationDetails from "../pages/EducationDetails";
import ExperienceDetails from "../pages/ExperienceDetails";
import SkillsDetails from "../pages/SkillsDetails";
import ProjectDetails from "../pages/ProjectDetails";
import HobbiesDetails from "../pages/HobbiesDetails";

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType<{ onNext: () => void }>;
  color: string;
}

const steps: Step[] = [
  {
    id: "PersonalDetails",
    label: "Personal",
    icon: User,
    component: PersonalDetails,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "EducationDetails",
    label: "Education",
    icon: GraduationCap,
    component: EducationDetails,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "ExperienceDetails",
    label: "Experience",
    icon: Briefcase,
    component: ExperienceDetails,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "ProjectDetails",
    label: "Projects",
    icon: FolderGit2,
    component: ProjectDetails,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "HobbiesDetails",
    label: "Hobbies",
    icon: Heart,
    component: HobbiesDetails,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "SkillsDetails",
    label: "Skills",
    icon: Wand2,
    component: SkillsDetails,
    color: "from-blue-500 to-indigo-500",
  },
];

const ResumePage = () => {
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleNext = () => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.add(activeStepIndex);
      return newSet;
    });
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      // All steps completed – navigate to resume preview
      router.push("/resume");
    }
  };

  const handleStepClick = (index: number) => {
    // Allow clicking on completed steps or the next immediate step
    if (index <= Math.max(...Array.from(completedSteps)) + 1) {
      setActiveStepIndex(index);
    }
  };

  const ActiveComponent = steps[activeStepIndex].component;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Create Your Resume
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in your details step by step. You can always come back and edit later.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <nav className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === activeStepIndex;
                  const isCompleted = completedSteps.has(index);
                  const isClickable = index <= (completedSteps.size > 0 ? Math.max(...Array.from(completedSteps)) : -1) + 1;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      disabled={!isClickable && index !== 0}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r " + step.color + " text-white shadow-lg"
                          : isCompleted
                          ? "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          : isClickable
                          ? "text-gray-600 hover:bg-gray-50"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? "bg-white/20"
                            : isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100"
                        }`}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="font-medium">{step.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Progress */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {Math.round((completedSteps.size / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                    style={{
                      width: `${((completedSteps.size + (activeStepIndex > Math.max(...Array.from(completedSteps)) ? 0 : 1)) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ActiveComponent onNext={handleNext} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
