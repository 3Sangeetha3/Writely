import { Form, Formik, Field } from "formik";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FormErrors, TagsInput } from "../components";
import { useArticleQuery } from "../hooks";
import useCreateArticle from "../hooks/useCreateArticle";
import PostImage from "../assets/Post.svg";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Editor.css';
import { JoditField } from "../components";

function Editor() {
  const navigate = useNavigate();
  const articleQuery = useArticleQuery();
  const queryClient = useQueryClient();
  const article = articleQuery?.data?.article || {};
  const { isCreating, createArticle } = useCreateArticle();

  useEffect(() => {
    AOS.init();
  }, []);

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
    <div className="editor-page" data-aos="fade-up">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl font-bold text-[#475756] mb-8 mt-16">New post</h1>
        <div className="">
          {/* Left Column - Article Form */}
          <div className="lg:pr-8" data-aos="fade-right">
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
                  <Form>
                    <fieldset disabled={isSubmitting}>
                      <div className="space-y-4">
                        <fieldset className="form-group">
                          <Field
                            name="title"
                            type="text"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                            placeholder="Article Title"
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <Field
                            name="description"
                            type="text"
                            className="form-control w-full p-4 border rounded-md"
                            placeholder="What's this article about?"
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <Field
                            name="body"
                            // as="textarea"
                            component={JoditField} 
                            className="form-control w-full p-4 border rounded-md"
                            rows={8}
                            placeholder="Write your article (in markdown)"
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <Field name="tagList" component={TagsInput} />
                        </fieldset>
                        <div className="text-center m-4">
                          <button
                            className="bg-[#243635] text-[#FCFBF9] text-xl px-16 py-4 m-2 rounded-full"
                            type="submit"
                          >
                            Publish Article
                          </button>
                        </div>
                      </div>
                    </fieldset>
                  </Form>
                </>
              )}
            </Formik>
          </div>

          {/* Right Column - Illustration */}
          {/* <div className="md:pl-8" data-aos="fade-left">
            <div className="flex justify-center items-center">
              <img
                src={PostImage}
                alt="Editor Illustration"
                className="w-full max-w-md"
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Editor;
