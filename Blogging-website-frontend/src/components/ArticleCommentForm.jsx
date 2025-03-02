import { Field, Formik, Form } from "formik";
import React, { useEffect } from "react";
import useCreateComment from "../hooks/useCreateComment";
import { Send } from "lucide-react";
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";

function ArticleCommentForm() {
  const { createComment, isLoading: isCreatingComment } = useCreateComment();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // Validation schema
  const commentSchema = Yup.object().shape({
    body: Yup.string().required("Comment cannot be empty").min(3, "Comment too short")
  });

  async function onSubmit({ body }, { resetForm }) {
    createComment({ commentData: { body } });
    resetForm();
  }

  return (
    <Formik 
      onSubmit={onSubmit} 
      initialValues={{ body: "" }}
      validationSchema={commentSchema}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="w-full" data-aos="fade-up">
          <div className="mb-3">
            <Field
              as="textarea"
              required
              name="body"
              placeholder="Share your thoughts..."
              className={`w-full p-3 border ${
                errors.body && touched.body ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53C7C0] focus:border-transparent transition-all resize-none min-h-[100px]`}
            />
            {errors.body && touched.body && (
              <div className="text-red-500 text-sm mt-1">{errors.body}</div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              disabled={isSubmitting || isCreatingComment}
              type="submit"
              className="bg-[#53C7C0] hover:bg-[#45b1aa] text-white font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingComment ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ArticleCommentForm;