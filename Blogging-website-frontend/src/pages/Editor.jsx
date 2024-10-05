import { Form, Formik, Field } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormErrors, TagsInput } from "../components";
import { useArticleQuery } from "../hooks";
import useCreateArticle from "../hooks/useCreateArticle";
import './Editor.css';


function Editor() {
  const navigate = useNavigate();
  const articleQuery = useArticleQuery();
  const queryClient = useQueryClient();
  
  const article = articleQuery?.data?.article || {};
  // const { slug } = article;
  
    const { isCreating, createArticle } = useCreateArticle();
  
  
    async function onSubmit(values, { setErrors }) {
      try {
        // Submit the form using the createArticle mutation
        createArticle({ values });
        
        // Optionally invalidate queries based on whether there is a slug (edit mode)
        if (article?.slug) {
          queryClient.invalidateQueries(`/articles/${article.slug}`);
        } else {
          queryClient.invalidateQueries("/articles");
        }
    
        // Optionally navigate after successful creation or update
        navigate('/');
      } catch (error) {
        // Check if error.response exists before trying to access it
        if (error.response) {
          const { status, data } = error.response;
          if (status === 422) {
            setErrors(data.errors); // Set validation errors
          } else {
            alert(`Error ${status}: ${data.message}`); // Handle other HTTP errors
          }
        } else {
          // Handle cases where the response is undefined (network issues or other errors)
          console.error("An unexpected error occurred:", error);
          alert("An unexpected error occurred. Please try again.");
        }
      }
    }
    

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
          <h1 className="text-xs-center" style={{color: "#475756", marginBottom: "30px", marginTop: "60px"}}>Your Settings</h1>
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
                      <fieldset className="form-group">
                        <Field
                          name="title"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Article Title"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="description"
                          type="text"
                          className="form-control"
                          placeholder="What's this article about?"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="body"
                          as="textarea"
                          className="form-control"
                          rows={8}
                          placeholder="Write your article (in markdown)"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field name="tagList" component={TagsInput} />
                      </fieldset>
                      <div className="button-container">
                        <button 
                          className="btn btn-lg btn-primary" 
                          type="submit"
                          style={{ backgroundColor: "#243635", important: true , border: "none" , color: "#FCFBF9" , padding: "15px", width: "250px", }}
                        >
                          Publish Article
                        </button>
                      </div>
                    </fieldset>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Editor