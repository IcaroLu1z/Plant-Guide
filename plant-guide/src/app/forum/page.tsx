"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, MessageSquare, Reply } from "lucide-react"; // Ícones para botões e visualização
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns"; // Biblioteca para formatação de data

// Interface de uma pergunta e respostas
interface Question {
  id: number;
  author: string;
  content: string;
  answers: Answer[];
  createdAt: Date;
}

interface Answer {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
}

export default function ForumPage() {
  {/*const { data: session } = useSession();*/} // Verifica sessão do usuário
  const [questions, setQuestions] = useState<Question[]>([]); // Lista de perguntas
  const [newQuestion, setNewQuestion] = useState(""); // Estado para nova pergunta
  const [newAnswer, setNewAnswer] = useState<{ [key: number]: string }>({}); // Respostas para cada pergunta
  const [showAnswerField, setShowAnswerField] = useState<{ [key: number]: boolean }>({}); // Estado para mostrar ou esconder o campo de resposta

  // Função para adicionar uma nova pergunta
  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("Digite uma pergunta antes de enviar.");
      return;
    }

    const question: Question = {
      id: questions.length + 1,
      author: session?.user?.name || "Usuário Anônimo",
      content: newQuestion,
      answers: [],
      createdAt: new Date(),
    };

    setQuestions([...questions, question]);
    setNewQuestion("");
    toast.success("Pergunta adicionada!");
  };

  // Função para adicionar uma resposta a uma pergunta específica
  const handleAddAnswer = (questionId: number) => {
    const answerContent = newAnswer[questionId];

    if (!answerContent?.trim()) {
      toast.error("Digite uma resposta antes de enviar.");
      return;
    }

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: [
                ...question.answers,
                {
                  id: question.answers.length + 1,
                  author: session?.user?.name || "Usuário Anônimo",
                  content: answerContent,
                  createdAt: new Date(),
                },
              ],
            }
          : question
      )
    );

    setNewAnswer({ ...newAnswer, [questionId]: "" });
    setShowAnswerField({ ...showAnswerField, [questionId]: false });
    toast.success("Resposta adicionada!");
  };

  // Função para alternar a visualização do campo de resposta
  const toggleAnswerField = (questionId: number) => {
    setShowAnswerField((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Fórum de Dúvidas sobre Plantas</h1>

      {/* Formulário para adicionar nova pergunta */}
      <div className="mb-6">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="w-full p-4 border border-gray-300 rounded-lg mb-2 text-black"
          rows={3}
        />
        <button
          onClick={handleAddQuestion}
          className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          <Send className="mr-2" />
          Enviar Pergunta
        </button>
      </div>

      {/* Lista de perguntas e respostas */}
      <div>
        {questions.map((question) => (
          <div key={question.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
            <p className="font-semibold text-green-700">
              {question.author} -{" "}
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </p>
            <p className="mb-2">{question.content}</p>

            {/* Botão para mostrar campo de resposta */}
            <button
              onClick={() => toggleAnswerField(question.id)}
              className="flex items-center text-green-600 hover:underline"
            >
              <Reply className="mr-1" /> Responder
            </button>

            {/* Campo para adicionar resposta, visível quando o botão é clicado */}
            {showAnswerField[question.id] && (
              <div className="mt-2">
                <textarea
                  value={newAnswer[question.id] || ""}
                  onChange={(e) => setNewAnswer({ ...newAnswer, [question.id]: e.target.value })}
                  placeholder="Digite sua resposta..."
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                  rows={2}
                />
                <button
                  onClick={() => handleAddAnswer(question.id)}
                  className="flex items-center bg-green-500 text-white py-1 px-3 rounded-lg"
                >
                  <MessageSquare className="mr-1" />
                  Enviar Resposta
                </button>
              </div>
            )}

            {/* Lista de Respostas */}
            {question.answers.map((answer) => (
              <div key={answer.id} className="ml-4 mt-2 p-2 border-l-4 border-green-600">
                <p className="text-sm font-semibold text-green-600">
                  {answer.author} -{" "}
                  <span className="text-gray-500 text-xs">
                    {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                  </span>
                </p>
                <p className="text-sm">{answer.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
