import { FileText, MessageSquare, Sparkles, Send } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const PdfQa = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a PDF file");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("question", question);

      const { data } = await axios.post(
        "/api/ai/pdf-qa",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setAnswer(data.answer);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4D4D]" />
          <h1 className="text-xl font-semibold">PDF Q&A Assistant</h1>
        </div>
        
        <p className="mt-6 text-sm font-semibold">Upload PDF Document</p>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Max size: 10MB
        </p>

        <p className="mt-4 text-sm font-semibold">Your Question</p>
        <textarea
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 min-h-24 resize-none"
          placeholder="Ask something about the PDF... (Leave empty for AI-generated Q&A)"
        ></textarea>

        <button 
          disabled={loading} 
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#FF4D4D] to-[#F9CB28] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition-all hover:opacity-90"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Ask AI
            </>
          )}
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[400px] max-h-[600px]">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-[#FF4D4D]" />
          <h1 className="text-xl font-semibold">AI Answer</h1>
        </div>
        {!answer ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center px-4">
              <FileText className="w-9 h-9" />
              <p>Upload a document and click "Ask AI" to see the response here.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw prose prose-slate">
              <Markdown>{answer}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfQa;
