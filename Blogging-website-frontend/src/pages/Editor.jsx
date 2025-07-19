import { Form, Formik, Field } from "formik";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FormErrors, TagsInput, JoditField } from "../components";
import { useArticleQuery } from "../hooks";
import useCreateArticle from "../hooks/useCreateArticle";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Pencil, 
  Type, 
  FileText, 
  Tag, 
  Send, 
  Edit3, 
  Sparkles, 
  ChevronDown,
  ArrowLeft,
  Zap,
  BookOpen,
  Users,
  TrendingUp
} from "lucide-react";

function Editor() {
  const navigate = useNavigate();
  const articleQuery = useArticleQuery();
  const queryClient = useQueryClient();
  const article = articleQuery?.data?.article || {};
  const { isCreating, createArticle } = useCreateArticle();
  const formRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true
    });
  }, []);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tips = [
    {
      icon: Type,
      title: "Compelling Title",
      description: "Craft a title that hooks readers and clearly communicates your article's unique value proposition.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Pencil,
      title: "Engaging Content",
      description: "Write with clarity and passion. Use storytelling, examples, and break up text for better readability.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Tag,
      title: "Strategic Tags",
      description: "Choose 3-5 relevant tags that will help your target audience discover and connect with your content.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  async function onSubmit(values, { setErrors }) {
    try {
      createArticle({ values });
      if (article?.slug) {
        queryClient.invalidateQueries(`/articles/${article.slug}`);
      } else {
        queryClient.invalidateQueries("/articles");
      }
      navigate('/');
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422) {
          setErrors(data.errors);
        } else {
          alert(`Error ${status}: ${data.message}`);
        }
      } else {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-teal-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#53C7C0]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#243635]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center z-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg px-8 py-4 rounded-full border border-[#53C7C0]/30 shadow-lg shadow-[#53C7C0]/10 mb-8 hover:shadow-xl hover:shadow-[#53C7C0]/20 transition-all duration-500"
            data-aos="fade-down"
          >
            <Sparkles className="w-5 h-5 text-[#53C7C0] animate-pulse" />
            <span className="text-[#243635] font-semibold tracking-wide">Create Something Extraordinary</span>
            <Sparkles className="w-5 h-5 text-[#53C7C0] animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#243635] via-[#53C7C0] to-[#243635] bg-clip-text text-transparent mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            New Article
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 font-light"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Transform your ideas into compelling stories. Share your expertise, inspire others, and join a community of passionate writers.
          </p>

          {/* Tips Grid */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tips.map((tip, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-[#53C7C0]/10 transition-all duration-500 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={700 + index * 100}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 bg-gradient-to-br ${tip.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <tip.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-[#243635] mb-4">{tip.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center" data-aos="fade-up" data-aos-delay="1000">
            <button
              onClick={handleScrollToForm}
              className="group bg-gradient-to-r from-[#243635] to-[#53C7C0] hover:from-[#53C7C0] hover:to-[#243635] text-white px-8 py-4 rounded-2xl shadow-lg shadow-[#53C7C0]/25 hover:shadow-xl hover:shadow-[#53C7C0]/40 transition-all duration-500 font-semibold text-lg flex items-center gap-3 hover:-translate-y-1"
              aria-label="Start writing your article"
            >
              <Zap className="w-6 h-6 group-hover:animate-pulse" />
              Start Writing Now
              <ChevronDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-300/20 border border-white/60 overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#243635] via-[#53C7C0] to-[#243635] px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <Edit3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Article Editor</h2>
                    <p className="text-white/90 text-sm">Craft your story with our powerful editor</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300 group"
                >
                  <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-8 md:p-12">
              <Formik
                onSubmit={onSubmit}
                initialValues={{
                  title: article?.title || '',
                  description: article?.description || '',
                  body: article?.body || '',
                  tagList: [],
                }}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <>
                    <FormErrors />
                    <Form className="space-y-10">
                      <fieldset disabled={isSubmitting} className="space-y-10">
                        {/* Title Field */}
                        <div className="group" data-aos="fade-right" data-aos-delay="300">
                          <label className="block mb-4">
                            <span className="flex items-center gap-3 text-lg font-bold text-[#243635] mb-3">
                              <div className="p-2 bg-[#53C7C0]/10 rounded-lg">
                                <Type className="w-5 h-5 text-[#53C7C0]" />
                              </div>
                              Article Title
                            </span>
                          </label>
                          <div className="relative">
                            <Field
                              name="title"
                              type="text"
                              className="w-full outline-none px-6 py-5 bg-white/80 border-2 border-gray-200 rounded-2xl focus:border-[#53C7C0] focus:bg-white focus:shadow-lg focus:shadow-[#53C7C0]/10 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300 font-medium"
                              placeholder="Enter a captivating title that draws readers in..."
                            />
                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                              <div className="w-3 h-3 bg-gradient-to-r from-[#53C7C0] to-[#243635] rounded-full opacity-60"></div>
                            </div>
                          </div>
                        </div>

                        {/* Description Field */}
                        <div className="group" data-aos="fade-right" data-aos-delay="400">
                          <label className="block mb-4">
                            <span className="flex items-center gap-3 text-lg font-bold text-[#243635] mb-3">
                              <div className="p-2 bg-[#53C7C0]/10 rounded-lg">
                                <FileText className="w-5 h-5 text-[#53C7C0]" />
                              </div>
                              Article Description
                            </span>
                          </label>
                          <div className="relative">
                            <Field
                              name="description"
                              type="text"
                              className="outline-none w-full px-6 py-5 bg-white/80 border-2 border-gray-200 rounded-2xl focus:border-[#53C7C0] focus:bg-white focus:shadow-lg focus:shadow-[#53C7C0]/10 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300"
                              placeholder="Write a compelling description that summarizes your article's value..."
                            />
                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                              <div className="w-3 h-3 bg-gradient-to-r from-[#53C7C0] to-[#243635] rounded-full opacity-60"></div>
                            </div>
                          </div>
                        </div>

                        {/* Body Field */}
                        <div className="group" data-aos="fade-right" data-aos-delay="500">
                          <label className="block mb-4">
                            <span className="flex items-center gap-3 text-lg font-bold text-[#243635] mb-3">
                              <div className="p-2 bg-[#53C7C0]/10 rounded-lg">
                                <Pencil className="w-5 h-5 text-[#53C7C0]" />
                              </div>
                              Article Content
                            </span>
                          </label>
                          <div className="relative">
                            <div className="bg-white/80 border-2 border-gray-200 rounded-2xl focus-within:border-[#53C7C0] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#53C7C0]/10 transition-all duration-300 group-hover:border-gray-300 overflow-hidden">
                              <Field
                                name="body"
                                component={JoditField}
                                className="min-h-[400px] w-full"
                                placeholder="Start crafting your story here. Share your insights, experiences, and unique perspective..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tags Field */}
                        <div className="group" data-aos="fade-right" data-aos-delay="600">
                          <label className="block mb-4">
                            <span className="flex items-center gap-3 text-lg font-bold text-[#243635] mb-3">
                              <div className="p-2 bg-[#53C7C0]/10 rounded-lg">
                                <Tag className="w-5 h-5 text-[#53C7C0]" />
                              </div>
                              Tags
                            </span>
                          </label>
                          <div className="relative">
                            <div className="bg-white/80 border-2 border-gray-200 rounded-2xl focus-within:border-[#53C7C0] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#53C7C0]/10 transition-all duration-300 group-hover:border-gray-300 px-6 py-5">
                              <Field name="tagList" component={TagsInput} />
                            </div>
                            <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Add 3-5 strategic tags to maximize your article's discoverability
                            </p>
                          </div>
                        </div>

                        {/* Submit Section */}
                        <div className="pt-10 border-t border-gray-200/50" data-aos="fade-up" data-aos-delay="700">
                          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                            <div className="flex gap-4">
                              <button
                                type="button"
                                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 font-semibold hover:shadow-md flex items-center gap-2"
                                onClick={() => navigate('/')}
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting || isCreating}
                                className="group relative px-10 py-4 bg-gradient-to-r from-[#243635] to-[#53C7C0] hover:from-[#53C7C0] hover:to-[#243635] text-white rounded-2xl transition-all duration-500 font-bold shadow-xl shadow-[#53C7C0]/30 hover:shadow-2xl hover:shadow-[#53C7C0]/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                              >
                                <div className="flex items-center gap-3">
                                  {isCreating ? (
                                    <>
                                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                      Publishing Article...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                      Publish Article
                                    </>
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </Form>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Editor;