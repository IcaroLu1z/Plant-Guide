"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, Reply, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  votes: number; // Novo campo para contagem de votos
}

// Função para simular o backend
const mockFetchQuestions = (): Promise<Question[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          author: "Icaro",
          content: "Como cuidar de suculentas?",
          answers: [
            {
              id: 1,
              author: "Matheus",
              content: "Suculentas gostam de bastante luz e pouca água.",
              createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
              votes: 3,
            },
          ],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        },
        {
          id: 2,
          author: "Matheus",
          content: "Qual é a melhor época para plantar girassóis?",
          answers: [],
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        },
        {
          id: 3,
          author: "Matheus",
          content: "Qual é o melhor horário para regar plantas?",
          answers: [
            {
              id: 1,
              author: "Ícaro",
              content:
                "O melhor horário é pela manhã ou no final da tarde, quando o sol está mais ameno.",
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              votes: 5,
            },
          ],
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
        },
        {
          id: 4,
          author: "Ícaro",
          content: "Como evitar pragas no jardim?",
          answers: [
            {
              id: 1,
              author: "Matheus",
              content:
                "Usar repelentes naturais, como óleo de neem, pode ajudar a evitar pragas.",
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
              votes: 7,
            },
          ],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        },
        {
          id: 5,
          author: "Matheus",
          content: "Qual é a melhor maneira de adubar hortas orgânicas?",
          answers: [
            {
              id: 1,
              author: "Ícaro",
              content:
                "Adubos naturais, como esterco e compostagem, são ideais para hortas orgânicas.",
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              votes: 2,
            },
          ],
          createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 horas atrás
        },
        {
          id: 6,
          author: "Ícaro",
          content: "Quais plantas são ideais para ambientes internos?",
          answers: [
            {
              id: 1,
              author: "Matheus",
              content:
                "Plantas como a espada-de-são-jorge e o lírio da paz são ótimas para ambientes internos.",
              createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
              votes: 4,
            },
          ],
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
        },
        {
          id: 7,
          author: "Matheus",
          content: "Qual é a frequência ideal para podar árvores frutíferas?",
          answers: [
            {
              id: 1,
              author: "Ícaro",
              content:
                "O ideal é podar árvores frutíferas uma vez por ano, de preferência no inverno.",
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              votes: 6,
            },
          ],
          createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 horas atrás
        },
        {
          id: 8,
          author: "Ícaro",
          content: "Como melhorar a drenagem de vasos?",
          answers: [
            {
              id: 1,
              author: "Matheus",
              content:
                "Adicionar uma camada de pedras ou argila expandida no fundo do vaso ajuda na drenagem.",
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              votes: 3,
            },
          ],
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 horas atrás
        },
      ]);
    }, 1000); // Simulando delay de 1 segundo
  });
};


export default function ForumPage() {
  const [questions, setQuestions] = useState<Question[]>([]); // Lista de perguntas
  const [newQuestion, setNewQuestion] = useState(""); // Estado para nova pergunta
  const [newAnswer, setNewAnswer] = useState<{ [key: number]: string }>({}); // Respostas para cada pergunta
  const [showAnswerField, setShowAnswerField] = useState<{
    [key: number]: boolean;
  }>({}); // Mostrar/esconder campo de resposta

  useEffect(() => {
    // Simulando busca inicial de perguntas
    mockFetchQuestions().then((data) => setQuestions(data));
  }, []);

  // Função para adicionar uma nova pergunta
  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("Digite uma pergunta antes de enviar.");
      return;
    }

    const question: Question = {
      id: questions.length + 1,
      author: "Usuário Anônimo", // Mock para simular autor
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
                  author: "Usuário Anônimo", // Mock para simular autor
                  content: answerContent,
                  createdAt: new Date(),
                  votes: 0, // Inicializando com zero votos
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

  // Função para votar em uma resposta
  const handleVote = (questionId: number, answerId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId
                  ? { ...answer, votes: (answer.votes || 0) + 1 } // Garante que a contagem de votos seja numérica
                  : answer
              ),
            }
          : question
      )
    );
    toast.success("Você curtiu a resposta!");
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
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Fórum de Dúvidas sobre Plantas
      </h1>

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

      {/* Div contendo perguntas e respostas com rolagem */}
      <div className="max-h-96 overflow-y-auto">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question.id}
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <p className="font-semibold text-green-700">
                {question.author} -{" "}
                <span className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(question.createdAt), {
                    addSuffix: true,
                    locale: ptBR, // Usando a localidade em português
                  })}
                </span>
              </p>
              <p className="mb-2 text-black">{question.content}</p>

              {/* Botão para mostrar campo de resposta */}
              <button
                onClick={() => toggleAnswerField(question.id)}
                className="flex items-center text-green-600 hover:underline"
              >
                <Reply className="mr-1" /> Responder
              </button>

              {/* Campo para adicionar resposta */}
              {showAnswerField[question.id] && (
                <div className="mt-2">
                  <textarea
                    value={newAnswer[question.id] || ""}
                    onChange={(e) =>
                      setNewAnswer({
                        ...newAnswer,
                        [question.id]: e.target.value,
                      })
                    }
                    placeholder="Digite sua resposta..."
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
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
                <div
                  key={answer.id}
                  className="ml-4 mt-2 p-2 border-l-4 border-green-600"
                >
                  <p className="text-sm font-semibold text-green-600">
                    {answer.author} -{" "}
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(answer.createdAt), {
                        addSuffix: true,
                        locale: ptBR, // Usando a localidade em português
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-black">{answer.content}</p>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => handleVote(question.id, answer.id)}
                      className="flex items-center text-green-600 hover:underline"
                    >
                      <ThumbsUp className="mr-1" />
                      {answer.votes || 0} Curtidas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma pergunta encontrada.</p>
        )}
      </div>
    </div>
  );
}

