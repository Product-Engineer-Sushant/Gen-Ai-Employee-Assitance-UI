import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FaUserTie,
  FaRobot,
  FaPaperPlane,
  FaPlus,
  FaEllipsisV,
} from "react-icons/fa";
import MarkdownRenderer from "./components/shared/Markdown";
import axios from 'axios';
import CreateEmployee from "./components/employee/CreateEmployee";
import ShowEmployee, { type Employee } from "./components/employee/showEmployee";
import EditEmployee from "./components/employee/editEmployee";
import DeleteEmployee from "./components/employee/deleteEmployee";

axios.defaults.baseURL = "http://localhost:8080"

interface Message {
  id: number;
  sender: "user" | "assistant";
  message: string | ReactNode;
  time: string;
}

const sampleMessages: Message[] = [
   {
    id: 1,
    sender: "assistant",
    message:
      "Hello! 👋 I'm Employee Assistant. How can I help you today?",
    time: "10:30 AM",
  }
];

export default function EmployeeAssistant() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const openEmployeeAction = (action: "edit" | "delete", employee: Employee) => {
    const message: ReactNode = action === "edit"
      ? <EditEmployee initialEmployee={employee} />
      : <DeleteEmployee initialEmployee={employee} />;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "assistant",
        message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };


  const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const prompt = input.trim();

  const userMessage: Message = {
    id: Date.now(),
    sender: "user",
    message: prompt,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, userMessage]);
  setLoading(true);
  setInput("");

  try {
    console.log("Sending prompt:", prompt);

    const response = await axios.post("/ai", {
      prompt: prompt,
    });

    console.log("AI Response:", response.data);

    const data = response.data;
    const assistantType = data.type

    let message: ReactNode;

    if (assistantType === "CREATE_EMPLOYEE") {
      message = <CreateEmployee />;
    } else if (assistantType === "FETCH_EMPLOYEE") {
      message = (
        <ShowEmployee
          data={data.data}
          onEdit={(employee) => openEmployeeAction("edit", employee)}
          onDelete={(employee) => openEmployeeAction("delete", employee)}
        />
      );
    } else if (assistantType === "UPDATE_EMPLOYEE") {
      message = <EditEmployee />;
    } else if (assistantType === "DELETE_EMPLOYEE") {
      message = <DeleteEmployee />;
    } else {
      message = typeof data === "string" ? data : "I couldn't determine how to handle that request.";
    } 

    // Assistant Message Here
    const assistantMessage: Message = {
      id: Date.now() + 1,
      sender: "assistant",
      message: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, assistantMessage]);

  } catch (err: any) {
    console.error("AI API Error:", err);

    const errorMessage: Message = {
      id: Date.now() + 1,
      sender: "assistant",
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, errorMessage]);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col overflow-hidden">
      {/* ================= HEADER ================= */}
      <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
        {/* Branding */}
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <img src="https://scontent.fktm2-1.fna.fbcdn.net/v/t39.30808-6/394661160_3575247812691975_501937334091549984_n.jpg?stp=dst-jpg_tt6&cstp=mx720x720&ctp=s720x720&_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHmLl8yzZRk12CTexj3YCTP_N1tZIuR65b83W1ki5HrlmucQiT76mtdKn_qZUfSZiGFpZlwDGoeXljrnbLR6eUB&_nc_ohc=uk0NISZvPuoQ7kNvwHVV34v&_nc_oc=AdoCtaI8MhJ0uF0Hv3-N49DgydgM4yXWz4Ov-3GKHClHwmDTYVVaqQJUZj1yl9m67mA8bgAAryUHja3NFhi2gfRD&_nc_zt=23&_nc_ht=scontent.fktm2-1.fna&_nc_gid=2vhcanEvIAX4KtCRKjdyTw&_nc_ss=7b2a8&oh=00_AQIFTJA1IftbtzJBO56keA0hCc4497-TQpz--lhkcj9m_w&oe=6A9E0BD3" alt="profile" className="border-r-8" />
          </div> */}

          <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <img
              src="https://scontent.fktm2-1.fna.fbcdn.net/v/t39.30808-6/394661160_3575247812691975_501937334091549984_n.jpg?stp=dst-jpg_tt6&cstp=mx720x720&ctp=s720x720&_nc_cat=100&ccb=1-7&_nc_sid=6ee11a8&_nc_eui2=AeHmLl8yzZRk12CTexj3YCTP_N1tZIuR65b83W1ki5HrlmucQiT76mtdKn_qZUfSZiGFpZlwDGoeXljrnbLR6eUB&_nc_ohc=uk0NISZvPuoQ7kNvwHVV34v&_nc_oc=AdoCtaI8MhJ0uF0Hv3-N49DgydgM4yXWz4Ov-3GKHClHwmDTYVVaqQJUZj1yl9m67mA8bgAAryUHja3NFhi2gfRD&_nc_zt=23&_nc_ht=scontent.fktm2-1.fna&_nc_gid=2vhcanEvIAX4KtCRKjdyTw&_nc_ss=7b2a8&oh=00_AQIFTJA1IftbtzJBO56keA0hCc4497-TQpz--lhkcj9m_w&oe=6A9E0BD3"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              Employee Assistant
            </h1>

            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2">
          {/* <button
            className="w-9 h-9 rounded-lg hover:bg-gray-100 
                       flex items-center justify-center text-gray-600"
          >
            <FaPlus />
          </button> */}

          <p className="font-bold italic"> ❤❤ Made by Sushant Chaudhary ❤❤ </p>

          {/* <button
            className="w-9 h-9 rounded-lg hover:bg-gray-100 
                       flex items-center justify-center text-gray-600"
          >
            <FaEllipsisV />
          </button> */}
        </div>
      </header>

      {/* ================= MAIN CHAT ================= */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
          {/* Welcome */}
          <div className="text-center mb-8">
            <div
              className="mx-auto mb-3 w-14 h-14 rounded-2xl 
                         bg-blue-600 text-white flex items-center 
                         justify-center shadow"
            >
              <FaRobot size={25} />
            </div>

             
            <h2 className="text-xl font-semibold text-gray-800">
              
            </h2>
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Chat GPT ( Employee Assistant )
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Ask me anything about your employees
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-5">
            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={message.id}
                  className={` flex items-start gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Assistant Icon */}
                  {!isUser && (
                    <div
                      className="shrink-0 w-9 h-9 rounded-full 
                                 bg-blue-100 text-blue-600 
                                 flex items-center justify-center"
                    >
                      <FaRobot size={16} />
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`max-w-[80%] md:max-w-[65%] ${
                      isUser ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isUser
                          ? "bg-blue-400 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {
                        typeof message.message === "string" ? (
                          <MarkdownRenderer content={message.message} />
                        ) : (
                          message.message
                        )
                      }
                    </div>

                    <span className="text-[11px] text-gray-400 mt-1 px-1">
                      {message.time}
                    </span>
                  </div>

                  {/* User Icon */}
                  {isUser && (
                    // <div
                    //   className="shrink-0 w-9 h-9 rounded-full 
                    //              bg-gray-200 text-gray-600 
                    //              flex items-center justify-center"
                    // >
                    //   <FaUserTie size={15} />
                    // </div>

                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <img
                        src="https://scontent.fktm2-1.fna.fbcdn.net/v/t39.30808-6/394661160_3575247812691975_501937334091549984_n.jpg?stp=dst-jpg_tt6&cstp=mx720x720&ctp=s720x720&_nc_cat=100&ccb=1-7&_nc_sid=6ee11a8&_nc_eui2=AeHmLl8yzZRk12CTexj3YCTP_N1tZIuR65b83W1ki5HrlmucQiT76mtdKn_qZUfSZiGFpZlwDGoeXljrnbLR6eUB&_nc_ohc=uk0NISZvPuoQ7kNvwHVV34v&_nc_oc=AdoCtaI8MhJ0uF0Hv3-N49DgydgM4yXWz4Ov-3GKHClHwmDTYVVaqQJUZj1yl9m67mA8bgAAryUHja3NFhi2gfRD&_nc_zt=23&_nc_ht=scontent.fktm2-1.fna&_nc_gid=2vhcanEvIAX4KtCRKjdyTw&_nc_ss=7b2a8&oh=00_AQIFTJA1IftbtzJBO56keA0hCc4497-TQpz--lhkcj9m_w&oe=6A9E0BD3"
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* ================= LOADER ================= */}
            {loading && (
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 shrink-0 rounded-full 
                             bg-blue-100 text-blue-600 
                             flex items-center justify-center"
                >
                  <FaRobot size={16} />
                </div>

                <div
                  className="bg-white border border-gray-200 
                             rounded-2xl rounded-tl-sm 
                             px-5 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 
                                 animate-bounce [animation-delay:150ms]"
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-gray-400 
                                 animate-bounce [animation-delay:300ms]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={latestMessageRef} />
          </div>
        </div>
      </main>

      {/* ================= FOOTER / INPUT ================= */}
      <footer className="shrink-0 bg-white border-t border-gray-200 px-4 md:px-8 py-3">
        <div className="max-w-5xl mx-auto">
          <div
            className="flex items-end gap-2 bg-gray-100 
                       border border-gray-200 rounded-2xl 
                       px-3 py-2 focus-within:border-blue-500 
                       focus-within:ring-2 focus-within:ring-blue-100"
          >
            {/* Plus button */}
            <button
              className="shrink-0 w-9 h-9 rounded-xl 
                         hover:bg-gray-200 text-gray-500 
                         flex items-center justify-center"
            >
              <FaPlus size={14} />
            </button>

            {/* Input */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask Employee Assistant..."
              rows={1}
              className="flex-1 resize-none bg-transparent 
                         outline-none border-none text-sm 
                         text-gray-700 placeholder-gray-400 
                         py-2 max-h-32"
            />

            {/* Send */}
            <button
              onClick={sendMessage}
              id="command_action"
              disabled={!input.trim() || loading}
              className="shrink-0 w-10 h-10 rounded-xl 
                         bg-blue-600 text-white 
                         flex items-center justify-center 
                         hover:bg-blue-700 
                         disabled:opacity-40 
                         disabled:cursor-not-allowed 
                         transition"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-2">
            Employee Assistant can make mistakes. Please verify important
            information.
          </p>
        </div>
      </footer>
    </div>
  );
}
