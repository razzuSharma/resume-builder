"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, 
  Zap, 
  Palette, 
  Download, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "Lightning Fast",
    description: "Build your resume in minutes with our intuitive interface"
  },
  {
    icon: <Palette className="w-6 h-6 text-purple-500" />,
    title: "Beautiful Templates",
    description: "Choose from professionally designed resume templates"
  },
  {
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    title: "PDF Export",
    description: "Download your resume as a high-quality PDF instantly"
  }
];

const steps = [
  "Fill in your details",
  "Preview your resume",
  "Download as PDF"
];

const HomeComponent = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Free Resume Builder</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Craft Your Perfect{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                  Resume
                </span>{" "}
                in Minutes
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Create a professional, ATS-friendly resume that stands out. 
                No design skills needed — just your achievements and our magic.
              </p>

              {/* Steps */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden sm:block w-4 h-4 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/create-resume"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30"
                >
                  <FileText className="w-5 h-5" />
                  Build Your Resume
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/resume"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                >
                  View Example
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
                <Image
                  src="/background.png"
                  alt="Resume Preview"
                  width={600}
                  height={500}
                  className="w-full h-auto"
                  priority
                />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">AS</div>
                      <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">MK</div>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">10,000+ Resumes Created</p>
                      <p className="text-gray-500">Join happy job seekers today</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Resume Artisan?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We have packed everything you need to create a resume that gets you hired
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 p-8 lg:p-16 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of successful job seekers who have created their perfect resume with Resume Artisan
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/create-resume"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-teal-700 bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-teal-100 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Unlimited downloads
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  ATS-friendly formats
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeComponent;
